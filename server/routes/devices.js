const express = require('express');
const Device = require('../models/Device');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all devices
router.get('/', auth, async (req, res) => {
  try {
    const devices = await Device.find().sort({ name: 1 });
    
    res.json({
      success: true,
      devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create a device
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin or agent
    if (req.user.role !== 'admin' && req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { name, ipAddress, snmpCommunity, snmpVersion, deviceType, location, department } = req.body;

    const device = new Device({
      name,
      ipAddress,
      snmpCommunity,
      snmpVersion,
      deviceType,
      location,
      department,
      thresholds: req.body.thresholds || {
        cpu: { warning: 70, critical: 90 },
        memory: { warning: 80, critical: 95 },
        disk: { warning: 85, critical: 95 }
      }
    });

    await device.save();

    res.status(201).json({
      success: true,
      device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get device by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update device
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or agent
    if (req.user.role !== 'admin' && req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete device
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;