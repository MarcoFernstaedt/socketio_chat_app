# Real-Time Chat Application (React + Node + Socket.IO)

A production-grade real-time one-to-one messaging application built with a modern full-stack architecture, featuring secure authentication, optimistic UI rendering, online presence indicators, and scalable backend design. This project demonstrates how a professional chat platform is built using best practices across both frontend and backend.

---

## Features

### Authentication & Security
- Full authentication flow powered by **Arcjet**, including bot protection and rate limiting
- JWT-based auth stored in **HTTP-only cookies**
- Password hashing using **bcryptjs**
- Secure serialization via `toSafeUser` to ensure sensitive data never leaks
- Robust global error handling with custom `AppError`
- Protected REST routes + protected WebSocket connections

### Real-Time Messaging
- Instant 1:1 messaging using **Socket.IO**
- Server broadcasts online users in real time
- Optimistic messaging: messages appear immediately and update when confirmed by the server
- Graceful handling of connect/disconnect events
- Avatar-based online/offline presence indicators

### Image Messaging
- Upload images through chat using Cloudinary
- Real-time image delivery
- Image preview directly in the chat bubble

### User Management
- Contacts tab showing all users
- Chats tab showing only active conversation partners
- Live online status across the entire app

### UX Enhancements
- Toggleable notification sounds
- LocalStorage persistence for user preferences
- Smooth auto-scroll to bottom of new messages

### Tech Stack

**Frontend**
- React + TypeScript + Vite  
- Zustand for state management  
- Axios for HTTP communication  
- Socket.IO Client  
- TailwindCSS + DaisyUI for UI  
- Lucide icons  

**Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- Socket.IO Server  
- Cloudinary for file uploads  
- Arcjet security  
- JWT-based authentication  
- Modular architecture with routes, controllers, middleware, and serializers  

---

## Folder Structure

project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── messages.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.
│   │   │   ├── arcjet.middleware.ts
│   │   │   ├── error.ts
│   │   │   └── socket.auth.middleware.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Message.ts
│   │   ├── lib/
│   │   │   ├── AppError.ts
│   │   │   ├── asyncHandler.ts
│   │   │   ├── arcjet.ts
│   │   │   ├── resend.ts
│   │   │   ├── utils.ts
│   │   │   ├── db.ts
│   │   │   ├── socket.ts
│   │   │   ├── cloudinary.ts
│   │   │   ├── env.ts
│   │   │   └── serializers/
│   │   │       └── user.ts
│   │   ├── routes/
│   │   |   ├── auth.routes.ts
│   │   |   ├── users.routes.ts
│   │   |   └── messages.routes.ts
│   |   └── app.ts
│   ├── .env
│
└── frontend/
├── src/
│   ├── store/
│   │   ├── useAuthStore.ts
│   │   └── useChatStore.ts
│   ├── components/
│   │   ├── ChatContainer.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatList.tsx
│   │   ├── ContactsList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── NoConversationHistoryPlaceholder.tsx
│   │   ├── MessageLoadingSkeleton.tsx
│   │   ├── NoChatFound.tsx
│   │   ├── PageLoader.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── UsersLoadingSkeleton.tsx
│   │   └── NoChatHistoryPlaceholder.tsx
│   ├── pages/
│   │   ├── ChatsPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   ├── hooks/
│   │   ├── useKyeboardSound.tsx
│   │   ├── useForm.tsx
│   ├── lib/
│   │   ├── axios.tsx
│   │   ├── error.tsx
│   ├── App.tsx
│   └── index.css
├── index.html
├── vite.config.ts
└── .env

---

## Backend Setup

### Install Dependencies
```bash
cd backend
npm install

Environment Variables

Create backend/.env:

PORT=3000
NODE_ENV=development || production
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

RESEND_API_KEY=yourapikey
EMAIL_FROM=sender
EMAIL_FROM_NAME=sendername

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

ARCJET_API_KEY=
ARCJET_ENV=http://localhost:5173

CLIENT_URL=http://localhost:3000/

Start Backend

npm run dev


⸻

🎨 Frontend Setup

Install Dependencies

cd frontend
npm install

Environment Variables

Create frontend/.env:

VITE_API_URL=http://localhost:3000

Start Frontend

npm run dev


⸻

## Real-Time Events

Incoming Events (Client Receives)

Event	Description
newMessage	Pushes a new real-time message
getOnlineUsers	Array of all currently online user IDs

Outgoing Events (Client Emits)

Event	Description
connect	Establish authenticated socket
disconnect	Cleanup and broadcast disconnect


⸻

## Architecture Summary
	•	Fully typed (TypeScript everywhere)
	•	Zustand controls:
	•	Auth lifecycle
	•	Chat messages
	•	Online users
	•	Socket subscriptions
	•	SafeUser serializer ensures only whitelisted fields are returned
	•	Real-time chat powered by fully authenticated Socket.IO server
	•	Messages stored in MongoDB with senderId/receiverId indexing
	•	Image uploads handled via Cloudinary
	•	Middlewares ensure strict security:
	•	Auth middleware
	•	Arcjet middleware
	•	Socket.IO auth middleware

⸻

## Future Roadmap
	•	End-to-end encryption for messages
	•	Read receipts
	•	Push notifications (desktop + mobile)
	•	Group chats
	•	User profile customization
	•	Message deletion/editing

⸻

## Status

This project demonstrates a fully production-ready real-time messaging system using modern full-stack principles. It is suitable for portfolio use, showcasing advanced knowledge of:
	•	Authentication and security
	•	Real-time WebSocket engineering
	•	Scalable backend architecture
	•	Optimistic UI patterns
	•	Full TypeScript frontend + backend

Perfect for interviews, portfolios, and demonstrating real-world engineering skills.

https://chatify-0co30.sevalla.app/api/ping