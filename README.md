# socketio_chat_app# Chatify Backend

Chatify is a modern, secure, and scalable backend service for real-time messaging.  
It provides authentication, authorization, bot protection, rate limiting, and email onboarding — all built with enterprise-grade TypeScript and Express best practices.

---

## Overview

Chatify powers a full-stack chat application that enables users to sign up, log in, and exchange messages.  
It features a robust authentication flow, secure cookie-based JWT handling, and intelligent middleware protection (Arcjet) for rate limiting and bot detection.  

The service is structured with modular controllers, models, and middleware for maintainability and scalability.

---

## Core Features

- **User Authentication & Authorization**  
  Secure signup/login flow with JWT cookies, password hashing via `bcryptjs`, and protected routes using middleware.

- **Email Onboarding**  
  New users receive a custom HTML welcome email via [Resend](https://resend.com).

- **Intelligent Protection**  
  Integrated [Arcjet](https://arcjet.com) middleware for:
  - Rate limiting (sliding window)
  - Bot and spoof detection
  - Live security enforcement

- **Protected API Routes**
  - `/auth/me` – verify authenticated user  
  - `/auth/sign-up` & `/auth/sign-in` – secure user creation and login  
  - `/users` – retrieve all users (excluding current user)  
  - `/messages` – send messages, view all chats, and fetch conversation history

- **Cloudinary Integration**  
  Upload and serve profile pictures and message images seamlessly.

- **Messaging System**  
  Send and retrieve messages between users with strong data consistency in MongoDB.

- **Type-Safe Architecture**  
  - Full TypeScript coverage  
  - Typed Express Request extensions for `req.user`  
  - Reusable `ReqWithUser` type  
  - Centralized type declarations

---

## Technology Stack

| Category | Tools & Libraries |
|-----------|------------------|
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (cookie-based) + bcryptjs |
| **Security** | Arcjet (rate limiting & bot defense) |
| **Email Service** | Resend |
| **Cloud Storage** | Cloudinary |
| **Environment Management** | dotenv |
| **Runtime** | Node.js (ES2020 target) |

---

## Middleware Overview

- **`authorizationMiddleware`**  
  Validates JWT tokens from cookies, fetches authenticated users, and attaches user data to `req.user`.

- **`arcjetProtection`**  
  Shields all incoming requests with real-time rate limits and detects automated or spoofed bot requests.

- **Error Handling**  
  All controllers implement structured try/catch logic with consistent HTTP responses.

---

## Project Structure

src/
├── controllers/
│   ├── auth.controller.ts
│   ├── message.controller.ts
│   └── user.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── arcjet.middleware.ts
│   └── error.middleware.ts
├── models/
│   ├── User.ts
│   └── Message.ts
├── lib/
│   ├── db.ts
│   ├── cloudinary.ts
│   ├── resend.ts
│   ├── arcjet.ts
│   └── env.ts
├── types/
│   └── request.ts
└── routes/
├── auth.route.ts
├── users.route.ts
└── message.route.ts

---

## Setup & Installation

### 1. Clone the Repository
```bash
git clone git@github.com:MarcoFernstaedt/socketio_chat_app.git
cd socketio_chat_app/backend

### 2. Install Dependencies
```bash
npm install

### 3. Environment Variables
#### Create a .env file in the root directory:

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=no-reply@chatify.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ARCJET_API_KEY=your_arcjet_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development

### 4. Run Development Server

```bash
npm run dev


---

## Future Enhancements

- Implement real-time messaging using Socket.io  
- Add online status and typing indicators  
- Integrate push notifications for new messages  
- Display message read receipts  
- Create an administrative dashboard for analytics and moderation  
- Improve caching and query optimization for large-scale user bases  
- Add unit and integration tests for controllers and middleware  

---

## Author

**Marco Fernstaedt**  
Lead Engineer
Focused on building secure, scalable and optimized technology systems.