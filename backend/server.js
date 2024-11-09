import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './auth.js';  // Import the authentication routes
import friendRoutes from './friends.js';
import taskRoutes from './tasks.js'; // Import task routes

dotenv.config();  // Load environment variables

// Suppress the warning or prepare for Mongoose 7
mongoose.set('strictQuery', false);  // or true, depending on your desired behavior

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  const app = express();
  app.use(express.json());
  
  // Use authentication routes
  app.use('/api/auth', authRoutes);
  
  // Use friend-related routes
  app.use('/api/friends', friendRoutes);
  
  // Use task-related routes
  app.use('/api/tasks', taskRoutes);
  
  // Use reward-related routes
  app.use('/api/rewards', rewardRoutes);
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));