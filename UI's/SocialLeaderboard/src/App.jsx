import React, { useState } from 'react';
import './App.css';

function HabitHeroLeaderboard() {
  const [partyMembers, setPartyMembers] = useState([
    { username: 'Adrian', points: 150 },
    { username: 'Harrison', points: 200 },
    { username: 'Ethan', points: 180 },
    { username: 'Elijah', points: 220 },
  ]);

  const leaderboard = [...partyMembers].sort((a, b) => b.points - a.points);

  return (
    <div className="habit-hero-leaderboard">
      <button className="tab-button">☰</button>
      <header className="header">
        <h1 className="title">Leaderboard</h1>
      </header>

      <div className="leaderboard-rectangle">
        {leaderboard.map((member, index) => (
          <div key={member.username} className="leaderboard-item">
            <span className="rank">{index + 1 + ".)"}</span>
            <span className="username">{member.username}</span>
            <span className="points">{member.points} pts</span>
          </div>
        ))}
      </div>

      <div className="party-members-section">
        <h2>Party Members</h2>
        <ul className="party-members-list">
          {partyMembers.map((member) => (
            <li key={member.username} className="party-member-item">
              <span className="username">{member.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HabitHeroLeaderboard;
