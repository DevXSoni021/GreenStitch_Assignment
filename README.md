# GreenStitch_Assignment

## Seat Booking System

A full-stack seat booking application built with React and Node.js, featuring real-time updates, authentication, and advanced seat selection validation.

## Features

- **Seat Selection**: Interactive 8×10 seat grid with visual feedback
- **Pricing Tiers**: Premium (₹1000), Standard (₹750), Economy (₹500)
- **Continuity Rule**: Prevents isolated seat selection (both row and column validation)
- **Authentication**: JWT-based user authentication
- **Real-time Updates**: Socket.IO for live seat availability
- **Booking Persistence**: PostgreSQL database for data consistency
- **Accessibility**: WAI-ARIA compliant with keyboard navigation
- **Modern UI**: Framer Motion animations and Sonner toast notifications

## Tech Stack

### Frontend
- React 18
- React Router
- Framer Motion
- Sonner
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon)
- Sequelize ORM
- Socket.IO
- JWT Authentication
- Bcrypt

## Installation

### Frontend
```bash
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## Development Process

This project was developed with a focus on:
- Clean, maintainable code structure
- Comprehensive error handling
- User experience optimization
- Accessibility compliance
- Real-time synchronization

## License

This project is part of the GreenStitch Frontend Technical Assessment.

