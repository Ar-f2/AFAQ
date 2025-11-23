const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware للتحقق من JWT Token
 * يحمي المسارات المخصصة للأدمن فقط
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول إلى هذا المسار'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'حسابك غير نشط'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول إلى هذا المسار'
    });
  }
};

/**
 * Middleware للتحقق من الصلاحيات
 * @param  {...string} roles - الأدوار المسموح لها بالوصول
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `دور المستخدم ${req.user.role} غير مصرح له بالوصول إلى هذا المسار`
      });
    }
    next();
  };
};

/**
 * Middleware اختياري - يسمح بالوصول للجميع ولكن يحدد المستخدم إذا كان مسجل دخول
 */
exports.optional = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid, continue without user
      req.user = null;
    }
  }

  next();
};
