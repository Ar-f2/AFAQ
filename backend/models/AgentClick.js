const mongoose = require('mongoose');

/**
 * AgentClick Model (تتبع نقرات الواتساب)
 * يسجل كل نقرة على زر الواتساب لكل وكيل
 */
const AgentClickSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: [true, 'الرجاء تحديد الوكيل'],
    index: true
  },
  // معلومات الزائر
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String, // سيحتوي على معلومات المتصفح والجهاز
    required: true
  },
  // تحليل الجهاز
  device: {
    type: String,
    enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'],
    default: 'Unknown'
  },
  os: {
    type: String, // Android, iOS, Windows, etc.
    default: 'Unknown'
  },
  browser: {
    type: String, // Chrome, Safari, Firefox, etc.
    default: 'Unknown'
  },
  // معلومات جغرافية (اختياري - يتطلب IP Geolocation API)
  country: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  // معلومات إضافية
  referrer: {
    type: String, // من أين جاء الزائر
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index مركب لتحسين استعلامات التقارير
AgentClickSchema.index({ agent: 1, timestamp: -1 });
AgentClickSchema.index({ agent: 1, device: 1 });
AgentClickSchema.index({ timestamp: -1 });

// Static method: الحصول على إحصائيات الوكيل
AgentClickSchema.statics.getAgentStats = async function(agentId, startDate, endDate) {
  const match = { agent: mongoose.Types.ObjectId(agentId) };

  if (startDate || endDate) {
    match.timestamp = {};
    if (startDate) match.timestamp.$gte = new Date(startDate);
    if (endDate) match.timestamp.$lte = new Date(endDate);
  }

  return await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$agent',
        totalClicks: { $sum: 1 },
        mobileClicks: {
          $sum: { $cond: [{ $eq: ['$device', 'Mobile'] }, 1, 0] }
        },
        desktopClicks: {
          $sum: { $cond: [{ $eq: ['$device', 'Desktop'] }, 1, 0] }
        },
        tabletClicks: {
          $sum: { $cond: [{ $eq: ['$device', 'Tablet'] }, 1, 0] }
        }
      }
    }
  ]);
};

// Static method: الحصول على أكثر الوكلاء نشاطاً
AgentClickSchema.statics.getTopAgents = async function(limit = 5) {
  return await this.aggregate([
    {
      $group: {
        _id: '$agent',
        totalClicks: { $sum: 1 }
      }
    },
    { $sort: { totalClicks: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'agents',
        localField: '_id',
        foreignField: '_id',
        as: 'agentInfo'
      }
    },
    { $unwind: '$agentInfo' }
  ]);
};

module.exports = mongoose.model('AgentClick', AgentClickSchema);
