import express from 'express';
import User from './users.js';

const router = express.Router();

// Send Friend Request
router.post('/send-friend-request', async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ msg: 'User not found' });

    if (user.pendingFriends.includes(friendId)) {
      return res.status(400).json({ msg: 'Friend request already sent' });
    }

    user.pendingFriends.push(friendId);
    await user.save();

    res.status(200).json({ msg: 'Friend request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error sending friend request' });
  }
});

// Accept Friend Request
router.post('/accept-friend-request', async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ msg: 'User not found' });

    user.pendingFriends = user.pendingFriends.filter(id => id.toString() !== friendId);
    user.friends.push(friendId);

    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.status(200).json({ msg: 'Friend request accepted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error accepting friend request' });
  }
});

// Get Friend List
router.get('/friends/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('friends', 'username email');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error fetching friends list' });
  }
});

export default router;