# Chitramela 2025 - Kino 2.O

A comprehensive event management platform for Chitramela 2025, built with Next.js 14, featuring event registration, payment verification, admin dashboard, and real-time analytics.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.9-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## About The Project

Chitramela is a film festival event management system that handles multiple contests and festival attendance:
- **Photography Contest**
- **Short Film Contest**
- **Reel Making Contest**
- **Festival Attendance Registration**

The platform provides complete event lifecycle management from registration to payment verification, event submission, and analytics.

## Highlights

### Event Features
- Multiple event registration with custom forms
- Payment integration (Google Pay, PhonePe, Paytm, Others)
- Payment verification system for admins
- Event submission portal for participants
- Detailed rules and guidelines for each contest
- Event schedule and promotional pages

### Authentication & Security
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (User & Superuser)
- Protected routes and API endpoints
- Password recovery via email
- Secure session management

### Admin Dashboard
- Registration management (view, search, filter, verify)
- Payment verification workflow
- Real-time analytics and charts:
  - Daily registration trends
  - Gender distribution
  - Hourly registration patterns
  - Event popularity metrics
  - Referral statistics
- User management system
- Export and reporting features

### Communication
- Automated email notifications
- Registration confirmations
- Payment verification updates
- Password reset emails
- Custom branded templates

### User Experience
- Responsive mobile-first design
- Modern and intuitive interface
- Interactive landing page with:
  - Hero section with video
  - Event countdown timer
  - About section
  - Events showcase
  - Photo gallery
  - Team showcase
  - Sponsors section
  - FAQ section
- Smooth transitions and loading states
- SEO optimized with auto-generated sitemaps

## Tech Stack

**Frontend:** Next.js 14.2, React 18, Custom CSS, React Icons  
**Backend:** Node.js, MongoDB with Mongoose  
**Authentication:** JWT (jsonwebtoken), bcrypt.js  
**Email:** Nodemailer  
**Charts:** Chart.js, Recharts, React-chartjs-2  
**Deployment:** Docker, PM2  
**SEO:** next-sitemap

## Project Structure

```
Kino2.O/
├── my-app/                              # Main application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (pages)/                # Route groups
│   │   │   │   ├── dashboard/          # Admin dashboard
│   │   │   │   ├── events/
│   │   │   │   │   ├── register/       # Event registration
│   │   │   │   │   └── payment/        # Payment confirmation
│   │   │   │   ├── login/              # Login page
│   │   │   │   ├── forgot-password/    # Password recovery
│   │   │   │   ├── verify/             # Email verification
│   │   │   │   ├── promotions/         # Promotional events
│   │   │   │   ├── schedule/           # Event schedule
│   │   │   │   ├── stats/              # Statistics page
│   │   │   │   ├── submission/         # Event submission
│   │   │   │   ├── Rules/              # Contest rules
│   │   │   │   └── maintenace/         # Support, Terms, Privacy
│   │   │   ├── api/                    # API routes
│   │   │   │   ├── auth/               # Authentication endpoints
│   │   │   │   ├── dashboard/          # Dashboard data
│   │   │   │   ├── payment/            # Payment verification
│   │   │   │   ├── register/           # Registration
│   │   │   │   ├── stats/              # Analytics
│   │   │   │   ├── submission/         # Submissions
│   │   │   │   ├── support/            # Support
│   │   │   │   ├── users/              # User management
│   │   │   │   └── verify/             # Verification
│   │   │   ├── components/             # Shared components
│   │   │   │   ├── Footer/
│   │   │   │   ├── Loader/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Nav/
│   │   │   │   └── ProtectedRoute.js
│   │   │   ├── UI/                     # Landing page sections
│   │   │   │   ├── Hero/
│   │   │   │   ├── Counter/
│   │   │   │   ├── About/
│   │   │   │   ├── Events/
│   │   │   │   ├── Gallery/
│   │   │   │   ├── FAQ/
│   │   │   │   ├── Team/
│   │   │   │   └── Sponcers/
│   │   │   ├── Data/                   # Static data
│   │   │   │   ├── activities.js       # Event details
│   │   │   │   ├── faqs.js
│   │   │   │   ├── gallery.js
│   │   │   │   ├── logo.js
│   │   │   │   ├── rules.js
│   │   │   │   ├── scheduleData.js
│   │   │   │   ├── team.js
│   │   │   │   └── about.js
│   │   │   ├── Assets/                 # Images and media
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   └── globals.css
│   │   ├── config/
│   │   │   └── db.js                   # MongoDB connection
│   │   ├── context/
│   │   │   └── AuthContext.js          # Auth context
│   │   ├── lib/
│   │   │   └── jwt.js                  # JWT utilities
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── withAuth.js
│   │   ├── model/
│   │   │   ├── users.js                # User model
│   │   │   └── registrations.js        # Registration model
│   │   ├── scripts/                    # Utility scripts
│   │   │   ├── addInitialUsers.js
│   │   │   ├── clearUsers.js
│   │   │   ├── testRegistration.js
│   │   │   └── updateSno.js
│   │   └── utils/
│   │       ├── emailService.js
│   │       └── emailTemplates.js
│   ├── public/                         # Static assets
│   │   ├── logo/                       # Partner logos
│   │   ├── HeroVideo.mp4
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── Dockerfile
│   ├── ecosystem.config.js             # PM2 config
│   ├── next.config.mjs
│   ├── next-sitemap.config.cjs
│   ├── package.json
│   └── tsconfig.json
├── LICENSE
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB 8.x or higher
- npm/yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Kino2.O.git
cd Kino2.O/my-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create `.env.local` file:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/chitramela

# JWT
JWT_SECRET=your_secret_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM_NAME=Chitramela 2025
EMAIL_FROM_ADDRESS=your-email@gmail.com
```

4. **Start Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Add Admin User
```bash
npm run add-users
```

## Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Run linter
npm run add-users    # Add admin users
```

## Docker

```bash
# Build
docker build -t chitramela:latest .

# Run
docker run -p 3000:3000 chitramela:latest
```

## PM2 Deployment

```bash
npm run build
pm2 start ecosystem.config.js
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Chart.js](https://www.chartjs.org/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

**Chitramela 2025** - Celebrating the Art of Cinema