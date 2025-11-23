const express = require('express');
const router = express.Router();
const Institute = require('../models/Institute');
const { protect } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');

/**
 * Institutes Routes
 * مسارات المعاهد والجامعات
 */

// @route   GET /api/v1/institutes
// @desc    Get all institutes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, isPublished, isFeatured, search } = req.query;

    // Build query
    const query = {};
    if (type) query.type = type;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const institutes = await Institute.find(query)
      .sort({ order: 1, createdAt: -1 })
      .select('-pageContent -__v');

    res.status(200).json({
      success: true,
      count: institutes.length,
      data: institutes
    });

  } catch (error) {
    console.error('Get institutes error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المعاهد',
      error: error.message
    });
  }
});

// @route   GET /api/v1/institutes/:id
// @desc    Get single institute
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'المعهد غير موجود'
      });
    }

    // Increment views
    institute.views = (institute.views || 0) + 1;
    await institute.save();

    res.status(200).json({
      success: true,
      data: institute
    });

  } catch (error) {
    console.error('Get institute error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المعهد',
      error: error.message
    });
  }
});

// @route   GET /api/v1/institutes/slug/:slug
// @desc    Get institute by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const institute = await Institute.findOne({ slug: req.params.slug });

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'المعهد غير موجود'
      });
    }

    // Increment views
    institute.views = (institute.views || 0) + 1;
    await institute.save();

    res.status(200).json({
      success: true,
      data: institute
    });

  } catch (error) {
    console.error('Get institute by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المعهد',
      error: error.message
    });
  }
});

// @route   POST /api/v1/institutes
// @desc    Create new institute
// @access  Private (Admin)
router.post('/', protect, uploadSingle('logo'), async (req, res) => {
  try {
    const instituteData = { ...req.body };

    // Add logo if uploaded
    if (req.file) {
      instituteData.logo = `/uploads/images/${req.file.filename}`;
    }

    // Add creator
    instituteData.createdBy = req.user.id;

    const institute = await Institute.create(instituteData);

    res.status(201).json({
      success: true,
      message: 'تم إضافة المعهد بنجاح',
      data: institute
    });

  } catch (error) {
    console.error('Create institute error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة المعهد',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/institutes/:id
// @desc    Update institute
// @access  Private (Admin)
router.put('/:id', protect, uploadSingle('logo'), async (req, res) => {
  try {
    let institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'المعهد غير موجود'
      });
    }

    const updateData = { ...req.body };

    // Update logo if uploaded
    if (req.file) {
      updateData.logo = `/uploads/images/${req.file.filename}`;
    }

    // Add updater
    updateData.updatedBy = req.user.id;

    institute = await Institute.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'تم تحديث المعهد بنجاح',
      data: institute
    });

  } catch (error) {
    console.error('Update institute error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث المعهد',
      error: error.message
    });
  }
});

// @route   DELETE /api/v1/institutes/:id
// @desc    Delete institute
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'المعهد غير موجود'
      });
    }

    await institute.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف المعهد بنجاح',
      data: {}
    });

  } catch (error) {
    console.error('Delete institute error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المعهد',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/institutes/:id/gallery
// @desc    Upload gallery images
// @access  Private (Admin)
router.put('/:id/gallery', protect, uploadMultiple('images', 10), async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'المعهد غير موجود'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء رفع صورة واحدة على الأقل'
      });
    }

    // Add new images to gallery
    const newImages = req.files.map(file => `/uploads/images/${file.filename}`);
    institute.gallery = [...(institute.gallery || []), ...newImages];

    await institute.save();

    res.status(200).json({
      success: true,
      message: 'تم رفع الصور بنجاح',
      data: {
        gallery: institute.gallery
      }
    });

  } catch (error) {
    console.error('Upload gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع الصور',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/institutes/:id/publish
// @desc    Publish/Unpublish institute
// @access  Private (Admin)
router.put('/:id/publish', protect, async (req, res) => {
  try {
    const { isPublished } = req.body;

    const institute = await Institute.findByIdAndUpdate(
      req.params.id,
      { isPublished },
      { new: true }
    );

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'المعهد غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: `تم ${isPublished ? 'نشر' : 'إلغاء نشر'} المعهد بنجاح`,
      data: institute
    });

  } catch (error) {
    console.error('Publish institute error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

module.exports = router;
