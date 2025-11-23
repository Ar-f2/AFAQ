const mongoose = require('mongoose');

/**
 * Agent Model (وكلاء التسجيل)
 * نموذج الوكلاء الذين يتواصل معهم الطلاب عبر الواتساب
 */
const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال اسم الوكيل'],
    trim: true,
    maxlength: [100, 'الاسم يجب أن لا يتجاوز 100 حرف']
  },
  photo: {
    type: String,
    default: 'default-agent.jpg'
  },
  specialty: {
    type: String,
    required: [true, 'الرجاء تحديد التخصص'],
    enum: [
      'معاهد اللغة',
      'الجامعات',
      'الدراسات العليا',
      'التخصصات الطبية',
      'التخصصات الهندسية',
      'إدارة الأعمال',
      'عام'
    ],
    default: 'عام'
  },
  description: {
    type: String,
    maxlength: [500, 'الوصف يجب أن لا يتجاوز 500 حرف'],
    default: 'وكيل معتمد لمساعدة الطلاب في التسجيل'
  },
  whatsapp: {
    type: String,
    required: [true, 'الرجاء إدخال رقم الواتساب'],
    trim: true,
    match: [
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      'الرجاء إدخال رقم واتساب صحيح'
    ]
  },
  email: {
    type: String,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'الرجاء إدخال بريد إلكتروني صحيح'
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0 // للترتيب في صفحة العرض
  },
  totalClicks: {
    type: Number,
    default: 0 // إجمالي النقرات على زر الواتساب
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual للحصول على سجل النقرات
AgentSchema.virtual('clicks', {
  ref: 'AgentClick',
  localField: '_id',
  foreignField: 'agent',
  justOne: false
});

// Index لتحسين الأداء
AgentSchema.index({ specialty: 1, isActive: 1 });
AgentSchema.index({ order: 1 });

module.exports = mongoose.model('Agent', AgentSchema);
