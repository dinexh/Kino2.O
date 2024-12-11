# Chitramela 🎨

A sophisticated event management platform built with Next.js 14, featuring real-time updates and seamless user experiences.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.x-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Features

- **Event Management**
  - Create and manage events with rich media support
  - Real-time event updates and notifications
  - Advanced event filtering and search capabilities
  - Interactive event calendar

- **Authentication & Authorization**
  - Secure Firebase Authentication integration
  - Role-based access control (Admin, Organizer, User)
  - Social media login options
  - Protected routes and API endpoints

- **User Experience**
  - Responsive design with Tailwind CSS
  - Dark/Light mode support
  - Progressive Web App (PWA) capabilities
  - Optimized performance with Next.js 14 features

- **Backend Integration**
  - Firebase Realtime Database/Firestore integration
  - Cloud Functions for serverless operations
  - Secure file storage with Firebase Storage
  - Real-time data synchronization

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm/yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chitramela.git
cd chitramela
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 Firebase Configuration

### Setting up Firebase

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication methods you want to use
3. Set up Firestore/Realtime Database
4. Configure Storage rules

### Environment Variables

Create `.env.local` with these Firebase configurations:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📁 Project Structure

```
chitramela/
├── my-app/                          # Main application directory
│   ├── src/
│   │   └── app/
│   │       ├── (pages)/            # Route groups
│   │       │   └── events/
│   │       │       └── register/
│   │       │           └── page.js  # Event registration page
│   │       ├── layout.js           # Root layout component
│   │       └── page.js             # Home page component
│   │
│   ├── public/                     # Static assets
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   │
│   ├── package.json               # Project dependencies and scripts
│   ├── package-lock.json          # Locked dependencies (npm)
│   ├── yarn.lock                  # Locked dependencies (yarn)
│   └── .gitignore                # Git ignore rules for app directory
│
├── .env.local                    # Environment variables
├── .gitignore                    # Root git ignore rules
├── LICENSE                       # Project license
└── README.md                     # Project documentation
```

### Key Directories and Files

- **my-app/**: Contains the Next.js application
  - **src/app/**: App router directory (Next.js 13+)
  - **public/**: Static assets and images
  - **package.json**: Project configuration and dependencies

- **Root Level**:
  - **.env.local**: Environment variables
  - **LICENSE**: MIT license file
  - **README.md**: Project documentation

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run tests
```

### Firebase Features Used

- **Authentication**: User management and social auth
- **Firestore/RTDB**: Data storage and real-time sync
- **Storage**: Media file management
- **Cloud Functions**: Serverless operations
- **Security Rules**: Data access control

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Deploy to Vercel

```bash
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Documentation: [docs.chitramela.com](https://docs.chitramela.com)
- Issues: [GitHub Issues](https://github.com/yourusername/chitramela/issues)
- Email: support@chitramela.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)