# Bondly - Frontend

A modern, responsive dating and social matching application built with React. Bondly provides an intuitive interface for discovering connections, managing matches, and engaging in real-time conversations.

## 📋 Overview

Bondly Frontend is a single-page application (SPA) that delivers a seamless user experience for profile discovery, matching, and messaging. Built with React 19 and modern tooling, it features a beautiful UI with smooth animations, real-time updates, and responsive design.

## ✨ Features

- **User Authentication**: Secure login and multi-step registration with form validation
- **Profile Discovery**: Swipe-based interface for discovering potential matches
- **Match Management**: View and manage your matches with compatibility scores
- **Real-time Messaging**: Live chat functionality powered by Socket.io
- **Dashboard**: Comprehensive overview with stats, recent matches, and activity feed
- **Profile Management**: Edit profile with image uploads and interest selection
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Centralized state with Redux Toolkit
- **Protected Routes**: Route guards for authenticated users

## 🛠️ Tech Stack

### Core

- **React** 19.1.1 - UI library
- **Vite** 7.1.2 - Build tool and dev server
- **React Router DOM** 7.8.1 - Client-side routing

### State Management & Data

- **Redux Toolkit** 2.9.0 - State management
- **React Redux** 9.2.0 - React bindings for Redux
- **Axios** 1.12.2 - HTTP client

### Real-time Communication

- **Socket.io Client** 4.8.3 - Real-time messaging

### Styling

- **Tailwind CSS** 4.1.12 - Utility-first CSS framework
- **Tailwind Merge** 3.3.1 - Merge Tailwind classes
- **Lucide React** 0.562.0 - Icon library

### UI/UX

- **React Hot Toast** 2.6.0 - Toast notifications
- **Clsx** 2.1.1 - Conditional class names

### Development

- **ESLint** 9.33.0 - Code linting
- **TypeScript Types** - Type definitions for React

## 📁 Folder Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and media
│   ├── components/     # Reusable components
│   │   ├── auth/       # Authentication components
│   │   ├── chat/       # Chat-related components
│   │   ├── dashboard/  # Dashboard layout
│   │   ├── matching/   # Swipe card and match modal
│   │   └── ui/         # UI primitives (Button, Card, Input)
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   ├── store/          # Redux store and slices
│   └── utils/          # Utility functions and constants
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running (see Backend README)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Bondly/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (if needed):

```env
VITE_API_URL=http://localhost:3001
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Linting

Run ESLint:

```bash
npm run lint
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Integration

The frontend communicates with the backend REST API. Key endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/signup`
- **Discover**: `/api/discover`
- **Dashboard**: `/api/dashboard`
- **Messages**: `/api/message/*`
- **Conversations**: `/api/conversation/*`
- **Profile**: `/api/profile/*`

All API calls include credentials for cookie-based authentication.

## 🎨 UI Components

### Reusable Components

- **Button**: Customizable button with variants (default, outline)
- **Card**: Container component with header and content
- **Input**: Form input with validation states
- **SwipeCard**: Interactive card for profile discovery
- **MatchModal**: Modal displayed on successful match
- **MessageBubble**: Chat message component
- **UserProfileModal**: User profile display modal

## 🔐 Authentication Flow

1. User registers via multi-step form
2. User logs in with email and password
3. JWT token stored in HTTP-only cookie
4. Token verified on protected routes
5. User state managed in Redux store

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder contains the production-ready files.

### Deployment Platforms

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist/` folder or connect repo
- **AWS S3 + CloudFront**: Upload `dist/` to S3 bucket
- **GitHub Pages**: Deploy `dist/` folder

### Environment Configuration

Update `VITE_API_URL` in production to point to your backend API.

## 🔮 Future Improvements

- [ ] Add TypeScript for type safety
- [ ] Implement PWA features for offline support
- [ ] Add image optimization and lazy loading
- [ ] Enhance accessibility (ARIA labels, keyboard navigation)
- [ ] Add unit and integration tests
- [ ] Implement dark mode
- [ ] Add push notifications
- [ ] Optimize bundle size with code splitting
- [ ] Add error boundary components
- [ ] Implement advanced filtering and search

## 📝 License

ISC

## 👤 Author

Your Name

---

For backend documentation, see [Backend README](../backend/README.md)
