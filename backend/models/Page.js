const mongoose = require('mongoose');

/**
 * Page Model (صفحات ديناميكية)
 * للصفحات التي يتم إنشاؤها باستخدام Page Builder
 */
const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'الرجاء إدخال عنوان الصفحة'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: ['custom', 'service', 'info', 'landing'],
    default: 'custom'
  },
  // محتوى الصفحة من GrapesJS
  content: {
    html: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: ''
    },
    components: {
      type: mongoose.Schema.Types.Mixed, // GrapesJS components JSON
      default: null
    },
    styles: {
      type: mongoose.Schema.Types.Mixed, // GrapesJS styles JSON
      default: null
    }
  },
  // Template المستخدم
  template: {
    type: String,
    enum: ['blank', 'classic', 'modern', 'minimal', 'premium'],
    default: 'blank'
  },
  // Featured Image
  featuredImage: {
    type: String,
    default: null
  },
  // SEO
  seo: {
    title: {
      type: String,
      default: function() {
        return this.title;
      }
    },
    description: {
      type: String,
      maxlength: [160, 'الوصف يجب أن لا يتجاوز 160 حرف']
    },
    keywords: [String],
    ogImage: String
  },
  // الحالة
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  // الإعدادات
  settings: {
    showInMenu: {
      type: Boolean,
      default: false
    },
    menuOrder: {
      type: Number,
      default: 0
    },
    requireAuth: {
      type: Boolean,
      default: false
    }
  },
  // الإحصائيات
  views: {
    type: Number,
    default: 0
  },
  // المستخدم
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Auto-generate slug if not provided
PageSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Indexes
PageSchema.index({ slug: 1 });
PageSchema.index({ status: 1, publishedAt: -1 });
PageSchema.index({ title: 'text' });

module.exports = mongoose.model('Page', PageSchema);
