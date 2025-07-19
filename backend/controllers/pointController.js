const User = require('../models/User');
const PointHistory = require('../models/PointHistory');
const { getIo } = require('../socket');

exports.claimPoints = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const points = Math.floor(Math.random() * 10) + 1;
    
    user.totalPoints += points;
    await user.save();
    
    const history = new PointHistory({ userId: user._id, points });
    await history.save();
    
    // Get updated rankings
    const users = await User.find().sort({ totalPoints: -1 });
    const rankedUsers = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));

    // Emit real-time update to all clients
    getIo().emit('leaderboard-update', {
      users: rankedUsers,
      updatedUser: {
        id: user._id,
        pointsAdded: points,
        newTotal: user.totalPoints
      }
    });

    res.json({ points, totalPoints: user.totalPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPointHistory = async (req, res) => {
  try {
    const history = await PointHistory.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};