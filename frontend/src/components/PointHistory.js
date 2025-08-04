import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import api from '../api';

function PointHistory({ userId }) {
  const [history, setHistory] = useState([]);
  const socket = useSocket();
  
  // Fetch point history from backend
  useEffect(() => {
    if (userId) {
      api.get(`/api/points/${userId}/history`)
        .then(res => setHistory(res.data))
        .catch(err => {
          console.error('Failed to fetch history:', err);
        });
    }
  }, [userId]);

  // Listen for live point updates
  useEffect(() => {
    if (!socket || !userId) return;

    const handlePointsUpdate = ({ userId: updatedUserId, pointsAdded }) => {
      if (updatedUserId === userId) {
        setHistory(prev => [
          {
            points: pointsAdded,
            createdAt: new Date().toISOString(),
            userId: { _id: userId }
          },
          ...prev,
        ]);
      }
    };

    socket.on('points-updated', handlePointsUpdate);

    return () => {
      socket.off('points-updated', handlePointsUpdate);
    };
  }, [socket, userId]);

  return (
    <div className="point-history">
      <h3>Point History</h3>
      {history.length > 0 ? (
        <ul>
          {history.map((record, index) => (
            <li key={index}>
              {new Date(record.createdAt).toLocaleString()}: +{record.points} points
            </li>
          ))}
        </ul>
      ) : (
        <p>No history available</p>
      )}
    </div>
  );
}

export default PointHistory;
