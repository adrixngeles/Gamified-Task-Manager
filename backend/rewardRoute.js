import express from 'express';
import Reward from './reward.js';
import User from './users.js';  // Import User model

const router = express.Router();

// Add a new reward
router.post('/add', async (req, res) => {
  const { name, cost } = req.body;  // Removed description

  try {
    const newReward = new Reward({ name, cost });
    await newReward.save();
    res.status(201).json({ msg: 'Reward added successfully', reward: newReward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error adding reward' });
  }
});

// Get all available rewards
router.get('/', async (req, res) => {
  try {
    const rewards = await Reward.find({ available: true });  // Only show available rewards
    res.status(200).json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error fetching rewards' });
  }
});

// Redeem a reward (user spends points)
router.post('/redeem', async (req, res) => {
  const { userId, rewardId } = req.body;

  try {
    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);

    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (!reward) return res.status(404).json({ msg: 'Reward not found' });

    // Check if user has enough points to redeem the reward
    if (user.score < reward.cost) {
      return res.status(400).json({ msg: 'Not enough points to redeem this reward' });
    }

    // Deduct points from user and mark the reward as redeemed (delete from database)
    user.score -= reward.cost;
    await user.save();

    // Remove the reward from the database (it's redeemed)
    await reward.remove();

    res.status(200).json({
      msg: 'Reward redeemed successfully',
      remainingPoints: user.score,
      reward: reward.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error redeeming reward' });
  }
});

export default router;