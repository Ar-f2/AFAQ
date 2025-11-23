const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Multer Configuration لرفع الملفات
 */

// تحديد مكان حفظ الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // حفظ الصور في مجلد uploads/images
    cb(null, path.join(__dirname, '../../uploads/images'));
  },
  filename: function (req, file, cb) {
    // إنشاء اسم فريد للملف
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// فلترة الملفات - قبول الصور فقط
const fileFilter = (req, file, cb) => {
  // أنواع الملفات المسموح بها
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('الرجاء رفع صور فقط (jpeg, jpg, png, gif, webp, svg)'));
  }
};

// إعدادات Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

// Middleware لرفع صورة واحدة
exports.uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'حجم الملف كبير جداً. الحد الأقصى 5MB'
          });
        }
        return res.status(400).json({
          success: false,
          message: 'خطأ في رفع الملف: ' + err.message
        });
      } else if (err) {
        // Other errors
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
};

// Middleware لرفع عدة صور
exports.uploadMultiple = (fieldName, maxCount = 10) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);

    multipleUpload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'حجم الملف كبير جداً. الحد الأقصى 5MB'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: `يمكنك رفع ${maxCount} صور كحد أقصى`
          });
        }
        return res.status(400).json({
          success: false,
          message: 'خطأ في رفع الملفات: ' + err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
};

// Middleware لرفع حقول متعددة
exports.uploadFields = (fields) => {
  return (req, res, next) => {
    const fieldsUpload = upload.fields(fields);

    fieldsUpload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: 'خطأ في رفع الملفات: ' + err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
};

// Helper function للحصول على مسار الملف النسبي
exports.getFileUrl = (filename) => {
  return `/uploads/images/${filename}`;
};
