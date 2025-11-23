const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { protect } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, getFileUrl } = require('../middleware/upload');

/**
 * Media Routes
 * مسارات رفع وإدارة الملفات
 */

// @route   POST /api/v1/media/upload
// @desc    Upload single image
// @access  Private (Admin)
router.post('/upload', protect, uploadSingle('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء اختيار صورة للرفع'
      });
    }

    const fileUrl = getFileUrl(req.file.filename);

    res.status(200).json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع الصورة',
      error: error.message
    });
  }
});

// @route   POST /api/v1/media/upload-multiple
// @desc    Upload multiple images
// @access  Private (Admin)
router.post('/upload-multiple', protect, uploadMultiple('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء اختيار صور للرفع'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      url: getFileUrl(file.filename),
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(200).json({
      success: true,
      message: `تم رفع ${files.length} صورة بنجاح`,
      count: files.length,
      data: files
    });

  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع الصور',
      error: error.message
    });
  }
});

// @route   GET /api/v1/media/list
// @desc    Get list of uploaded files
// @access  Private (Admin)
router.get('/list', protect, async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads/images');

    const files = await fs.readdir(uploadsDir);

    // Filter out .gitkeep and get file stats
    const fileList = [];

    for (const file of files) {
      if (file === '.gitkeep') continue;

      const filePath = path.join(uploadsDir, file);
      const stats = await fs.stat(filePath);

      fileList.push({
        filename: file,
        url: getFileUrl(file),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      });
    }

    // Sort by creation date (newest first)
    fileList.sort((a, b) => b.created - a.created);

    res.status(200).json({
      success: true,
      count: fileList.length,
      data: fileList
    });

  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب قائمة الملفات',
      error: error.message
    });
  }
});

// @route   DELETE /api/v1/media/:filename
// @desc    Delete uploaded file
// @access  Private (Admin)
router.delete('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;

    // Security: prevent path traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        message: 'اسم الملف غير صالح'
      });
    }

    const filePath = path.join(__dirname, '../../uploads/images', filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'الملف غير موجود'
      });
    }

    // Delete file
    await fs.unlink(filePath);

    res.status(200).json({
      success: true,
      message: 'تم حذف الصورة بنجاح',
      data: {}
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الصورة',
      error: error.message
    });
  }
});

module.exports = router;
