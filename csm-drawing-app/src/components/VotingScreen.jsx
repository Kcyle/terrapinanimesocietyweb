import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebase';

function VotingScreen({ round, teams, userTeam, deviceId }) {
  const [drawings, setDrawings] = useState({});
  const [votes, setVotes] = useState({ first: '', second: '', third: '' });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDrawings();
    checkIfVoted();
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

  const checkIfVoted = async () => {
    try {
      const voteRef = ref(database, `votes/round${round}/${deviceId}`);
      const snapshot = await get(voteRef);
      if (snapshot.exists()) {
        setHasVoted(true);
        setVotes(snapshot.val());
      }
    } catch (err) {
      console.error('Error checking votes:', err);
    }
  };

  const handleVoteSelect = (position, teamId) => {
    if (hasVoted) return;

    if (teamId === userTeam) {
      setError('You cannot vote for your own team!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const currentVotes = { ...votes, [position]: teamId };
    const voteValues = Object.values(currentVotes).filter(v => v);
    const uniqueVotes = new Set(voteValues);

    if (voteValues.length !== uniqueVotes.size) {
      setError('You cannot vote for the same team multiple times!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setVotes({ ...votes, [position]: teamId });
    setError('');
  };

  const handleSubmitVotes = async () => {
    if (hasVoted) return;

    if (!votes.first || !votes.second || !votes.third) {
      setError('Please select all three positions (1st, 2nd, 3rd)');
      return;
    }

    const voteValues = [votes.first, votes.second, votes.third];
    const uniqueVotes = new Set(voteValues);
    if (voteValues.length !== uniqueVotes.size) {
      setError('You cannot vote for the same team multiple times!');
      return;
    }

    if (userTeam && voteValues.includes(userTeam)) {
      setError('You cannot vote for your own team!');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const voteRef = ref(database, `votes/round${round}/${deviceId}`);
      await set(voteRef, {
        first: votes.first,
        second: votes.second,
        third: votes.third,
        timestamp: Date.now(),
        userTeam: userTeam || 'spectator'
      });

      setHasVoted(true);
    } catch (err) {
      console.error('Error submitting votes:', err);
      setError('Failed to submit votes. Please try again.');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="voting-screen">
      {hasVoted ? (
        <div className="vote-confirmation">
          <div className="confirmation-icon">✓</div>
          <h3>Your votes have been submitted!</h3>
          <div className="vote-summary">
            <div className="vote-item">
              <span className="vote-position gold">1st Place:</span>
              <span className="vote-team">{teams[votes.first]?.name}</span>
            </div>
            <div className="vote-item">
              <span className="vote-position silver">2nd Place:</span>
              <span className="vote-team">{teams[votes.second]?.name}</span>
            </div>
            <div className="vote-item">
              <span className="vote-position bronze">3rd Place:</span>
              <span className="vote-team">{teams[votes.third]?.name}</span>
            </div>
          </div>
          <p className="waiting-text">Waiting for admin to tally votes...</p>
        </div>
      ) : (
        <>
          <div className="vote-selection-panel">
            <h3>Select Your Top 3</h3>
            <div className="vote-selections">
              <div className="vote-selector">
                <label className="gold">1st Place (3 points)</label>
                <select
                  value={votes.first}
                  onChange={(e) => handleVoteSelect('first', e.target.value)}
                  disabled={submitting}
                >
                  <option value="">-- Select --</option>
                  {teamsList.map(([teamId, drawing]) => (
                    <option key={teamId} value={teamId}>
                      {drawing.teamName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="vote-selector">
                <label className="silver">2nd Place (2 points)</label>
                <select
                  value={votes.second}
                  onChange={(e) => handleVoteSelect('second', e.target.value)}
                  disabled={submitting}
                >
                  <option value="">-- Select --</option>
                  {teamsList.map(([teamId, drawing]) => (
                    <option key={teamId} value={teamId}>
                      {drawing.teamName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="vote-selector">
                <label className="bronze">3rd Place (1 point)</label>
                <select
                  value={votes.third}
                  onChange={(e) => handleVoteSelect('third', e.target.value)}
                  disabled={submitting}
                >
                  <option value="">-- Select --</option>
                  {teamsList.map(([teamId, drawing]) => (
                    <option key={teamId} value={teamId}>
                      {drawing.teamName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              className="submit-votes-button"
              onClick={handleSubmitVotes}
              disabled={submitting || !votes.first || !votes.second || !votes.third}
            >
              {submitting ? 'Submitting...' : 'Submit Votes'}
            </button>
          </div>

          <div className="drawings-gallery">
            <h3>All Drawings</h3>
            <div className="drawings-grid">
              {teamsList.map(([teamId, drawing]) => (
                <div
                  key={teamId}
                  className={`drawing-card ${
                    votes.first === teamId ? 'selected-first' :
                    votes.second === teamId ? 'selected-second' :
                    votes.third === teamId ? 'selected-third' : ''
                  }`}
                >
                  <div className="drawing-header">
                    <h4>{drawing.teamName}</h4>
                    {votes.first === teamId && <span className="vote-badge gold">1st</span>}
                    {votes.second === teamId && <span className="vote-badge silver">2nd</span>}
                    {votes.third === teamId && <span className="vote-badge bronze">3rd</span>}
                  </div>
                  <div className="drawing-image">
                    <img src={drawing.imageData} alt={`${drawing.teamName}'s drawing`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VotingScreen;
