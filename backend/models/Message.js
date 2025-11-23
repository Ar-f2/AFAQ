const mongoose = require('mongoose');

/**
 * Message Model (رسائل التواصل)
 * لحفظ رسائل نموذج "تواصل معنا"
 */
const MessageSchema = new mongoose.Schema({
  // معلومات المرسل
  name: {
    type: String,
    required: [true, 'الرجاء إدخال الاسم'],
    trim: true,
    maxlength: [100, 'الاسم يجب أن لا يتجاوز 100 حرف']
  },
  email: {
    type: String,
    required: [true, 'الرجاء إدخال البريد الإلكتروني'],
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'الرجاء إدخال بريد إلكتروني صحيح'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'الرجاء إدخال الموضوع'],
    trim: true,
    maxlength: [200, 'الموضوع يجب أن لا يتجاوز 200 حرف']
  },
  message: {
    type: String,
    required: [true, 'الرجاء إدخال نص الرسالة'],
    maxlength: [2000, 'الرسالة يجب أن لا تتجاوز 2000 حرف']
  },

  // حالة الرسالة
  status: {
    type: String,
    enum: ['جديدة', 'مقروءة', 'تم الرد', 'مؤرشفة'],
    default: 'جديدة'
  },

  // الأولوية
  priority: {
    type: String,
    enum: ['عادية', 'مهمة', 'عاجلة'],
    default: 'عادية'
  },

  // معلومات المتابعة
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  readAt: {
    type: Date
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  repliedAt: {
    type: Date
  },
  replyText: {
    type: String
  },

  // ملاحظات داخلية
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // معلومات الزائر (للتتبع)
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String
  },

  // تصنيف الرسالة
  category: {
    type: String,
    enum: ['استفسار عام', 'طلب تسجيل', 'شكوى', 'اقتراح', 'أخرى'],
    default: 'استفسار عام'
  }

}, {
  timestamps: true
});

// تحديث readAt عند تغيير الحالة إلى "مقروءة"
MessageSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'مقروءة' && !this.readAt) {
    this.readAt = new Date();
  }
  if (this.isModified('status') && this.status === 'تم الرد' && !this.repliedAt) {
    this.repliedAt = new Date();
  }
  next();
});

// Indexes
MessageSchema.index({ email: 1 });
MessageSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ priority: 1, status: 1 });
MessageSchema.index({ createdAt: -1 });

// Virtual: هل الرسالة جديدة؟
MessageSchema.virtual('isNew').get(function() {
  return this.status === 'جديدة';
});

module.exports = mongoose.model('Message', MessageSchema);
