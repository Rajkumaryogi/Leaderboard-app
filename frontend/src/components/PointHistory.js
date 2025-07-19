import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

function PointHistory({ userId }) {
  const [history, setHistory] = useState([]);
  const socket = useSocket();
  
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8000/api/points/${userId}/history`)
        .then(res => res.json())
        .then(data => setHistory(data));
    }
  }, [userId]);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.on('points-updated', ({ userId: updatedUserId, pointsAdded }) => {
      if (updatedUserId === userId) {
        setHistory(prev => [{
          points: pointsAdded,
          createdAt: new Date().toISOString(),
          userId: { _id: userId }
        }, ...prev]);
      }
    });

    return () => {
      socket.off('points-updated');
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