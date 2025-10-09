import { useState } from 'react';
import { ref, set, get, update } from 'firebase/database';
import { database } from '../firebase';

function TeamJoin({ onJoinTeam, teams }) {
  const [mode, setMode] = useState('join'); // 'join' or 'create'
  const [teamName, setTeamName] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = (name, team) => {
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!team.trim()) {
      setError(mode === 'create' ? 'Please enter a team name' : 'Please select a team');
      return false;
    }
    if (name.trim().length > 20) {
      setError('Name must be 20 characters or less');
      return false;
    }
    if (team.trim().length > 30) {
      setError('Team name must be 30 characters or less');
      return false;
    }
    return true;
  };

  const createTeam = async () => {
    if (!validateInputs(userName, teamName)) return;

    setLoading(true);
    setError('');

    try {
      const teamId = 'team_' + Date.now();
      const teamsRef = ref(database, `teams/${teamId}`);

      const allTeamsSnapshot = await get(ref(database, 'teams'));
      const allTeams = allTeamsSnapshot.val() || {};
      const teamExists = Object.values(allTeams).some(
        team => team.name.toLowerCase() === teamName.trim().toLowerCase()
      );

      if (teamExists) {
        setError('A team with this name already exists');
        setLoading(false);
        return;
      }

      await set(teamsRef, {
        name: teamName.trim(),
        members: [userName.trim()],
        score: 0,
        createdAt: Date.now()
      });

      onJoinTeam(teamId, userName.trim());
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const joinExistingTeam = async () => {
    if (!validateInputs(userName, selectedTeam)) return;

    setLoading(true);
    setError('');

    try {
      const teamRef = ref(database, `teams/${selectedTeam}`);
      const teamSnapshot = await get(teamRef);
      const team = teamSnapshot.val();

      if (!team) {
        setError('Team not found');
        setLoading(false);
        return;
      }

      if (team.members && team.members.length >= 6) {
        setError('This team is full (max 6 members)');
        setLoading(false);
        return;
      }

      if (team.members && team.members.includes(userName.trim())) {
        setError('A member with this name already exists in this team');
        setLoading(false);
        return;
      }

      const updatedMembers = [...(team.members || []), userName.trim()];
      await update(teamRef, { members: updatedMembers });

      onJoinTeam(selectedTeam, userName.trim());
    } catch (err) {
      console.error('Error joining team:', err);
      setError('Failed to join team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      createTeam();
    } else {
      joinExistingTeam();
    }
  };

  const teamsList = Object.entries(teams);

  return (
    <div className="team-join-container">
      <div className="team-join-card">
        <div className="mode-selector">
          <button
            className={`mode-button ${mode === 'join' ? 'active' : ''}`}
            onClick={() => {
              setMode('join');
              setError('');
            }}
          >
            Join Team
          </button>
          <button
            className={`mode-button ${mode === 'create' ? 'active' : ''}`}
            onClick={() => {
              setMode('create');
              setError('');
            }}
          >
            Create Team
          </button>
        </div>

        <form onSubmit={handleSubmit} className="team-join-form">
          <div className="form-group">
            <label htmlFor="userName">Your Name</label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              disabled={loading}
            />
          </div>

          {mode === 'create' ? (
            <div className="form-group">
              <label htmlFor="teamName">Team Name</label>
              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                maxLength={30}
                disabled={loading}
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="teamSelect">Select Team</label>
              {teamsList.length > 0 ? (
                <select
                  id="teamSelect"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  disabled={loading}
                >
                  <option value="">-- Choose a team --</option>
                  {teamsList.map(([teamId, team]) => (
                    <option
                      key={teamId}
                      value={teamId}
                      disabled={team.members && team.members.length >= 6}
                    >
                      {team.name} ({team.members?.length || 0}/6 members)
                      {team.members && team.members.length >= 6 ? ' - FULL' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="no-teams-message">
                  No teams yet. Be the first to create one!
                </p>
              )}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={loading || (mode === 'join' && teamsList.length === 0)}
          >
            {loading ? 'Please wait...' : mode === 'create' ? 'Create Team' : 'Join Team'}
          </button>
        </form>

        {mode === 'join' && teamsList.length > 0 && (
          <div className="teams-preview">
            <h4>Available Teams</h4>
            <div className="teams-preview-list">
              {teamsList.map(([teamId, team]) => (
                <div
                  key={teamId}
                  className={`team-preview-item ${team.members?.length >= 6 ? 'full' : ''}`}
                >
                  <strong>{team.name}</strong>
                  <span className="member-count">
                    {team.members?.length || 0}/6
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamJoin;
