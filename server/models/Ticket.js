const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['incident', 'problem', 'change', 'service_request'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'major', 'critical'],
    default: 'moderate'
  },
  status: {
    type: String,
    enum: ['new', 'assigned', 'in_progress', 'pending', 'resolved', 'closed', 'cancelled', 'archived'],
    default: 'new'
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedGroup: {
    type: String
  },
  dueDate: {
    type: Date
  },
  resolvedDate: {
    type: Date
  },
  closedDate: {
    type: Date
  },
  resolution: {
    type: String
  },
  workNotes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  relatedTickets: [{
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    },
    relationship: {
      type: String,
      enum: ['parent', 'child', 'related', 'duplicate']
    }
  }],
  sla: {
    responseTime: Number,
    resolutionTime: Number,
    breached: {
      type: Boolean,
      default: false
    }
  },
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Auto-generate ticket number
ticketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketNumber = `TKT-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);