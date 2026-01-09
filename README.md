# GreenStitch Seat Booking System

A full-stack, real-time seat booking application built with React and Node.js, featuring advanced seat selection validation, JWT authentication, WebSocket-based real-time updates, and a modern, accessible user interface.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Why These Technologies?](#why-these-technologies)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Algorithms & Core Logic](#algorithms--core-logic)
- [Modules & Libraries](#modules--libraries)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Development Process](#development-process)

## 🎯 Project Overview

This project is a comprehensive seat booking system developed as part of the GreenStitch Frontend Technical Assessment. It implements a sophisticated seat selection interface with real-time synchronization, ensuring data consistency across multiple users while maintaining an exceptional user experience.

### Key Highlights

- **Real-time Synchronization**: Multiple users can book seats simultaneously with live updates
- **Advanced Validation**: Prevents isolated seat selection using row and column continuity rules
- **Secure Authentication**: JWT-based authentication with password hashing
- **Persistent Storage**: PostgreSQL database ensures data consistency across sessions
- **Accessibility First**: WAI-ARIA compliant with full keyboard navigation support
- **Modern UI/UX**: Smooth animations, toast notifications, and responsive design

## ✨ Features

### Core Functionality
- **Interactive Seat Grid**: 8×10 seat matrix with visual state indicators
- **Tiered Pricing**: Premium (₹1000), Standard (₹750), Economy (₹500) based on row location
- **Continuity Rule Validation**: Prevents users from creating isolated available seats between selected/booked seats
- **Real-time Updates**: Live seat availability updates via WebSocket
- **Booking Persistence**: All bookings saved to PostgreSQL database
- **User Authentication**: Secure registration and login with JWT tokens
- **Booking History**: Users can view their past bookings in the dashboard

### User Experience
- **Instant Feedback**: Real-time price calculation and seat state updates
- **Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support
- **Error Handling**: Comprehensive error messages and validation feedback
- **Loading States**: 3D pulse loading animations for async operations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework for building component-based interfaces |
| **React Router DOM** | 7.12.0 | Client-side routing and navigation |
| **Framer Motion** | 12.24.12 | Animation library for smooth UI transitions |
| **Axios** | 1.13.2 | HTTP client for API communication |
| **Socket.IO Client** | 4.8.3 | Real-time bidirectional communication |
| **Sonner** | 2.0.7 | Toast notification system |
| **React Scripts** | 5.0.1 | Build tooling and development server |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | JavaScript runtime for server-side execution |
| **Express.js** | 4.18.2 | Web application framework for RESTful APIs |
| **PostgreSQL** | Latest | Relational database for persistent data storage |
| **Sequelize** | 6.35.2 | ORM for database operations and migrations |
| **Socket.IO** | 4.7.2 | WebSocket server for real-time updates |
| **JSON Web Token** | 9.0.2 | Stateless authentication tokens |
| **Bcrypt.js** | 2.4.3 | Password hashing for secure storage |
| **Express Validator** | 7.0.1 | Input validation and sanitization |
| **Helmet** | 7.1.0 | Security middleware for HTTP headers |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing configuration |

## 🤔 Why These Technologies?

### Frontend Choices

#### **React 18**
- **Why**: Industry-standard library with excellent ecosystem, component reusability, and virtual DOM for performance
- **Benefits**: Hooks API for state management, large community, extensive documentation, and strong TypeScript support

#### **React Router DOM v7**
- **Why**: Declarative routing with nested routes, code splitting, and protected route capabilities
- **Benefits**: Enables SPA navigation without page reloads, supports authentication-based route protection

#### **Framer Motion**
- **Why**: Production-ready animation library with declarative API and excellent performance
- **Benefits**: Smooth 60fps animations, gesture support, layout animations, and reduced bundle size compared to alternatives

#### **Axios**
- **Why**: Promise-based HTTP client with interceptors for request/response handling
- **Benefits**: Automatic JSON transformation, request/response interceptors for token management, better error handling than fetch API

#### **Socket.IO Client**
- **Why**: Abstraction over WebSockets with automatic fallbacks and reconnection logic
- **Benefits**: Real-time bidirectional communication, automatic reconnection, room-based messaging, and cross-browser compatibility

#### **Sonner**
- **Why**: Lightweight, accessible toast notification library
- **Benefits**: Minimal bundle size, smooth animations, accessible by default, and easy API

### Backend Choices

#### **Node.js with Express.js**
- **Why**: JavaScript on both frontend and backend reduces context switching, Express provides minimal, flexible framework
- **Benefits**: Fast development, large ecosystem, excellent async/await support, middleware architecture

#### **PostgreSQL (Neon)**
- **Why**: Robust relational database with ACID compliance, complex query support, and Neon provides serverless PostgreSQL
- **Benefits**: Data integrity, relationships between tables, transactions, and scalable cloud hosting

#### **Sequelize ORM**
- **Why**: Mature ORM with migrations, associations, and query building
- **Benefits**: Type-safe queries, automatic SQL generation, model relationships, and migration management

#### **Socket.IO**
- **Why**: Real-time communication library with room support and automatic reconnection
- **Benefits**: Event-based messaging, room management for seat updates, fallback to polling if WebSockets unavailable

#### **JWT (JSON Web Tokens)**
- **Why**: Stateless authentication tokens that don't require server-side session storage
- **Benefits**: Scalable, works across domains, contains user information, and expires automatically

#### **Bcrypt.js**
- **Why**: Industry-standard password hashing with salt rounds
- **Benefits**: One-way hashing, protection against rainbow table attacks, configurable complexity

#### **Express Validator**
- **Why**: Middleware for validating and sanitizing user input
- **Benefits**: Prevents injection attacks, validates data types, custom validation rules

#### **Helmet**
- **Why**: Security middleware that sets various HTTP headers
- **Benefits**: Protects against XSS, clickjacking, and other common attacks

## 🏗 Architecture & Design Patterns

### Frontend Architecture

#### **Component-Based Architecture**
- Modular, reusable components (Login, Register, Dashboard, SeatBooking, BookingConfirmationModal)
- Separation of concerns: UI components, services, contexts

#### **State Management**
- **useReducer**: Complex state logic for seat grid, selected seats, and booking state
- **Context API**: Global authentication state (AuthContext)
- **Local Storage**: Persistence of selected seats and authentication tokens

#### **Service Layer Pattern**
- **api.js**: Centralized Axios instance with interceptors
- **authService.js**: Authentication-related API calls
- **seatService.js**: Seat grid and booking operations
- **bookingService.js**: Booking history and management

#### **Custom Hooks**
- Authentication context provides `useAuth` hook
- Protected routes using `ProtectedRoute` component

### Backend Architecture

#### **MVC Pattern**
- **Models**: Sequelize models (User, Booking, Seat)
- **Routes**: Express route handlers (auth, seats, bookings)
- **Services**: Business logic (seatValidation.js)
- **Middleware**: Authentication, validation, error handling

#### **RESTful API Design**
- Resource-based URLs (`/api/seats`, `/api/bookings`)
- HTTP methods (GET, POST, PUT, DELETE)
- Standardized response formats

#### **WebSocket Integration**
- Socket.IO for real-time seat updates
- Room-based messaging for seat grid changes
- Event-driven architecture

## 🧮 Algorithms & Core Logic

### 1. Seat Continuity Validation Algorithm

The most critical algorithm in this project is the **Continuity Rule Validation**, which prevents users from creating isolated available seats.

#### **Problem Statement**
Users cannot leave any available seat isolated between their selected seats. The pattern `[Selected/Booked] [Available] [Selected/Booked]` must be prevented.

#### **Algorithm Implementation**

```javascript
// Row-based validation
for (let i = 1; i < row.length - 1; i++) {
  const prevStatus = row[i - 1].status;
  const currStatus = row[i].status;
  const nextStatus = row[i + 1].status;
  
  if (currStatus === AVAILABLE && 
      isOccupied(prevStatus) && 
      isOccupied(nextStatus)) {
    return false; // Isolated seat detected
  }
}

// Column-based validation
for (let i = 1; i < grid.length - 1; i++) {
  const prevStatus = grid[i - 1][seatIndex].status;
  const currStatus = grid[i][seatIndex].status;
  const nextStatus = grid[i + 1][seatIndex].status;
  
  if (currStatus === AVAILABLE && 
      isOccupied(prevStatus) && 
      isOccupied(nextStatus)) {
    return false; // Isolated seat detected
  }
}
```

#### **Why This Algorithm?**
- **Time Complexity**: O(n) where n is the number of seats in a row/column
- **Space Complexity**: O(1) - only checks adjacent seats
- **Dual Validation**: Checks both rows and columns to prevent isolation in any direction
- **Edge Case Handling**: Skips first and last seats (no neighbors on one side)

#### **Implementation Details**
- **Frontend Validation**: Instant feedback before API call
- **Backend Validation**: Authoritative validation before database commit
- **Grid Cloning**: Creates temporary grid state to test selection without side effects

### 2. Price Calculation Algorithm

```javascript
const calculateTotalPrice = (grid, selectedIds) => {
  let total = 0;
  selectedIds.forEach(id => {
    const [row, seat] = id.split('-').map(Number);
    const seatData = grid[row][seat];
    total += getSeatPrice(seatData.rowLabel);
  });
  return total;
};
```

- **Time Complexity**: O(k) where k is the number of selected seats
- **Efficient**: Direct lookup based on row label, no iteration through pricing config

### 3. Grid Initialization Algorithm

```javascript
const createInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 8; row++) {
    const rowSeats = [];
    const rowLabel = String.fromCharCode(65 + row); // A-H
    for (let seat = 0; seat < 10; seat++) {
      rowSeats.push({
        id: `${row}-${seat}`,
        row: row,
        rowLabel: rowLabel,
        seat: seat,
        status: SEAT_STATUS.AVAILABLE
      });
    }
    grid.push(rowSeats);
  }
  return grid;
};
```

- **Time Complexity**: O(rows × seats) = O(80) for 8×10 grid
- **Space Complexity**: O(80) for grid structure

### 4. Authentication Flow Algorithm

1. **Registration**: User input → Validation → Password hashing (bcrypt) → Database insert → JWT generation
2. **Login**: Credentials → Database lookup → Password verification → JWT generation → Token storage
3. **Protected Routes**: Token extraction → JWT verification → User context → Route access

## 📦 Modules & Libraries

### Frontend Modules

#### **src/services/api.js**
- **Purpose**: Centralized HTTP client configuration
- **Features**: 
  - Base URL configuration
  - Request interceptor for JWT token injection
  - Response interceptor for 401 handling and automatic logout
  - Error handling and retry logic

#### **src/services/authService.js**
- **Purpose**: Authentication API calls
- **Methods**: `register()`, `login()`, `getCurrentUser()`
- **Returns**: User data and JWT tokens

#### **src/services/seatService.js**
- **Purpose**: Seat grid and booking operations
- **Methods**: `getSeatGrid()`, `bookSeats()`, `getBookingHistory()`
- **Features**: Real-time updates via Socket.IO integration

#### **src/services/bookingService.js**
- **Purpose**: Booking management
- **Methods**: `getUserBookings()`, `getBookingDetails()`
- **Returns**: Booking history with seat details

#### **src/contexts/AuthContext.js**
- **Purpose**: Global authentication state management
- **Features**: 
  - User state (logged in/out, user data)
  - Login/logout functions
  - Token management
  - Automatic token refresh

#### **src/components/ProtectedRoute.js**
- **Purpose**: Route protection middleware
- **Logic**: Checks authentication state, redirects to login if unauthorized

### Backend Modules

#### **backend/models/User.js**
- **Purpose**: User data model
- **Fields**: id, email, password (hashed), name, createdAt, updatedAt
- **Methods**: Password hashing hooks, instance methods

#### **backend/models/Booking.js**
- **Purpose**: Booking data model
- **Fields**: id, user_id, seat_ids (JSON), total_price, status, createdAt
- **Relationships**: Belongs to User

#### **backend/models/Seat.js**
- **Purpose**: Seat state model (for analytics)
- **Fields**: id, row_label, seat_number, status, booking_id
- **Usage**: Track seat booking history

#### **backend/routes/auth.js**
- **Purpose**: Authentication endpoints
- **Endpoints**: POST `/register`, POST `/login`, GET `/me`
- **Validation**: Express-validator for input validation

#### **backend/routes/seats.js**
- **Purpose**: Seat grid management
- **Endpoints**: GET `/grid`, POST `/book`
- **Features**: Continuity validation, real-time updates

#### **backend/routes/bookings.js**
- **Purpose**: Booking history and management
- **Endpoints**: GET `/history`, GET `/:id`
- **Authentication**: JWT middleware required

#### **backend/services/seatValidation.js**
- **Purpose**: Business logic for seat validation
- **Functions**: `validateGap()`, `getSeatPrice()`, `calculateTotalPrice()`
- **Algorithm**: Continuity rule validation (row and column)

#### **backend/websocket/socketHandler.js**
- **Purpose**: Real-time seat update broadcasting
- **Events**: `seat-booked`, `seat-updated`
- **Rooms**: Seat grid room for broadcasting updates

#### **backend/middleware/auth.js**
- **Purpose**: JWT token verification middleware
- **Logic**: Extracts token, verifies signature, attaches user to request

## 📁 Project Structure

```
GreenStitch-Frontend-Assessment/
├── backend/
│   ├── config/
│   │   ├── config.js          # Sequelize configuration
│   │   └── database.js        # PostgreSQL connection
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── validateAuth.js   # Authentication validation
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Booking.js        # Booking model
│   │   ├── Seat.js           # Seat model
│   │   └── index.js          # Model associations
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── seats.js          # Seat booking routes
│   │   └── bookings.js       # Booking history routes
│   ├── services/
│   │   └── seatValidation.js # Continuity validation logic
│   ├── websocket/
│   │   └── socketHandler.js  # Socket.IO event handlers
│   ├── server.js             # Express server setup
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Login.js                    # Login component
│   │   ├── Register.js                # Registration component
│   │   ├── Dashboard.js               # User dashboard
│   │   ├── BookingConfirmationModal.js # Booking confirmation
│   │   ├── ProtectedRoute.js         # Route protection
│   │   ├── Loading.js                 # Loading animation
│   │   ├── Auth.css                   # Auth styling
│   │   ├── Dashboard.css              # Dashboard styling
│   │   └── BookingConfirmationModal.css
│   ├── contexts/
│   │   └── AuthContext.js    # Authentication context
│   ├── services/
│   │   ├── api.js            # Axios instance
│   │   ├── authService.js    # Auth API calls
│   │   ├── seatService.js    # Seat API calls
│   │   └── bookingService.js # Booking API calls
│   ├── App.js                # Main app component
│   ├── SeatBooking.js        # Main seat booking component
│   ├── SeatBooking.css       # Seat grid styling
│   ├── index.js              # React entry point
│   └── index.css             # Global styles
├── public/
│   └── index.html            # HTML template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The frontend will run on `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm start

# Or use nodemon for auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Seats

- `GET /api/seats/grid` - Get current seat grid state
- `POST /api/seats/book` - Book selected seats (protected)

### Bookings

- `GET /api/bookings/history` - Get user's booking history (protected)
- `GET /api/bookings/:id` - Get specific booking details (protected)

### WebSocket Events

- `seat-booked` - Emitted when seats are booked
- `seat-updated` - Emitted when seat grid is updated

## 🔄 Development Process

### Git Workflow

The project follows a structured commit history:

1. **Backend Foundation**: Database setup, models, and server configuration
2. **Authentication System**: JWT middleware, routes, and validation
3. **Seat Booking API**: Core booking logic with continuity validation
4. **Real-time Updates**: Socket.IO integration for live updates
5. **Frontend Services**: API client and service layer
6. **Authentication UI**: Login and registration components
7. **Dashboard**: User dashboard with booking history
8. **Main Booking Interface**: Seat selection with validation
9. **UI Enhancements**: Styling, animations, and loading states

### Code Quality

- **No Comments**: Code is self-documenting with clear variable names
- **Error Handling**: Comprehensive try-catch blocks and user-friendly error messages
- **Validation**: Both frontend and backend validation for data integrity
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Testing Considerations

- **Continuity Rule**: Test edge cases (first/last seats, corners, gaps)
- **Concurrent Bookings**: Multiple users booking simultaneously
- **Authentication**: Token expiration, invalid tokens, protected routes
- **Real-time Updates**: WebSocket reconnection, room management

## 🎨 UI/UX Design

### Design System

- **Color Scheme**: Dark theme with claymorphism/glassmorphism effects
- **Typography**: Spline Sans font family for modern, organic feel
- **Icons**: Material Symbols Outlined for consistent iconography
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support with roving tabindex
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus Management**: Visible focus indicators and logical tab order
- **Live Regions**: Announcements for dynamic content updates

## 📝 License

This project is part of the GreenStitch Frontend Technical Assessment.

## 👨‍💻 Development Notes

### Key Design Decisions

1. **Dual Validation**: Frontend validation for instant feedback, backend validation for security
2. **Real-time Updates**: WebSocket ensures all users see current seat availability
3. **State Management**: useReducer for complex seat grid state, Context API for auth
4. **Service Layer**: Separation of API calls from components for maintainability
5. **Error Handling**: Comprehensive error boundaries and user-friendly messages

### Performance Optimizations

- **Memoization**: useCallback for event handlers to prevent re-renders
- **Lazy Loading**: Code splitting for route-based components
- **Efficient Algorithms**: O(n) complexity for validation, O(k) for price calculation
- **Database Indexing**: Indexed foreign keys and frequently queried fields

---

**Built with ❤️ for GreenStitch Technologies**
