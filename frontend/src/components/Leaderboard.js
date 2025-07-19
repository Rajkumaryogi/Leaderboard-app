import React, { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import RankCard from './RankCard';
import '../styles.css';

function Leaderboard({ users: initialUsers }) {
  const socket = useSocket();
  const [leaderboardUsers, setLeaderboardUsers] = useState(() => 
    initialUsers.map((user, index) => ({ ...user, rank: index + 1 }))
  );

  // Function to update ranks whenever points change
  const updateRanks = useCallback((users) => {
    const sorted = [...users].sort((a, b) => b.totalPoints - a.totalPoints);
    return sorted.map((user, index) => ({ ...user, rank: index + 1 }));
  }, []);

  // Handle initial users and prop updates
  useEffect(() => {
    setLeaderboardUsers(updateRanks(initialUsers));
  }, [initialUsers, updateRanks]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handlePointsUpdate = ({ userId, totalPoints }) => {
      setLeaderboardUsers(prev => {
        const updated = prev.map(user => 
          user._id === userId ? { ...user, totalPoints } : user
        );
        return updateRanks(updated);
      });
    };

    const handleNewUser = (newUser) => {
      setLeaderboardUsers(prev => 
        updateRanks([...prev, { ...newUser, totalPoints: 0 }])
      );
    };

    socket.on('points-updated', handlePointsUpdate);
    socket.on('user-added', handleNewUser);

    return () => {
      socket.off('points-updated', handlePointsUpdate);
      socket.off('user-added', handleNewUser);
    };
  }, [socket, updateRanks]);

  // Separate top 3 for podium and others for table
  const topThree = leaderboardUsers.slice(0, 3);
  const others = leaderboardUsers.slice(3);

  return (
    <div className="leaderboard">
      <h2>🏆 Monthly Wealth Ranking</h2>

      {/* Podium for top 3 */}
      <div className="podium-container">
        {topThree.map(user => (
          <RankCard 
            key={user._id} 
            user={user} 
            highlight={user._id === socket?.id} // Highlight current user if needed
          />
        ))}
      </div>

      {/* Table for remaining users */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {others.map(user => (
            <tr 
              key={user._id} 
              className={user.rank <= 3 ? `top-${user.rank}` : ''}
            >
              <td>{user.rank}</td>
              <td>{maskName(user.name)}</td>
              <td>{user.totalPoints.toLocaleString()}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Improved name masking function
function maskName(name) {
  if (!name) return '';
  if (name.length <= 2) return name;
  
  const first = name[0];
  const last = name[name.length - 1];
  const stars = '*'.repeat(Math.min(3, name.length - 2));
  
  return `${first}${stars}${last}`;
}

export default Leaderboard;