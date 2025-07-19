const mongoose = require('mongoose');

const pointHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PointHistory', pointHistorySchema);