import { useState, useEffect } from 'react';
import { ref, get, set, onValue } from 'firebase/database';
import { database } from '../firebase';

function VotingScreen({ round, teams, userTeam, deviceId }) {
  const [drawings, setDrawings] = useState({});
  const [myVote, setMyVote] = useState(null);
  const [voteTallies, setVoteTallies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDrawings();
    loadMyVote();
    // Listen to live vote tallies
    const votesRef = ref(database, `votes/round${round}`);
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const allVotes = snapshot.val() || {};
      calculateTallies(allVotes);
    });

    return () => unsubscribe();
  }, [round]);

  const loadDrawings = async () => {
    try {
      setLoading(true);
      const drawingsRef = ref(database, 'drawings');
      const snapshot = await get(drawingsRef);
      const allDrawings = snapshot.val() || {};

      const roundDrawings = {};
      Object.entries(allDrawings).forEach(([key, data]) => {
        if (key.startsWith(`round${round}-`)) {
          const teamId = key.replace(`round${round}-`, '');
          if (data.imageData && teams[teamId]) {
            roundDrawings[teamId] = {
              imageData: data.imageData,
              teamName: teams[teamId].name
            };
          }
        }
      });

      setDrawings(roundDrawings);
    } catch (err) {
      console.error('Error loading drawings:', err);
      setError('Failed to load drawings');
    } finally {
      setLoading(false);
    }
  };

  const loadMyVote = async () => {
    try {
      const voteRef = ref(database, `votes/round${round}/${deviceId}`);
      const snapshot = await get(voteRef);
      if (snapshot.exists()) {
        setMyVote(snapshot.val().teamId);
      }
    } catch (err) {
      console.error('Error loading vote:', err);
    }
  };

  const calculateTallies = (allVotes) => {
    const tallies = {};
    Object.values(allVotes).forEach(vote => {
      if (vote.teamId) {
        tallies[vote.teamId] = (tallies[vote.teamId] || 0) + 1;
      }
    });
    setVoteTallies(tallies);
  };

  const handleVote = async (teamId) => {
    if (teamId === userTeam) {
      setError('You cannot vote for your own team!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const voteRef = ref(database, `votes/round${round}/${deviceId}`);
      await set(voteRef, {
        teamId,
        timestamp: Date.now(),
        userTeam: userTeam || 'spectator'
      });

      setMyVote(teamId);
      setError('');
    } catch (err) {
      console.error('Error submitting vote:', err);
      setError('Failed to submit vote. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="voting-loading">
        <div className="spinner"></div>
        <p>Loading drawings...</p>
      </div>
    );
  }

  const teamsList = Object.entries(drawings).filter(([teamId]) => teamId !== userTeam);

  if (teamsList.length === 0) {
    return (
      <div className="voting-empty">
        <p>No drawings to vote on yet.</p>
      </div>
    );
  }

  // Sort teams by vote count for display
  const sortedTeams = teamsList.sort(([aId], [bId]) => {
    return (voteTallies[bId] || 0) - (voteTallies[aId] || 0);
  });

  return (
    <div className="voting-screen">
      <div className="voting-header">
        <h2>Vote for the Best Drawings!</h2>
        <p className="voting-instructions">
          Select your top 3 favorite drawings (you cannot vote for your own team)
        </p>
        <div className="voting-points-info">
          <p className="points-heading">The top 3 drawings with the most votes will receive points:</p>
          <ul className="points-list">
            <li className="gold">1st Place: 3 points</li>
            <li className="silver">2nd Place: 2 points</li>
            <li className="bronze">3rd Place: 1 point</li>
          </ul>
        </div>
        {myVote && (
          <p className="current-vote-status">
            You voted for <strong>{teams[myVote]?.name}</strong>
          </p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="drawings-gallery">
        <div className="drawings-grid">
          {sortedTeams.map(([teamId, drawing]) => {
            const voteCount = voteTallies[teamId] || 0;
            const isMyVote = myVote === teamId;

            return (
              <div
                key={teamId}
                className={`drawing-card voting-card ${isMyVote ? 'my-vote' : ''}`}
                onClick={() => handleVote(teamId)}
              >
                <div className="drawing-header">
                  <h4>{drawing.teamName}</h4>
                  <div className="vote-count">
                    <span className="count">{voteCount} votes</span>
                  </div>
                </div>
                <div className="drawing-image">
                  <img src={drawing.imageData} alt={`${drawing.teamName}'s drawing`} />
                  {isMyVote && (
                    <div className="my-vote-overlay">
                      <span className="check-icon">✓</span>
                      <span>Your Vote</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VotingScreen;
