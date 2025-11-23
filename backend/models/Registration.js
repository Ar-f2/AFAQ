const mongoose = require('mongoose');

/**
 * Registration Model (طلبات تسجيل الطلاب)
 * لتسجيل طلبات الطلاب من نماذج التسجيل
 */
const RegistrationSchema = new mongoose.Schema({
  // معلومات الطالب الشخصية
  studentInfo: {
    fullName: {
      type: String,
      required: [true, 'الرجاء إدخال الاسم الكامل'],
      trim: true
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
      required: [true, 'الرجاء إدخال رقم الهاتف'],
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    },
    nationality: {
      type: String,
      required: [true, 'الرجاء تحديد الجنسية']
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['ذكر', 'أنثى'],
      required: true
    }
  },

  // المعهد/الجامعة المطلوبة
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: [true, 'الرجاء تحديد المعهد/الجامعة']
  },

  // البرنامج المطلوب
  program: {
    name: String,
    duration: String
  },

  // المستوى التعليمي الحالي
  educationLevel: {
    type: String,
    enum: ['ثانوية', 'بكالوريوس', 'ماجستير', 'دكتوراه', 'أخرى']
  },

  // التخصص المطلوب
  desiredField: {
    type: String
  },

  // تاريخ بدء الدراسة المتوقع
  expectedStartDate: {
    type: Date
  },

  // ملاحظات إضافية
  notes: {
    type: String,
    maxlength: [1000, 'الملاحظات يجب أن لا تتجاوز 1000 حرف']
  },

  // حالة الطلب
  status: {
    type: String,
    enum: ['جديد', 'قيد المراجعة', 'تم القبول', 'تم الرفض', 'مكتمل', 'ملغي'],
    default: 'جديد'
  },

  // معلومات المتابعة
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // الأدمن المسؤول
  },

  // ملاحظات الأدمن
  adminNotes: [{
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
    source: {
      type: String,
      enum: ['website', 'landing-page', 'social-media', 'direct'],
      default: 'website'
    }
  },

  // تاريخ آخر تحديث للحالة
  statusUpdatedAt: {
    type: Date
  }

}, {
  timestamps: true
});

// تحديث statusUpdatedAt عند تغيير الحالة
RegistrationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusUpdatedAt = new Date();
  }
  next();
});

// Indexes
RegistrationSchema.index({ 'studentInfo.email': 1 });
RegistrationSchema.index({ status: 1, createdAt: -1 });
RegistrationSchema.index({ institute: 1 });
RegistrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Registration', RegistrationSchema);
