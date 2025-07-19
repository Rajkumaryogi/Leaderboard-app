import React from 'react';
import defaultAvatar from '../assets/logo_c.png';
import '../RankCard.css';

const crownColors = {
  1: '#FFD700', // Gold
  2: '#C0C0C0', // Silver
  3: '#CD7F32', // Bronze
};

function RankCard({ user }) {
  return (
    <div className="rank-card" style={{ borderColor: crownColors[user.rank] }}>
      <div className="crown" style={{ color: crownColors[user.rank] }}>👑</div>
      <img src={defaultAvatar} alt="avatar" />
      <div className="rank">{user.rank}</div>
      <div className="name">{maskName(user.name)}</div>
      <div className="points">{user.totalPoints} pts</div>
    </div>
  );
}

function maskName(name) {
  return name.length > 2 ? `${name[0]}****${name[name.length - 1]}` : name;
}

export default RankCard;
