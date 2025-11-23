const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression
app.use(compression());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files - Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve public website
app.use(express.static(path.join(__dirname, '../public')));

// API Routes (will be added later)
// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/agents', require('./routes/agents'));
// app.use('/api/v1/institutes', require('./routes/institutes'));
// app.use('/api/v1/pages', require('./routes/pages'));
// app.use('/api/v1/registrations', require('./routes/registrations'));
// app.use('/api/v1/messages', require('./routes/messages'));
// app.use('/api/v1/media', require('./routes/media'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AFAQ CMS API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'مرحباً بكم في API موقع أفاق لتسجيل الطلاب',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/v1/auth',
      agents: '/api/v1/agents',
      institutes: '/api/v1/institutes',
      pages: '/api/v1/pages',
      registrations: '/api/v1/registrations',
      messages: '/api/v1/messages',
      media: '/api/v1/media'
    }
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 AFAQ CMS Server Running                         ║
║                                                       ║
║   📍 Port: ${PORT}                                      ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                       ║
║   🔗 API: http://localhost:${PORT}/api                  ║
║   ❤️  Health: http://localhost:${PORT}/api/health        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
