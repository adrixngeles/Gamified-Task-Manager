import React, { useState } from 'react';
import lowImage from 'C:/Users/Adrian/Pictures/Saved Pictures/Mad.png';       // Image for low points threshold
import mediumImage from 'C:/Users/Adrian/Pictures/Saved Pictures/Decent.png';  // Image for medium points threshold
import highImage from 'C:/Users/Adrian/Pictures/Saved Pictures/Happy.png';
import './App.css';

function HabitHero() {
    const [points, setPoints] = useState(80); // Example starting points
    const [rewards, setRewards] = useState([{ name: 'Reward 1', cost: 10 }]);

    // Function to handle redeeming rewards
    const redeemReward = (cost) => {
        if (points >= cost) {
            setPoints(points - cost);
        } else {
            alert("Not enough points to redeem this reward.");
        }
    };

    const getGaugeImage = () => {
        if (points >= points * 0.66) return highImage; // Top third of points
        if (points >= points * 0.33) return mediumImage; // Middle third of points
        return lowImage; // Bottom third of points
    };

    // Function to handle adding new rewards
    const addReward = () => {
        setRewards([...rewards, { name: 'New Reward', cost: 0 }]);
    };

    // Function to handle removing a reward
    const removeReward = (index) => {
        setRewards(rewards.filter((_, i) => i !== index));
    };

    return (
        <div className="habit-hero-container">
            <div className="habit-hero">
                <header className="header">
                    <button className="tab-button">☰</button>
                    <h1 className="title">Points & Rewards</h1>
                </header>
                
                <div className="points-section">
                    <div className="points-display">
                        <h2>{points}</h2>
                        <p>points</p>
                    </div>

                    <div className="gauge-section">
                        <div className="half-gauge" style={{ '--points': points }}></div>
                        <div className="gauge-image">
                        <img src={getGaugeImage()} alt="Gauge level" />
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                <div className="rewards-section">
                    <h3>Rewards</h3>
                    <button onClick={addReward}>Add Reward</button>
                    <ul>
                        {rewards.map((reward, index) => (
                            <li key={index} className="reward-item">
                                <input 
                                    type="text" 
                                    value={reward.name} 
                                    onChange={(e) => {
                                        const newRewards = [...rewards];
                                        newRewards[index].name = e.target.value;
                                        setRewards(newRewards);
                                    }}
                                />
                                <input 
                                    type="number" 
                                    value={reward.cost} 
                                    onChange={(e) => {
                                        const newRewards = [...rewards];
                                        newRewards[index].cost = Number(e.target.value);
                                        setRewards(newRewards);
                                    }}
                                />
                                <button onClick={() => redeemReward(reward.cost)}>Redeem</button>
                                <button onClick={() => removeReward(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HabitHero;
