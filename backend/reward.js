import mongoose from 'mongoose';

// Reward Schema for storing rewards that users can redeem with points
const RewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },  // Points required to redeem the reward
  available: { type: Boolean, default: true },  // Whether the reward is still available for redemption
});

const Reward = mongoose.model('Reward', RewardSchema);

export default Reward;