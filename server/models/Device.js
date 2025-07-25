const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    required: true,
    unique: true
  },
  snmpCommunity: {
    type: String,
    default: 'public'
  },
  snmpVersion: {
    type: String,
    enum: ['1', '2c', '3'],
    default: '2c'
  },
  deviceType: {
    type: String,
    enum: ['router', 'switch', 'server', 'printer', 'firewall', 'other'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'warning', 'critical'],
    default: 'offline'
  },
  lastSeen: {
    type: Date
  },
  metrics: {
    cpuUsage: Number,
    memoryUsage: Number,
    diskUsage: Number,
    networkTraffic: {
      inbound: Number,
      outbound: Number
    },
    uptime: Number
  },
  thresholds: {
    cpu: { 
      warning: { type: Number, default: 70 }, 
      critical: { type: Number, default: 90 } 
    },
    memory: { 
      warning: { type: Number, default: 80 }, 
      critical: { type: Number, default: 95 } 
    },
    disk: { 
      warning: { type: Number, default: 85 }, 
      critical: { type: Number, default: 95 } 
    }
  },
  isMonitored: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Device', deviceSchema);