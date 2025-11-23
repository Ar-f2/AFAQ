const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const { protect } = require('../middleware/auth');

/**
 * Registrations Routes
 * مسارات طلبات التسجيل
 */

// @route   GET /api/v1/registrations
// @desc    Get all registrations
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const { status, studyType, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (studyType) query['metadata.studyType'] = studyType;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const registrations = await Registration.find(query)
      .populate('institute', 'name logo')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Registration.countDocuments(query);

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: registrations
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الطلبات',
      error: error.message
    });
  }
});

// @route   GET /api/v1/registrations/:id
// @desc    Get single registration
// @access  Private (Admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('institute', 'name logo contact')
      .populate('assignedTo', 'name email')
      .populate('adminNotes.addedBy', 'name');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الطلب',
      error: error.message
    });
  }
});

// @route   POST /api/v1/registrations
// @desc    Create new registration
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      studentInfo,
      studyType,
      instituteDuration,
      program,
      educationLevel,
      desiredField,
      gpa,
      preferredUniversity,
      expectedStartDate,
      notes,
      metadata
    } = req.body;

    // Validate required fields
    if (!studentInfo || !studentInfo.fullName || !studentInfo.phone || !studentInfo.whatsapp) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة'
      });
    }

    // Get IP address
    const ipAddress = req.headers['x-forwarded-for'] ||
                     req.headers['x-real-ip'] ||
                     req.connection.remoteAddress ||
                     'Unknown';

    // Prepare registration data
    const registrationData = {
      studentInfo,
      educationLevel,
      expectedStartDate,
      notes,
      metadata: {
        ipAddress,
        userAgent: req.headers['user-agent'] || 'Unknown',
        referrer: metadata?.referrer || null,
        source: metadata?.source || 'website',
        studyType // Store study type in metadata
      }
    };

    // Add study-type specific fields
    if (studyType === 'معهد لغة') {
      registrationData.program = {
        name: 'دورة لغة إنجليزية',
        duration: instituteDuration
      };
    } else if (studyType === 'جامعة') {
      registrationData.desiredField = desiredField;
      registrationData.program = program;
      // Store GPA in metadata or as a custom field
      if (!registrationData.metadata.gpa) {
        registrationData.metadata.gpa = gpa;
      }
      if (preferredUniversity) {
        registrationData.metadata.preferredUniversity = preferredUniversity;
      }
    }

    const registration = await Registration.create(registrationData);

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً',
      data: {
        id: registration._id,
        fullName: registration.studentInfo.fullName,
        status: registration.status
      }
    });

  } catch (error) {
    console.error('Create registration error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الطلب',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/registrations/:id
// @desc    Update registration
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, assignedTo, institute } = req.body;

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // Update fields
    if (status) registration.status = status;
    if (assignedTo) registration.assignedTo = assignedTo;
    if (institute) registration.institute = institute;

    await registration.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث الطلب بنجاح',
      data: registration
    });

  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الطلب',
      error: error.message
    });
  }
});

// @route   DELETE /api/v1/registrations/:id
// @desc    Delete registration
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    await registration.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف الطلب بنجاح',
      data: {}
    });

  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الطلب',
      error: error.message
    });
  }
});

// @route   POST /api/v1/registrations/:id/notes
// @desc    Add admin note to registration
// @access  Private (Admin)
router.post('/:id/notes', protect, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال نص الملاحظة'
      });
    }

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    registration.adminNotes.push({
      note,
      addedBy: req.user.id
    });

    await registration.save();

    res.status(200).json({
      success: true,
      message: 'تم إضافة الملاحظة بنجاح',
      data: registration.adminNotes
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة الملاحظة',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/registrations/:id/status
// @desc    Update registration status
// @access  Private (Admin)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['جديد', 'قيد المراجعة', 'تم القبول', 'تم الرفض', 'مكتمل', 'ملغي'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صحيحة'
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: `تم تغيير الحالة إلى: ${status}`,
      data: registration
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الحالة',
      error: error.message
    });
  }
});

// @route   GET /api/v1/registrations/stats/overview
// @desc    Get registration statistics
// @access  Private (Admin)
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const stats = await Registration.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRegistrations = await Registration.countDocuments();
    const todayRegistrations = await Registration.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalRegistrations,
        today: todayRegistrations,
        byStatus: stats
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

module.exports = router;
