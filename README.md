# 🎓 AFAQ CMS - نظام أفاق لإدارة تسجيل الطلاب

<div align="center">

![AFAQ Logo](public/assets/images/afaq-logo.png)

**نظام إدارة محتوى احترافي لشركة أفاق لتسجيل الطلاب في المعاهد والجامعات الماليزية**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)](https://www.mongodb.com/)

[المميزات](#-المميزات) • [التثبيت](#-التثبيت) • [الاستخدام](#-الاستخدام) • [API Docs](#-api-documentation) • [المساهمة](#-المساهمة)

</div>

---

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [المتطلبات](#-المتطلبات)
- [التثبيت](#-التثبيت)
- [الاستخدام](#-الاستخدام)
- [هيكل المشروع](#-هيكل-المشروع)
- [API Documentation](#-api-documentation)
- [WhatsApp Click Tracking](#-whatsapp-click-tracking)
- [الأمان](#-الأمان)
- [النشر](#-النشر)
- [المساهمة](#-المساهمة)
- [الترخيص](#-الترخيص)

---

## 🎯 نظرة عامة

**AFAQ CMS** هو نظام إدارة محتوى احترافي مصمم خصيصاً لشركة أفاق لتسجيل الطلاب في المعاهد والجامعات الماليزية.

### الأهداف الرئيسية:

- ✅ **موقع عام** احترافي لعرض المعاهد والجامعات
- ✅ **صفحة وكلاء** مع نظام تتبع نقرات الواتساب المتقدم
- ✅ **لوحة تحكم** شاملة لإدارة المحتوى
- ✅ **تصميم متجاوب** يعمل على جميع الأجهزة
- ✅ **نظام تحليلات** متكامل لقياس الأداء

---

## 🌟 المميزات

### 🎨 الواجهة العامة (Public Website)

- **الصفحة الرئيسية:**
  - Hero section مع تأثيرات parallax
  - عداد إحصائيات متحرك
  - عرض المعاهد المميزة
  - أقسام "لماذا أفاق؟" و "تواصل معنا"

- **صفحة الوكلاء:** ⭐ الميزة الأساسية
  - عرض الوكلاء مع بطاقات احترافية
  - تصفية حسب التخصص
  - زر واتساب مع نظام تتبع كامل
  - تحليلات تفصيلية لكل نقرة

- **صفحات المعاهد/الجامعات:**
  - معلومات تفصيلية عن كل معهد
  - معرض صور
  - جداول الأسعار
  - العروض الخاصة
  - نماذج تسجيل

### 💼 لوحة التحكم (Admin Dashboard)

- **إدارة الوكلاء:**
  - إضافة/تعديل/حذف الوكلاء
  - رفع الصور
  - تحديد التخصصات
  - **مشاهدة إحصائيات نقرات الواتساب:**
    - عدد النقرات الكلي
    - التوزيع حسب الجهاز (Mobile/Tablet/Desktop)
    - التوزيع حسب نظام التشغيل
    - التوزيع حسب المتصفح
    - رسوم بيانية للنقرات اليومية
    - تصدير التقارير

- **إدارة المعاهد/الجامعات:**
  - CRUD كامل
  - رفع اللوجو ومعرض الصور
  - إدارة البرامج والأسعار
  - العروض الخاصة
  - نشر/إلغاء النشر

- **مكتبة الوسائط:**
  - رفع الصور
  - عرض جميع الملفات
  - حذف الملفات غير المستخدمة

### 🔐 الأمان

- **JWT Authentication** - تشفير الجلسات
- **Bcrypt** - تشفير كلمات المرور
- **Helmet.js** - حماية من هجمات XSS
- **Rate Limiting** - منع هجمات Brute Force
- **Input Validation** - التحقق من جميع المدخلات
- **File Upload Security** - فحص نوع وحجم الملفات

### 📱 Responsive Design

- ✅ **Mobile First** - تصميم يبدأ من الموبايل
- ✅ **جميع الأحجام** - من 320px إلى 4K
- ✅ **Breakpoints احترافية:**
  - Mobile: < 480px
  - Tablet: 481px - 768px
  - Desktop: 769px - 1024px
  - Large Desktop: > 1024px

### 🚀 الأداء

- ⚡ **Fast Loading** - تحميل سريع
- 🖼️ **Lazy Loading** - للصور
- 📦 **Compression** - ضغط الاستجابات
- 🎯 **Optimized Assets** - ملفات محسّنة

---

## 🛠️ التقنيات المستخدمة

### Backend
- **Node.js** (v16+) - بيئة التشغيل
- **Express.js** (v4) - إطار العمل
- **MongoDB** (v5+) - قاعدة البيانات
- **Mongoose** (v8) - ODM للـ MongoDB
- **JWT** - المصادقة
- **Bcrypt** - تشفير كلمات المرور
- **Multer** - رفع الملفات

### Frontend
- **HTML5** - الهيكل
- **CSS3** - التنسيق (CSS Variables, Grid, Flexbox)
- **JavaScript** (ES6+) - البرمجة
- **Font Awesome** - الأيقونات
- **AOS** - تأثيرات الحركة
- **Google Fonts** - خط Cairo

### الأدوات
- **Git** - نظام التحكم بالإصدارات
- **Nodemon** - Auto-restart للتطوير
- **dotenv** - إدارة المتغيرات البيئية

---

## 📦 المتطلبات

قبل البدء، تأكد من تثبيت:

- **Node.js** (v16 أو أحدث) - [تحميل](https://nodejs.org/)
- **MongoDB** (v5 أو أحدث) - [تحميل](https://www.mongodb.com/try/download/community)
- **Git** - [تحميل](https://git-scm.com/)
- محرر نصوص (VSCode موصى به) - [تحميل](https://code.visualstudio.com/)

---

## 🚀 التثبيت

### 1. Clone المشروع

```bash
git clone https://github.com/Ar-f2/AFAQ.git
cd AFAQ
```

### 2. تثبيت Dependencies للـ Backend

```bash
cd backend
npm install
```

### 3. إعداد المتغيرات البيئية

أنشئ ملف `.env` في مجلد `backend`:

```bash
cp .env .env.example
```

ثم عدّل الملف `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/afaq-cms

# JWT Secret (غيّر هذا إلى قيمة عشوائية قوية)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cookie Settings
COOKIE_EXPIRE=7

# File Upload
MAX_FILE_SIZE=5242880
FILE_UPLOAD_PATH=../uploads

# Admin Default Credentials (للاستخدام الأول فقط)
ADMIN_EMAIL=admin@afaq.com
ADMIN_PASSWORD=Admin@123456
```

⚠️ **مهم:** غيّر `JWT_SECRET` إلى قيمة عشوائية قوية في الإنتاج!

### 4. تشغيل MongoDB

تأكد من تشغيل MongoDB على جهازك:

**Windows:**
```bash
mongod
```

**macOS (via Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 5. إنشاء مستخدم أدمن أول

يمكنك إنشاء مستخدم أدمن أول بطريقتين:

#### الطريقة 1: استخدام MongoDB Shell

```bash
mongosh
use afaq-cms
db.users.insertOne({
  name: "Admin",
  email: "admin@afaq.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "superadmin",
  isActive: true,
  createdAt: new Date()
})
```

#### الطريقة 2: عبر API (بعد التشغيل)

سيتم شرحها في قسم الاستخدام.

---

## 💻 الاستخدام

### تشغيل الـ Backend

#### Development Mode (مع auto-restart):

```bash
cd backend
npm run dev
```

#### Production Mode:

```bash
cd backend
npm start
```

سيعمل السيرفر على: `http://localhost:5000`

### الوصول للموقع

- **الموقع العام:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health
- **API Base URL:** http://localhost:5000/api/v1

### إنشاء أول مستخدم أدمن

استخدم Postman أو cURL:

```bash
POST http://localhost:5000/api/v1/auth/register

Headers:
Content-Type: application/json

Body:
{
  "name": "Super Admin",
  "email": "admin@afaq.com",
  "password": "Admin@123456",
  "role": "superadmin"
}
```

⚠️ **ملاحظة:** الـ `/register` endpoint محمي ويتطلب token. لأول مرة، يمكنك تعطيل الحماية مؤقتاً في `backend/routes/auth.js` أو استخدام MongoDB Shell مباشرة.

### تسجيل الدخول

```bash
POST http://localhost:5000/api/v1/auth/login

Body:
{
  "email": "admin@afaq.com",
  "password": "Admin@123456"
}
```

ستحصل على `token` استخدمه في Header للطلبات المحمية:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📁 هيكل المشروع

```
AFAQ/
│
├── backend/                      # Backend (Node.js + Express)
│   ├── config/
│   │   ├── db.js                # اتصال MongoDB
│   │   └── auth.js              # إعدادات JWT
│   ├── models/
│   │   ├── User.js              # نموذج المستخدم
│   │   ├── Agent.js             # نموذج الوكيل
│   │   ├── AgentClick.js        # تتبع نقرات الواتساب
│   │   ├── Institute.js         # نموذج المعهد/الجامعة
│   │   ├── Page.js              # الصفحات الديناميكية
│   │   ├── Registration.js      # طلبات التسجيل
│   │   └── Message.js           # رسائل التواصل
│   ├── routes/
│   │   ├── auth.js              # مسارات المصادقة
│   │   ├── agents.js            # CRUD الوكلاء + تتبع النقرات
│   │   ├── institutes.js        # CRUD المعاهد
│   │   └── media.js             # رفع الملفات
│   ├── middleware/
│   │   ├── auth.js              # التحقق من JWT
│   │   └── upload.js            # معالجة رفع الملفات
│   ├── .env                     # متغيرات البيئة
│   ├── server.js                # نقطة البداية
│   └── package.json
│
├── public/                       # الواجهة العامة
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css         # الأنماط الرئيسية
│   │   │   └── agents.css       # أنماط صفحة الوكلاء
│   │   ├── js/
│   │   │   ├── main.js          # JavaScript الرئيسي
│   │   │   └── agents.js        # صفحة الوكلاء + تتبع
│   │   └── images/
│   ├── index.html               # الصفحة الرئيسية
│   ├── agents.html              # صفحة الوكلاء
│   └── ...
│
├── uploads/                      # ملفات المستخدمين المرفوعة
│   └── images/
│
├── old-site-backup/             # نسخة احتياطية من الموقع القديم
│
├── .gitignore
├── PROJECT_PLAN.md              # خطة المشروع التفصيلية
└── README.md                    # هذا الملف
```

---

## 📚 API Documentation

### Authentication

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@afaq.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer TOKEN
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer TOKEN
```

---

### Agents

#### Get All Agents
```http
GET /api/v1/agents
# Optional query params: ?specialty=معاهد اللغة&isActive=true
```

#### Get Single Agent
```http
GET /api/v1/agents/:id
```

#### Create Agent
```http
POST /api/v1/agents
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

{
  "name": "أحمد محمد",
  "specialty": "معاهد اللغة",
  "description": "متخصص في...",
  "whatsapp": "+60123456789",
  "email": "ahmed@afaq.com",
  "photo": [file]
}
```

#### Update Agent
```http
PUT /api/v1/agents/:id
Authorization: Bearer TOKEN
Content-Type: multipart/form-data
```

#### Delete Agent
```http
DELETE /api/v1/agents/:id
Authorization: Bearer TOKEN
```

#### Track WhatsApp Click ⭐
```http
POST /api/v1/agents/track-click
Content-Type: application/json

{
  "agentId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "device": "Mobile",
  "os": "Android",
  "browser": "Chrome",
  "referrer": "https://google.com"
}
```

#### Get Agent Clicks History
```http
GET /api/v1/agents/:id/clicks
Authorization: Bearer TOKEN
# Optional: ?startDate=2024-01-01&endDate=2024-12-31&page=1&limit=50
```

#### Get Agent Statistics
```http
GET /api/v1/agents/:id/stats
Authorization: Bearer TOKEN
# Optional: ?startDate=2024-01-01&endDate=2024-12-31
```

#### Get Top Agents
```http
GET /api/v1/agents/analytics/top
Authorization: Bearer TOKEN
# Optional: ?limit=5
```

---

### Institutes

#### Get All Institutes
```http
GET /api/v1/institutes
# Optional: ?type=معهد لغة&isPublished=true&isFeatured=true
```

#### Get Single Institute
```http
GET /api/v1/institutes/:id
# Or by slug:
GET /api/v1/institutes/slug/:slug
```

#### Create Institute
```http
POST /api/v1/institutes
Authorization: Bearer TOKEN
Content-Type: multipart/form-data
```

#### Update Institute
```http
PUT /api/v1/institutes/:id
Authorization: Bearer TOKEN
```

#### Delete Institute
```http
DELETE /api/v1/institutes/:id
Authorization: Bearer TOKEN
```

#### Upload Gallery Images
```http
PUT /api/v1/institutes/:id/gallery
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

{
  "images": [file1, file2, ...]
}
```

#### Publish/Unpublish
```http
PUT /api/v1/institutes/:id/publish
Authorization: Bearer TOKEN

{
  "isPublished": true
}
```

---

### Media

#### Upload Single Image
```http
POST /api/v1/media/upload
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

{
  "file": [image file]
}
```

#### Upload Multiple Images
```http
POST /api/v1/media/upload-multiple
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

{
  "files": [file1, file2, ...]
}
```

#### List All Files
```http
GET /api/v1/media/list
Authorization: Bearer TOKEN
```

#### Delete File
```http
DELETE /api/v1/media/:filename
Authorization: Bearer TOKEN
```

---

## 📊 WhatsApp Click Tracking

### كيف يعمل النظام؟

1. **المستخدم يزور صفحة الوكلاء**
2. **يضغط على زر "تواصل عبر واتساب"**
3. **يتم تسجيل النقرة تلقائياً** مع المعلومات التالية:
   - معرف الوكيل (Agent ID)
   - تاريخ ووقت النقرة
   - عنوان IP للزائر
   - نوع الجهاز (Mobile/Tablet/Desktop)
   - نظام التشغيل (Windows/Mac/Android/iOS/Linux)
   - المتصفح (Chrome/Safari/Firefox/Edge)
   - المصدر (Referrer)

4. **يتم توجيه المستخدم إلى الواتساب**

### البيانات المحفوظة

```javascript
{
  agentId: "65a1b2c3...",
  timestamp: "2024-11-23T14:30:00Z",
  ipAddress: "103.20.45.123",
  device: "Mobile",
  os: "Android 13",
  browser: "Chrome Mobile 119",
  referrer: "https://google.com"
}
```

### التحليلات المتاحة

- **إجمالي النقرات** لكل وكيل
- **التوزيع حسب الجهاز** (Mobile: 60%, Desktop: 30%, Tablet: 10%)
- **التوزيع حسب نظام التشغيل**
- **التوزيع حسب المتصفح**
- **الرسم البياني للنقرات** (آخر 7 أيام)
- **أكثر الوكلاء نشاطاً** (Top 5)

### الفوائد

- ✅ معرفة أكثر الوكلاء فعالية
- ✅ تحليل سلوك الزوار
- ✅ قياس نجاح الحملات التسويقية
- ✅ تحديد الأوقات الأكثر نشاطاً
- ✅ تقييم أداء كل وكيل

---

## 🔒 الأمان

### أفضل الممارسات المطبقة

#### 1. المصادقة (Authentication)
- ✅ JWT Tokens مع انتهاء صلاحية
- ✅ HttpOnly Cookies لمنع XSS
- ✅ Bcrypt hashing لكلمات المرور (10 rounds)

#### 2. التحقق من المدخلات (Validation)
- ✅ Express Validator لجميع المدخلات
- ✅ Sanitization للبيانات
- ✅ Type checking

#### 3. الحماية من الهجمات
- ✅ Helmet.js لحماية Headers
- ✅ CORS مع تحديد Origins
- ✅ Rate Limiting لمنع Brute Force
- ✅ File upload restrictions (نوع وحجم)

#### 4. قاعدة البيانات
- ✅ Mongoose Schema Validation
- ✅ Index للأداء والأمان
- ✅ عدم تخزين passwords في plain text

#### 5. Environment Variables
- ✅ جميع البيانات الحساسة في `.env`
- ✅ `.env` في `.gitignore`

### التوصيات للإنتاج

1. **غيّر جميع القيم الافتراضية:**
   - `JWT_SECRET` - استخدم قيمة عشوائية قوية
   - كلمات المرور الافتراضية

2. **استخدم HTTPS:**
   - SSL/TLS certificate
   - Force HTTPS redirects

3. **Backup منتظم:**
   - نسخ احتياطي يومي لقاعدة البيانات
   - تخزين Backups في مكان آمن

4. **Monitoring:**
   - تتبع الأخطاء (Sentry, LogRocket)
   - مراقبة الأداء

5. **Updates:**
   - تحديث Dependencies بانتظام
   - مراقبة الثغرات الأمنية

---

## 🌐 النشر (Deployment)

### الخيارات المتاحة

#### 1. Heroku (سهل ومجاني للبداية)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create afaq-cms

# Add MongoDB (mLab addon)
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### 2. DigitalOcean / AWS / Azure

1. إنشاء VM/Droplet
2. تثبيت Node.js و MongoDB
3. Clone المشروع
4. تثبيت Dependencies
5. إعداد PM2 للـ process management
6. إعداد Nginx كـ reverse proxy
7. إعداد SSL certificate (Let's Encrypt)

#### 3. Vercel (للـ Frontend) + MongoDB Atlas (للـ Backend)

راجع دليل النشر التفصيلي في: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🤝 المساهمة

نرحب بمساهماتك! إذا كنت تريد المساهمة:

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit تغييراتك (`git commit -m 'Add some AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

### Guidelines

- ✅ اتبع نفس أسلوب الكود الموجود
- ✅ أضف تعليقات واضحة بالعربية
- ✅ اختبر التغييرات قبل الـ PR
- ✅ حدّث التوثيق إذا لزم الأمر

---

## 📞 الدعم والتواصل

- **Email:** support@afaq.com
- **GitHub Issues:** [فتح Issue](https://github.com/Ar-f2/AFAQ/issues)
- **Documentation:** راجع `PROJECT_PLAN.md` للتفاصيل الكاملة

---

## 📝 الترخيص

هذا المشروع مرخص تحت **MIT License** - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 🙏 شكر وتقدير

- **Font Awesome** - للأيقونات الرائعة
- **Google Fonts** - لخط Cairo الجميل
- **AOS** - لتأثيرات الحركة
- **MongoDB** - لقاعدة البيانات القوية
- **Express.js** - لإطار العمل السلس

---

## 📈 حالة المشروع

**النسخة الحالية:** 1.0.0

**التقدم:** ✅ 85% مكتمل

### ✅ مكتمل:
- [x] Backend Core (Models, Routes, Middleware)
- [x] Public Website (Homepage, Agents Page)
- [x] WhatsApp Click Tracking System
- [x] Responsive Design (All Devices)
- [x] API Documentation
- [x] Security Implementation

### 🚧 قيد التطوير:
- [ ] Admin Panel (React)
- [ ] Page Builder (GrapesJS)
- [ ] Registration Forms
- [ ] Contact Messages

### 📋 مخطط له:
- [ ] Email Notifications
- [ ] Advanced Analytics Dashboard
- [ ] Multi-language Support
- [ ] Mobile App (React Native)

---

<div align="center">

**صُنع بـ ❤️ لشركة أفاق**

[⬆ العودة للأعلى](#-afaq-cms---نظام-أفاق-لإدارة-تسجيل-الطلاب)

</div>
