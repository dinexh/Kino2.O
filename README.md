# Chitramela

Chitramela is a web application built with Next.js for managing and showcasing events.

## Features

- Event registration and management
- User authentication with Firebase
- Responsive design
- Real-time updates

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/chitramela.git
cd chitramela
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the required environment variables (see Environment Setup section)

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

To get these values:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings
4. Find the Firebase configuration object
5. Copy the values to your `.env.local` file

## Project Structure

```
chitramela/
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   └── events/
│   │   ├── layout.js
│   │   └── page.js
│   └── config/
│       └── firebase.js
├── public/
│   └── assets/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@chitramela.com or open an issue in the repository.