const User = require('../models/User');
const PointHistory = require('../models/PointHistory');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    const rankedUsers = users.map((user, index) => ({
      ...user._doc,
      rank: index + 1
    }));
    res.json(rankedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const existingUser = await User.findOne({ name });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ name });
    await user.save();
    
    // Emit new user event
    req.io.emit('user-added', user);
    
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};