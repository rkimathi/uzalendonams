const express = require('express');
const Ticket = require('../models/Ticket');
const Device = require('../models/Device');
const auth = require('../middleware/auth');

const router = express.Router();

// Get ticket statistics
router.get('/tickets/stats', auth, async (req, res) => {
  try {
    // Check if user is admin or agent
    if (req.user.role !== 'admin' && req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const totalTickets = await Ticket.countDocuments();
    
    // Status counts
    const statusCounts = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Priority counts
    const priorityCounts = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    // Type counts
    const typeCounts = await Ticket.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // Format the results
    const formatCounts = (counts) => {
      return counts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});
    };

    res.json({
      success: true,
      stats: {
        total: totalTickets,
        status: formatCounts(statusCounts),
        priority: formatCounts(priorityCounts),
        type: formatCounts(typeCounts)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get device statistics
router.get('/devices/stats', auth, async (req, res) => {
  try {
    // Check if user is admin or agent
    if (req.user.role !== 'admin' && req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const totalDevices = await Device.countDocuments();
    
    // Status counts
    const statusCounts = await Device.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Type counts
    const typeCounts = await Device.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);
    
    // Department counts
    const departmentCounts = await Device.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    
    // Format the results
    const formatCounts = (counts) => {
      return counts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});
    };

    res.json({
      success: true,
      stats: {
        total: totalDevices,
        status: formatCounts(statusCounts),
        type: formatCounts(typeCounts),
        department: formatCounts(departmentCounts)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get ticket resolution time report
router.get('/tickets/resolution-time', auth, async (req, res) => {
  try {
    // Check if user is admin or agent
    if (req.user.role !== 'admin' && req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { startDate, endDate } = req.query;
    
    const query = {
      resolvedDate: { $exists: true }
    };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const tickets = await Ticket.find(query);
    
    const resolutionTimes = tickets.map(ticket => {
      const created = new Date(ticket.createdAt);
      const resolved = new Date(ticket.resolvedDate);
      const diffTime = Math.abs(resolved - created);
      const diffHours = diffTime / (1000 * 60 * 60);
      
      return {
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        priority: ticket.priority,
        type: ticket.type,
        resolutionTimeHours: diffHours
      };
    });
    
    res.json({
      success: true,
      resolutionTimes
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