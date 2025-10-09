import { useState, useEffect } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from './firebase';
import { QRCodeSVG } from 'qrcode.react';
import TeamJoin from './components/TeamJoin';
import CollaborativeCanvas from './components/CollaborativeCanvas';
import VotingScreen from './components/VotingScreen';
import AdminPanel from './components/AdminPanel';
import Leaderboard from './components/Leaderboard';
import './App.css';

const getDeviceId = () => {
  let deviceId = localStorage.getItem('csm_device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('csm_device_id', deviceId);
  }
  return deviceId;
};

const ROUND_PROMPTS = [
  { title: "Round 1: Favorite Character", prompt: "Draw your favorite Chainsaw Man character", duration: 600 },
  { title: "Round 2: Design a Devil", prompt: "Design your own Devil", duration: 600 },
  { title: "Round 3: Iconic Scene", prompt: "Recreate an iconic Chainsaw Man scene", duration: 900 }
];

function App() {
  const [gameState, setGameState] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [userName, setUserName] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [teams, setTeams] = useState({});
  const deviceId = getDeviceId();

  useEffect(() => {
    const gameStateRef = ref(database, 'gameState');
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
      } else {
        const initialState = {
          phase: 'setup',
          currentRound: 0,
          roundStartTime: null
        };
        set(gameStateRef, initialState);
        setGameState(initialState);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const teamsRef = ref(database, 'teams');
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      setTeams(data || {});
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedTeam = localStorage.getItem('csm_user_team');
    const savedName = localStorage.getItem('csm_user_name');
    if (savedTeam && savedName) {
      // Check if the team still exists in Firebase
      if (teams[savedTeam]) {
        setUserTeam(savedTeam);
        setUserName(savedName);
      } else {
        // Team no longer exists, clear localStorage
        localStorage.removeItem('csm_user_team');
        localStorage.removeItem('csm_user_name');
      }
    }
  }, [teams]);

  const handleJoinTeam = (teamId, name) => {
    setUserTeam(teamId);
    setUserName(name);
    localStorage.setItem('csm_user_team', teamId);
    localStorage.setItem('csm_user_name', name);
  };

  const handleLeaveTeam = () => {
    setUserTeam(null);
    setUserName(null);
    localStorage.removeItem('csm_user_team');
    localStorage.removeItem('csm_user_name');
  };

  if (!gameState) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Connecting to Firebase...</p>
          <p className="error-hint">If this persists, check your Firebase configuration in src/firebase.js</p>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const currentRoundData = ROUND_PROMPTS[gameState.currentRound] || ROUND_PROMPTS[0];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="glitch-text" data-text="CHAINSAW MAN">CHAINSAW MAN</h1>
          <h2 className="subtitle">DRAWING COMPETITION</h2>
        </div>
        <button
          className="admin-button"
          onClick={() => setShowAdmin(!showAdmin)}
        >
          {showAdmin ? 'Hide Admin' : 'Admin'}
        </button>
      </header>

      {showAdmin && (
        <AdminPanel
          gameState={gameState}
          teams={teams}
          onClose={() => setShowAdmin(false)}
        />
      )}

      <main className="app-main">
        {/* Setup Phase */}
        {gameState.phase === 'setup' && (
          <div className="phase-container setup-phase">
            <div className="welcome-card">
              <h2>Welcome to the Chainsaw Man Drawing Competition!</h2>
              <p>Admin: Click the Admin button and start registration to begin.</p>
              <div className="game-info">
                <h3>How it works:</h3>
                <ol>
                  <li>Have a single person per team create a team</li>
                  <li>Draw collaboratively on a shared canvas</li>
                  <li>Vote for your favorite drawings</li>
                  <li>Top 3 finishers gets points!</li>
                </ol>
                <h3>Rounds:</h3>
                <ul>
                  {ROUND_PROMPTS.map((round, idx) => (
                    <li key={idx}>
                      <strong>{round.title}:</strong> {round.prompt} ({round.duration / 60} minutes)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Registration Phase */}
        {gameState.phase === 'registration' && (
          <div className="phase-container registration-phase">
            <div className="qr-section">
              <h3>Scan to Join!</h3>
              <div className="qr-code-container">
                <QRCodeSVG value={currentUrl} size={200} level="H" />
              </div>
              <p className="url-display">{currentUrl}</p>
            </div>

            {!userTeam || !teams[userTeam] ? (
              <TeamJoin onJoinTeam={handleJoinTeam} teams={teams} />
            ) : (
              <div className="team-joined-card">
                <h3>You're in!</h3>
                <div className="team-info">
                  <p className="team-name">{teams[userTeam].name}</p>
                  <p className="user-name">Playing as: {userName}</p>
                  <div className="team-members">
                    <h4>Team Members:</h4>
                    <ul>
                      {teams[userTeam].members?.map((member, idx) => (
                        <li key={idx} className={member === userName ? 'current-user' : ''}>
                          {member}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button onClick={handleLeaveTeam} className="leave-button">
                  Leave Team
                </button>
                <p className="waiting-message">Waiting for admin to start the game...</p>
              </div>
            )}

            <div className="teams-list">
              <h3>Current Teams ({Object.keys(teams).length})</h3>
              <div className="teams-grid">
                {Object.entries(teams).map(([teamId, team]) => (
                  <div key={teamId} className="team-card">
                    <h4>{team.name}</h4>
                    <p className="member-count">{team.members?.length || 0} members</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Drawing Phase */}
        {gameState.phase === 'drawing' && (
          <div className="phase-container drawing-phase">
            <div className="round-header">
              <h2>{currentRoundData.title}</h2>
              <p className="prompt">{currentRoundData.prompt}</p>
              <div className="timer-container">
                <Timer
                  startTime={gameState.roundStartTime}
                  duration={currentRoundData.duration}
                />
              </div>
            </div>

            {userTeam ? (
              <CollaborativeCanvas
                teamId={userTeam}
                round={gameState.currentRound}
                userName={userName}
              />
            ) : (
              <div className="not-joined-message">
                <p>You haven't joined a team yet!</p>
                <p>Registration is closed for this round.</p>
              </div>
            )}

            <div className="other-teams-drawing">
              <h3>Teams currently drawing: {Object.keys(teams).length}</h3>
            </div>
          </div>
        )}

        {/* Voting Phase */}
        {gameState.phase === 'voting' && (
          <div className="phase-container voting-phase">
            <h2>Vote for the Best Drawings!</h2>
            <p className="voting-instructions">
              Select your top 3 favorite drawings (you cannot vote for your own team)
            </p>
            <VotingScreen
              round={gameState.currentRound}
              teams={teams}
              userTeam={userTeam}
              deviceId={deviceId}
            />
          </div>
        )}

        {/* Results Phase */}
        {gameState.phase === 'results' && (
          <div className="phase-container results-phase">
            <h2>Round {gameState.currentRound + 1} Results</h2>
            <Leaderboard teams={teams} />
            <p className="waiting-message">
              {gameState.currentRound < 2
                ? "Admin will start the next round soon..."
                : "Admin will show final results..."
              }
            </p>
          </div>
        )}

        {/* Final Results Phase */}
        {gameState.phase === 'final' && (
          <div className="phase-container final-phase">
            <h2 className="glitch-text" data-text="FINAL RESULTS">FINAL RESULTS</h2>
            <Leaderboard teams={teams} isFinal={true} />
            <div className="celebration">
              <p>Thank you for participating!</p>
              <p>Powered by Terrapin Anime Society</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Timer({ startTime, duration }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
      <span className="time-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

export default App;
