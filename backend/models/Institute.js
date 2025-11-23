const mongoose = require('mongoose');

/**
 * Institute Model (معاهد وجامعات)
 * نموذج للمعاهد والجامعات
 */
const InstituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال اسم المعهد/الجامعة'],
    trim: true,
    unique: true
  },
  nameEn: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'الرجاء تحديد نوع المؤسسة'],
    enum: ['معهد لغة', 'جامعة', 'كلية'],
    default: 'معهد لغة'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  logo: {
    type: String,
    default: 'default-logo.png'
  },
  coverImage: {
    type: String
  },
  gallery: [{
    type: String
  }],
  description: {
    type: String,
    required: [true, 'الرجاء إدخال وصف'],
    maxlength: [2000, 'الوصف يجب أن لا يتجاوز 2000 حرف']
  },
  location: {
    city: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // البرامج والتخصصات
  programs: [{
    name: String,
    duration: String, // مثلاً: "3 أشهر", "4 سنوات"
    price: Number,
    currency: {
      type: String,
      default: 'RM' // Ringgit Malaysia
    },
    description: String
  }],
  // المميزات
  features: [{
    title: String,
    description: String,
    icon: String
  }],
  // جدول الأسعار
  pricingTables: [{
    title: String,
    items: [{
      name: String,
      price: Number,
      description: String
    }]
  }],
  // العروض الخاصة
  offers: [{
    title: String,
    description: String,
    validUntil: Date,
    discount: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  // معلومات الاتصال
  contact: {
    phone: String,
    email: String,
    website: String,
    whatsapp: String
  },
  // الحالة والإعدادات
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  // محتوى الصفحة (من Page Builder)
  pageContent: {
    type: mongoose.Schema.Types.Mixed, // يحتوي على HTML/JSON من GrapesJS
    default: null
  },
  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create slug from name before saving
InstituteSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Index للبحث
InstituteSchema.index({ name: 'text', description: 'text' });
InstituteSchema.index({ type: 1, isPublished: 1 });
InstituteSchema.index({ slug: 1 });

module.exports = mongoose.model('Institute', InstituteSchema);
