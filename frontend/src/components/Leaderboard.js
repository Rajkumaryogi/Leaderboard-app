import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import RankCard from './RankCard';
import '../styles.css';

function Leaderboard({ users: initialUsers }) {
  const socket = useSocket();
  const [leaderboardUsers, setLeaderboardUsers] = useState(initialUsers);

  // Set initial leaderboard with backend ranks
  useEffect(() => {
    setLeaderboardUsers(initialUsers);
  }, [initialUsers]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    // Handle leaderboard update (from backend)
    const handleLeaderboardUpdate = ({ users }) => {
      // console.log("Received ranked users from backend:", users);
      setLeaderboardUsers(users); // Use backend-ranked list directly
    };

    // Handle new user addition
    const handleNewUser = (newUser) => {
      setLeaderboardUsers(prev => {
        const updated = [...prev, { ...newUser, totalPoints: 0 }];
        return updated; // backend will emit a fresh update anyway
      });
    };

    socket.on('leaderboard-update', handleLeaderboardUpdate);
    socket.on('user-added', handleNewUser);

    return () => {
      socket.off('leaderboard-update', handleLeaderboardUpdate);
      socket.off('user-added', handleNewUser);
    };
  }, [socket]);

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
            highlight={user._id === socket?.id} // Optional: highlight current user
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
              <td>{user.name}</td>
              <td>{user.totalPoints.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Masking function for user name
function maskName(name) {
  if (!name) return '';
  if (name.length <= 2) return name;
  
  const first = name[0];
  const last = name[name.length - 1];
  const stars = '*'.repeat(Math.min(3, name.length - 2));
  
  return `${first}${stars}${last}`;
}

export default Leaderboard;
