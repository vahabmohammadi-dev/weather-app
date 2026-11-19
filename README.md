
# 🌤️ Weather app — Next.js

کارت آب‌وهوای فارسی با داده‌های لحظه‌ای و پیش‌بینی ۵ روزه.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

----------------------

## ✨ ویژگی‌ها

- 🌍 جستجوی شهر به فارسی و نمایش آب‌وهوای لحظه‌ای
- 📅 پیش‌بینی ۵ روزه با طلوع و غروب آفتاب (حالت `detailed`)
- ⚡ Server Component با کش هوشمند (`revalidate`)
- ♿ دسترسی‌پذیری: `aria-live`، `aria-label`، احترام به `prefers-reduced-motion`
- 🌐 رابط کاربری کامل فارسی (RTL) با تاریخ شمسی (`fa-IR`)
- 🛡️ مدیریت خطا و مقادیر `null` (بدون crash در صورت نقص داده)

-------------

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- Node.js ۱۸.۱۷ یا بالاتر
- npm / pnpm / yarn

### مراحل

---bash----------------
# ۱. کلون
git clone https://github.com/vahabmohammadi-dev/weather-app.git
cd weather-card

# ۲. نصب وابستگی‌ها
npm install

# ۳. اجرا در حالت توسعه
npm run dev

-------------------------------

app/
├── layout.tsx
├── globals.css
├── page.tsx
└── city/
    └── [name]/
        └── page.tsx          # صفحه‌ی جزئیات (detailed)
components/
├── WeatherCard.tsx
└── ...
