import { useMemo } from 'react';

function Leaderboard({ teams, isFinal = false }) {
  const sortedTeams = useMemo(() => {
    return Object.entries(teams)
      .map(([id, team]) => ({ id, ...team }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [teams]);

  if (sortedTeams.length === 0) {
    return (
      <div className="leaderboard">
        <p className="no-teams">No teams yet</p>
      </div>
    );
  }

  const topThree = sortedTeams.slice(0, 3);
  const restOfTeams = sortedTeams.slice(3);

  return (
    <div className="leaderboard">
      {isFinal && (
        <div className="podium">
          {topThree.length >= 2 && (
            <div className="podium-position second">
              <div className="podium-medal silver-medal">2</div>
              <div className="podium-info">
                <h3>{topThree[1].name}</h3>
                <p className="score">{topThree[1].score || 0} points</p>
              </div>
              <div className="podium-stand silver-stand">
                <span className="stand-label">2nd</span>
              </div>
            </div>
          )}

          {topThree.length >= 1 && (
            <div className="podium-position first">
              <div className="podium-crown">👑</div>
              <div className="podium-medal gold-medal">1</div>
              <div className="podium-info">
                <h3>{topThree[0].name}</h3>
                <p className="score">{topThree[0].score || 0} points</p>
              </div>
              <div className="podium-stand gold-stand">
                <span className="stand-label">1st</span>
              </div>
            </div>
          )}

          {topThree.length >= 3 && (
            <div className="podium-position third">
              <div className="podium-medal bronze-medal">3</div>
              <div className="podium-info">
                <h3>{topThree[2].name}</h3>
                <p className="score">{topThree[2].score || 0} points</p>
              </div>
              <div className="podium-stand bronze-stand">
                <span className="stand-label">3rd</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="leaderboard-list">
        <h3>{isFinal ? 'Full Rankings' : 'Current Standings'}</h3>
        <div className="rankings">
          {sortedTeams.map((team, index) => (
            <div
              key={team.id}
              className={`ranking-item ${
                index === 0 ? 'rank-1' :
                index === 1 ? 'rank-2' :
                index === 2 ? 'rank-3' : ''
              }`}
            >
              <div className="rank-number">
                {index === 0 && isFinal ? '🥇' :
                 index === 1 && isFinal ? '🥈' :
                 index === 2 && isFinal ? '🥉' :
                 `#${index + 1}`}
              </div>
              <div className="team-info-leaderboard">
                <h4>{team.name}</h4>
                <p className="members-count">{team.members?.length || 0} members</p>
              </div>
              <div className="team-score">
                <span className="score-value">{team.score || 0}</span>
                <span className="score-label">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {restOfTeams.length > 0 && isFinal && (
        <div className="other-teams">
          <details>
            <summary>Show all teams ({restOfTeams.length} more)</summary>
            <div className="other-teams-list">
              {restOfTeams.map((team, index) => (
                <div key={team.id} className="other-team-item">
                  <span className="position">#{index + 4}</span>
                  <span className="name">{team.name}</span>
                  <span className="score">{team.score || 0} pts</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
