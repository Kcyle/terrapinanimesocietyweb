import { useState, useEffect } from 'react';
import { ref, set, get, update } from 'firebase/database';
import { database } from '../firebase';

const ADMIN_PASSWORD = 'chainsaw123';

function AdminPanel({ gameState, teams, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('csm_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && gameState.phase === 'voting') {
      loadVotes();
    }
  }, [isAuthenticated, gameState.phase]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('csm_admin_auth', 'true');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const loadVotes = async () => {
    try {
      const votesRef = ref(database, `votes/round${gameState.currentRound}`);
      const snapshot = await get(votesRef);
      setVotes(snapshot.val() || {});
    } catch (err) {
      console.error('Error loading votes:', err);
    }
  };

  const updateGameState = async (updates) => {
    setLoading(true);
    try {
      const gameStateRef = ref(database, 'gameState');
      await update(gameStateRef, updates);
    } catch (err) {
      console.error('Error updating game state:', err);
      setError('Failed to update game state');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRegistration = () => {
    updateGameState({ phase: 'registration' });
  };

  const handleStartRound = (roundNumber) => {
    updateGameState({
      phase: 'drawing',
      currentRound: roundNumber,
      roundStartTime: Date.now()
    });
  };

  const handleEndDrawing = () => {
    updateGameState({ phase: 'voting' });
  };

  const handleTallyVotes = async () => {
    setLoading(true);
    try {
      const votesRef = ref(database, `votes/round${gameState.currentRound}`);
      const snapshot = await get(votesRef);
      const roundVotes = snapshot.val() || {};

      // Calculate vote tallies for each team
      const voteTallies = {};
      Object.values(roundVotes).forEach((vote) => {
        if (vote.teamId) {
          voteTallies[vote.teamId] = (voteTallies[vote.teamId] || 0) + 1;
        }
      });

      // Sort teams by vote count (descending)
      const sortedEntries = Object.entries(voteTallies)
        .sort(([, aVotes], [, bVotes]) => bVotes - aVotes);

      // Assign points with tie handling
      // 1st place = 3 points, 2nd = 2, 3rd = 1
      // If teams tie, they all get the same points for that placement
      const points = {};
      const pointValues = [3, 2, 1]; // 1st, 2nd, 3rd

      let currentPlaceIndex = 0; // Current position in the sorted list (0-based)
      let i = 0;

      while (i < sortedEntries.length && currentPlaceIndex < pointValues.length) {
        const currentVotes = sortedEntries[i][1];
        const currentPoints = pointValues[currentPlaceIndex];

        // Count how many teams have this vote count (tied teams)
        let tiedTeamsCount = 0;
        let j = i;
        while (j < sortedEntries.length && sortedEntries[j][1] === currentVotes) {
          points[sortedEntries[j][0]] = currentPoints;
          tiedTeamsCount++;
          j++;
        }

        // Move to next position in sorted list
        i = j;
        // Skip placements based on number of tied teams
        // Example: 3 teams tie for 1st, next placement is 4th (index 3)
        currentPlaceIndex += tiedTeamsCount;
      }

      const teamsRef = ref(database, 'teams');
      const teamsSnapshot = await get(teamsRef);
      const currentTeams = teamsSnapshot.val() || {};

      const updates = {};
      Object.keys(currentTeams).forEach((teamId) => {
        const currentScore = currentTeams[teamId].score || 0;
        const roundPoints = points[teamId] || 0;
        updates[`${teamId}/score`] = currentScore + roundPoints;
      });

      await update(teamsRef, updates);

      await updateGameState({ phase: 'results' });
    } catch (err) {
      console.error('Error tallying votes:', err);
      setError('Failed to tally votes');
    } finally {
      setLoading(false);
    }
  };

  const handleNextRound = () => {
    const nextRound = gameState.currentRound + 1;
    if (nextRound < 4) {
      updateGameState({
        phase: 'drawing',
        currentRound: nextRound,
        roundStartTime: Date.now()
      });
    }
  };

  const handleShowFinalResults = () => {
    updateGameState({ phase: 'final' });
  };

  const handleResetGame = async () => {
    if (!confirm('Are you sure you want to reset the entire game? This will delete all teams, drawings, and votes!')) {
      return;
    }

    setLoading(true);
    try {
      await set(ref(database, 'gameState'), {
        phase: 'setup',
        currentRound: 0,
        roundStartTime: null
      });

      await set(ref(database, 'teams'), {});

      await set(ref(database, 'drawings'), {});

      await set(ref(database, 'votes'), {});

      localStorage.removeItem('csm_user_team');
      localStorage.removeItem('csm_user_name');

      alert('Game has been reset!');
    } catch (err) {
      console.error('Error resetting game:', err);
      setError('Failed to reset game');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <div className="admin-login">
          <h3>Admin Login</h3>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Login</button>
          </form>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const voteCount = Object.keys(votes).length;
  const teamCount = Object.keys(teams).length;

  return (
    <div className="admin-panel">
      <div className="admin-content">
        <div className="admin-header">
          <h3>Admin Panel</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="admin-info">
          <div className="info-card">
            <label>Current Phase:</label>
            <span className="phase-badge">{gameState.phase}</span>
          </div>
          <div className="info-card">
            <label>Current Round:</label>
            <span>{gameState.currentRound + 1} / 4</span>
          </div>
          <div className="info-card">
            <label>Teams:</label>
            <span>{teamCount}</span>
          </div>
          {gameState.phase === 'voting' && (
            <div className="info-card">
              <label>Votes Received:</label>
              <span>{voteCount}</span>
            </div>
          )}
        </div>

        <div className="admin-controls">
          {gameState.phase === 'setup' && (
            <button
              className="admin-action-button primary"
              onClick={handleStartRegistration}
              disabled={loading}
            >
              Start Registration
            </button>
          )}

          {gameState.phase === 'registration' && (
            <>
              <button
                className="admin-action-button primary"
                onClick={() => handleStartRound(0)}
                disabled={loading || teamCount === 0}
              >
                Start Round 1
              </button>
              {teamCount === 0 && (
                <p className="warning-text">Waiting for teams to join...</p>
              )}
            </>
          )}

          {gameState.phase === 'drawing' && (
            <button
              className="admin-action-button warning"
              onClick={handleEndDrawing}
              disabled={loading}
            >
              End Drawing → Start Voting
            </button>
          )}

          {gameState.phase === 'voting' && (
            <>
              <button
                className="admin-action-button primary"
                onClick={handleTallyVotes}
                disabled={loading}
              >
                Tally Votes → Show Results
              </button>
              <p className="info-text">
                {voteCount} vote{voteCount !== 1 ? 's' : ''} received
              </p>
            </>
          )}

          {gameState.phase === 'results' && (
            <>
              {gameState.currentRound < 3 ? (
                <button
                  className="admin-action-button primary"
                  onClick={handleNextRound}
                  disabled={loading}
                >
                  Start Round {gameState.currentRound + 2}
                </button>
              ) : (
                <button
                  className="admin-action-button primary"
                  onClick={handleShowFinalResults}
                  disabled={loading}
                >
                  Show Final Results
                </button>
              )}
            </>
          )}

          {gameState.phase === 'final' && (
            <p className="info-text">Game Complete! Reset to start over.</p>
          )}

          <div className="admin-divider"></div>

          <button
            className="admin-action-button danger"
            onClick={handleResetGame}
            disabled={loading}
          >
            Reset Entire Game
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Teams Overview */}
        <div className="teams-overview">
          <h4>Teams</h4>
          <div className="teams-table">
            {teamCount === 0 ? (
              <p className="no-data">No teams yet</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Members</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(teams)
                    .sort(([, a], [, b]) => (b.score || 0) - (a.score || 0))
                    .map(([teamId, team]) => (
                      <tr key={teamId}>
                        <td>{team.name}</td>
                        <td>{team.members?.length || 0}</td>
                        <td>{team.score || 0}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Votes Overview */}
        {gameState.phase === 'voting' && voteCount > 0 && (
          <div className="votes-overview">
            <h4>Live Vote Tallies</h4>
            <div className="votes-list">
              {(() => {
                const voteTallies = {};
                Object.values(votes).forEach((vote) => {
                  if (vote.teamId) {
                    voteTallies[vote.teamId] = (voteTallies[vote.teamId] || 0) + 1;
                  }
                });

                return Object.entries(voteTallies)
                  .sort(([, aVotes], [, bVotes]) => bVotes - aVotes)
                  .map(([teamId, count], index) => (
                    <div key={teamId} className="vote-item-admin">
                      <div className="vote-rank">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        #{index + 1}
                      </div>
                      <div className="vote-team-info">
                        <strong>{teams[teamId]?.name || 'Unknown'}</strong>
                        <span>{count} vote{count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
