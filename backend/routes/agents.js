const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const AgentClick = require('../models/AgentClick');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

/**
 * Agents Routes
 * مسارات الوكلاء مع نظام تتبع نقرات الواتساب
 */

// @route   GET /api/v1/agents
// @desc    Get all agents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialty, isActive } = req.query;

    // Build query
    const query = {};
    if (specialty) query.specialty = specialty;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const agents = await Agent.find(query)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents
    });

  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الوكلاء',
      error: error.message
    });
  }
});

// @route   GET /api/v1/agents/:id
// @desc    Get single agent
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'الوكيل غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });

  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الوكيل',
      error: error.message
    });
  }
});

// @route   POST /api/v1/agents
// @desc    Create new agent
// @access  Private (Admin)
router.post('/', protect, uploadSingle('photo'), async (req, res) => {
  try {
    const { name, specialty, description, whatsapp, email, order } = req.body;

    // Add photo if uploaded
    const agentData = {
      name,
      specialty,
      description,
      whatsapp,
      email,
      order,
      createdBy: req.user.id
    };

    if (req.file) {
      agentData.photo = `/uploads/images/${req.file.filename}`;
    }

    const agent = await Agent.create(agentData);

    res.status(201).json({
      success: true,
      message: 'تم إضافة الوكيل بنجاح',
      data: agent
    });

  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة الوكيل',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/agents/:id
// @desc    Update agent
// @access  Private (Admin)
router.put('/:id', protect, uploadSingle('photo'), async (req, res) => {
  try {
    let agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'الوكيل غير موجود'
      });
    }

    const { name, specialty, description, whatsapp, email, order, isActive } = req.body;

    const updateData = {
      name,
      specialty,
      description,
      whatsapp,
      email,
      order,
      isActive
    };

    // Update photo if uploaded
    if (req.file) {
      updateData.photo = `/uploads/images/${req.file.filename}`;
    }

    agent = await Agent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'تم تحديث الوكيل بنجاح',
      data: agent
    });

  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الوكيل',
      error: error.message
    });
  }
});

// @route   DELETE /api/v1/agents/:id
// @desc    Delete agent
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'الوكيل غير موجود'
      });
    }

    await agent.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف الوكيل بنجاح',
      data: {}
    });

  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الوكيل',
      error: error.message
    });
  }
});

// ========== WhatsApp Click Tracking ==========

// @route   POST /api/v1/agents/track-click
// @desc    Track WhatsApp button click
// @access  Public
router.post('/track-click', async (req, res) => {
  try {
    const { agentId, device, os, browser, referrer } = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'Agent ID مطلوب'
      });
    }

    // Check if agent exists
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'الوكيل غير موجود'
      });
    }

    // Get IP address
    const ipAddress = req.headers['x-forwarded-for'] ||
                     req.headers['x-real-ip'] ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null);

    // Get user agent
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Create click record
    const clickData = {
      agent: agentId,
      ipAddress: ipAddress || 'Unknown',
      userAgent,
      device: device || 'Unknown',
      os: os || 'Unknown',
      browser: browser || 'Unknown',
      referrer: referrer || null
    };

    const click = await AgentClick.create(clickData);

    // Update agent's total clicks
    agent.totalClicks = (agent.totalClicks || 0) + 1;
    await agent.save();

    res.status(201).json({
      success: true,
      message: 'تم تسجيل النقرة بنجاح',
      data: {
        clickId: click._id,
        agentId: agent._id,
        totalClicks: agent.totalClicks
      }
    });

  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل النقرة',
      error: error.message
    });
  }
});

// @route   GET /api/v1/agents/:id/clicks
// @desc    Get agent clicks history
// @access  Private (Admin)
router.get('/:id/clicks', protect, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 50 } = req.query;

    // Build query
    const query = { agent: req.params.id };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const clicks = await AgentClick.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const total = await AgentClick.countDocuments(query);

    res.status(200).json({
      success: true,
      count: clicks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: clicks
    });

  } catch (error) {
    console.error('Get clicks error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب سجل النقرات',
      error: error.message
    });
  }
});

// @route   GET /api/v1/agents/:id/stats
// @desc    Get agent click statistics
// @access  Private (Admin)
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await AgentClick.getAgentStats(
      req.params.id,
      startDate,
      endDate
    );

    // Get clicks by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clicksByDay = await AgentClick.aggregate([
      {
        $match: {
          agent: require('mongoose').Types.ObjectId(req.params.id),
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {},
        clicksByDay
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات',
      error: error.message
    });
  }
});

// @route   GET /api/v1/agents/analytics/top
// @desc    Get top agents by clicks
// @access  Private (Admin)
router.get('/analytics/top', protect, async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const topAgents = await AgentClick.getTopAgents(parseInt(limit));

    res.status(200).json({
      success: true,
      count: topAgents.length,
      data: topAgents
    });

  } catch (error) {
    console.error('Get top agents error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب أكثر الوكلاء نشاطاً',
      error: error.message
    });
  }
});

module.exports = router;
