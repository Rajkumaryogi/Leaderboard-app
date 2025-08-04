import React, { useState, useEffect } from 'react';
import UserSelection from './components/UserSelection';
import ClaimButton from './components/ClaimButton';
import Leaderboard from './components/Leaderboard';
import PointHistory from './components/PointHistory';
import { SocketProvider } from './context/SocketContext';
import api from './api';
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
    api.get('/api/users')
      .then(res => {
        setUsers(res.data);
        // console.log('Fetched Users:', res.data);
      })
      .catch(err => console.error('Failed to fetch users:', err));
  };

  const handleClaimPoints = (userId) => {
    setIsClaiming(true);
    api.post(`/api/points/${userId}/claim`)
      .then(res => {
        setLastClaim(res.data);
        setIsClaiming(false);
      })
      .catch(err => {
        console.error('Claim failed:', err);
        setIsClaiming(false);
      });
  };

  const handleAddUser = (name) => {
    api.post('/api/users', { name })
      .then(() => fetchUsers())
      .catch(err => console.error('Add user failed:', err));
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
