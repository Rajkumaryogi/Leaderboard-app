import React, { useState, useEffect } from 'react';
import UserSelection from './components/UserSelection';
import ClaimButton from './components/ClaimButton';
import Leaderboard from './components/Leaderboard';
import PointHistory from './components/PointHistory';
import { SocketProvider } from './context/SocketContext';
import './styles.css';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [lastClaim, setLastClaim] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('https://leaderboard-app-production-95ce.up.railway.app/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const handleClaimPoints = (userId) => {
    setIsClaiming(true);
    fetch(`https://leaderboard-app-production-95ce.up.railway.app/api/points/${userId}/claim`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        setLastClaim(data);
        setIsClaiming(false);
      })
      .catch(() => setIsClaiming(false));
  };

  const handleAddUser = (name) => {
    fetch('https://leaderboard-app-production-95ce.up.railway.app/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }).then(() => fetchUsers());
  };

  return (
    <SocketProvider>
      <div className="app">
        <h1>Real-Time Leaderboard</h1>
        
        <div className="control-panel">
          <UserSelection 
            users={users} 
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            onAddUser={handleAddUser}
          />
          
          <ClaimButton 
            selectedUserId={selectedUserId}
            onClaim={handleClaimPoints}
            isClaiming={isClaiming}
          />
        </div>
        
        {lastClaim && (
          <div className="last-claim">
            Last claim: +{lastClaim.points} points (Total: {lastClaim.totalPoints})
          </div>
        )}
        
        <Leaderboard users={users} />
        
        {selectedUserId && <PointHistory userId={selectedUserId} />}
      </div>
    </SocketProvider>
  );
}

export default App;