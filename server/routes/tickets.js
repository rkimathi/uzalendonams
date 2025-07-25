const express = require('express');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tickets
router.get('/', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('requester', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create a ticket
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, priority, category, subcategory } = req.body;

    const ticket = new Ticket({
      title,
      description,
      type,
      priority,
      category,
      subcategory,
      requester: req.user.id
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get ticket by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('requester', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update ticket
router.put('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('requester', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      ticket
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