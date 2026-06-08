const mongoose = require('mongoose');

const visitorCountSchema = new mongoose.Schema({
  subdomain: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  total_visits: {
    type: Number,
    default: 1000,
  },
  unique_visits: {
    type: Number,
    default: 600,
  },
}, { timestamps: true });

module.exports = mongoose.model('VisitorCount', visitorCountSchema);
