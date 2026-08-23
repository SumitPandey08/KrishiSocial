# 🌾 KrishiSocial — Agri-Social & AI Agronomy Ecosystem

<div align="center">

![KrishiSocial Banner](https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80)

**A Next-Generation Agricultural Social Network, Real-Time Charcha, Ephemeral Stories, Audio/Video Calling, and AI-Powered Agronomic Advisory Platform for Modern Farmers.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=flat&logo=react)](https://react.dev/)
[![Node.js 20](https://img.shields.io/badge/Node.js-20_LTS-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express-5.2.1-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-In--Memory_Cache-red?style=flat&logo=redis)](https://redis.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Vision_AI-orange?style=flat&logo=google)](https://ai.google.dev/)
[![WebRTC](https://img.shields.io/badge/WebRTC-PeerJS_Calling-blueviolet?style=flat&logo=webrtc)](https://peerjs.com/)

</div>

---

## 📖 Overview

**KrishiSocial** is a comprehensive, multi-platform agri-tech ecosystem engineered to bridge the gap between grassroots farmers, verified agricultural scientists, and local markets. 

By unifying **real-time social interactions**, **24-hour farming stories**, **peer-to-peer audio/video calls**, **sub-second Redis in-memory caching**, **AI plant disease computer vision**, **RAG agronomic advisory**, and **live Mandi rates**, KrishiSocial delivers a modern, high-performance platform accessible on any device.

---

## 🚀 Key Features & Modules

### 📸 1. Ephemeral 24-Hour Stories & Status Reel
* **Home Story Tray (`StatusList`)**: Live status bubbles displaying active stories from followed farmers, community members, and your own account with unread/viewed gradient status rings.
* **Full-Screen Reel Player (`StoryViewer`)**:
  * Segmented progress bars with automatic timed playback for photos (5s) and videos.
  * Interactive touch/click zones (Left: previous, Right: next, Press-and-Hold: pause playback).
  * **Interactive Reaction Bursts**: Quick emoji reactions (`❤️`, `🙌`, `🔥`, `🌾`, `👏`, `😂`, `😍`, `🚜`) with real-time floating animations.
  * **Creator Analytics & Management**: Live viewer counter, sliding viewers drawer with timestamps and reactions, and story deletion.
* **Story Creator Modal**: Instant camera/gallery upload supporting MP4, WEBM, JPG, PNG with captioning and public/follower privacy controls.

---

### 🌾 2. Social Feed & Farming Community ("Krishi Charcha")
* **Interactive Updates & Questions**: Post farm updates or ask specific agronomy questions with multi-image/video attachments.
* **Reddit-Style Voting & Best Answers**: Community and expert upvoting/downvoting system with vote scores and verified solution highlights.
* **Follow / Following System**: Real-time follow toggling with optimistic UI updates and synchronized follower counts.
* **Farming Groups & Topic Tags**: Filter feeds by *All*, *Posts*, *Questions*, *My Crops*, *Nearby*, or trending agricultural hashtags (`#OrganicWheat`, `#MonsoonTips`, `#MandiRates`).

---

### ⚡ 3. High-Performance Redis In-Memory Caching
* **Sub-Millisecond Profile Reads**: High-throughput Redis caching for public user profiles (`user:profile:<username>`), private context (`user:me:<userId>`), and search queries (`user:search:<query>`).
* **Viewer Isolation Architecture**: Base profile data and public posts are cached globally while personal viewer states (`isFollowing`) are dynamically evaluated in memory to eliminate data leakage.
* **Event-Driven Cache Invalidation**: Automatic cache invalidation upon profile edits, photo uploads, follow/unfollow events, and post creation/deletion.
* **Non-Blocking Fallback**: Resilient Redis client with automated CLI URI sanitization and graceful fallback to MongoDB if cache is offline.

---

### 📞 4. Real-Time Audio & Video Calling (WebRTC / PeerJS)
* **1-on-1 Farmer-to-Expert Calls**: Crystal-clear WebRTC audio and video calling powered by PeerJS and Socket.IO signaling.
* **Active Call & Busy Detection**: Server-side active call verification and busy detection to prevent conflicting sessions.
* **In-Call Controls**: Camera flip/toggle, microphone mute/unmute, screen switching, and call duration timer.

---

### 🩺 5. AI Plant Disease Doctor & RAG Agronomy Engine
* **Computer Vision Diagnosis**: Snap or upload leaf photos to analyze symptoms, insect pests, fungi, or bacterial infections using Google Gemini Vision AI.
* **RAG Vector Search**: Contextual vector similarity search matching scientific treatments from authoritative research PDFs and agriculture university datasets.
* **Structured Treatment Action Plans**:
  * 🚨 **Immediate Containment**: Quarantine protocols and infected foliage pruning.
  * 🌿 **Organic & Biological Solutions**: Eco-friendly remedies (e.g. *Trichoderma viride*, Neem oil formulations).
  * 🧪 **Scientific Chemical Controls**: Exact chemical active ingredients, spray dosages per liter, application frequency, and pre-harvest intervals (PHI).
  * 💧 **Nutrient & Soil Recovery**: Irrigation adjustments, N-P-K balances, and micronutrient supplements.

---

### 🌱 6. AI Smart Crop Advisor & Soil Profiling
* Combines geolocation coordinates, seasonal weather patterns, and N-P-K / pH soil parameters.
* Machine-learning recommendations for high-yield, drought-resistant, and high-profit crops.

---

### 📈 7. Live Mandi Market Intelligence
* Real-time market prices across Indian states, APMCs, and districts via Data.gov.in integration.
* Filter commodity rates by variety, min/max price, arrival dates, and market trends.

---

### 🌤️ 8. Precision Agri Weather Forecast
* Live GPS temperature, humidity, rainfall probability, and wind metrics.
* Practical agronomy advisories tailored to upcoming precipitation and heatwaves.

---

### 💬 9. Real-Time Messaging & Notifications
* Socket.IO powered private messaging, typing indicators, and media sharing.
* Instant in-app notifications for likes, comments, mentions, answers, and new followers.

---

### 📱 10. Multi-Platform Responsive Design
* **Web (Desktop & Mobile)**: Edge-to-edge full-viewport responsive layout (`100dvh`), iOS safe-area notch support (`env(safe-area-inset-*)`), and sleek floating bottom navigation.
* **Mobile (React Native + Expo)**: Native iOS and Android application with Expo Router.

---

## 🛠️ Technology Stack

| Layer | Technologies & Packages |
| :--- | :--- |
| **Frontend Web** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, PeerJS, Socket.io-client, Axios |
| **Backend REST & WS** | Node.js 20 LTS, Express.js 5.x, Socket.IO 4.8, JWT, Bcryptjs, Multer |
| **Databases & Cache** | MongoDB Atlas (Mongoose ODM), Redis 6.x In-Memory Caching |
| **AI & LLM Services** | Google Gemini API (`@google/generative-ai`), LangChain (`@langchain/google-genai`, `@langchain/core`) |
| **Remote Sensing & Geo** | Google Earth Engine (`@google/earthengine`) |
| **Cloud Media Storage** | Cloudinary (`cloudinary`, `multer-storage-cloudinary`) |
| **Mobile Client** | React Native 0.81, Expo SDK 54, Expo Router, NativeWind |

---

## 📁 Repository Structure

```
social-app/
├── backend/                  # Node.js 20 + Express 5 API Server
│   ├── dataset/              # Agricultural datasets (crops, soil profiles, mandi rates)
│   ├── src/
│   │   ├── agents/           # AI Agents (Disease Detection & Crop Recommendation)
│   │   ├── config/           # Database (Mongo), Redis client, Socket.IO, Vector DB
│   │   ├── controller/       # REST Controllers (Story, User, Post, Call, Auth, etc.)
│   │   ├── middleware/       # Auth JWT, Optional Auth, Cache & Multer middlewares
│   │   ├── model/            # Mongoose Models (User, Post, Story, Call, Chat, etc.)
│   │   ├── route/            # API Route Handlers (/users, /stories, /calls, etc.)
│   │   ├── services/         # Weather, Mandi, Earth Engine, Dataset & KeepAlive
│   │   ├── socket/           # Real-time WebSocket handlers (signaling, chat, alerts)
│   │   ├── utils/            # Redis cache utilities & Cloudinary helpers
│   │   └── index.js          # Server entry point
│   ├── Dockerfile            # Containerized deployment (Node 20 Alpine)
│   └── package.json
│
├── frontend/                 # Next.js 16 (React 19) Web Application
│   ├── app/                  # App Router dynamic pages
│   │   ├── admin/            # Admin moderation dashboard
│   │   ├── charcha/          # Community discussions & WebRTC video calls
│   │   ├── crop-advisor/     # AI Crop Recommendation tool
│   │   ├── disease-detector/ # AI Plant Disease Doctor
│   │   ├── mandi/            # Live Mandi market rates
│   │   ├── weather/          # Agri Weather forecast
│   │   ├── story/[id]/       # Dedicated Full-Screen Story Viewer
│   │   ├── status/[id]/      # Story route alias
│   │   ├── profile/          # User profile view & edit
│   │   ├── login/ & register/# Authentication pages
│   │   └── page.tsx          # Home Feed with Story Tray & Weather Widget
│   ├── components/           # Reusable UI (StatusList, StoryViewer, PostCard, Header, etc.)
│   ├── context/              # Auth, Post, and Socket.IO React Contexts
│   ├── services/             # API client services (storyService, userService, etc.)
│   └── package.json
│
├── app/                      # Mobile Application (React Native + Expo SDK 54)
│   ├── app/                  # Expo Router file-based screens
│   │   └── src/
│   │       ├── components/   # UI components tailored for mobile
│   │       ├── navigation/   # Native tabs & navigation
│   │       ├── screens/      # Native feed, scan, mandi, profile screens
│   │       └── services/     # Mobile API client
│   ├── assets/               # App icons and splash screens
│   └── package.json
│
└── agri-data/                # Agronomic RAG Processing Pipeline
    ├── raw-pdfs/             # Agricultural research papers and university advisories
    ├── processed-json/       # Parsed structured agronomic JSON guidelines
    └── vector-db/            # Vector store embeddings for RAG retrieval
```

---

## 🌐 API Route Index

| Domain | Route | Methods | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth` | `POST` | Register, Login, Logout, Session Verification, Password Reset |
| **Users** | `/api/users/me` | `GET`, `PUT` | Private user profile & profile update (Cached) |
| | `/api/users/me/picture` | `PUT` | Upload and update profile photo |
| | `/api/users/search` | `GET` | Search users by name/username (Cached) |
| | `/api/users/:userId/toggle-follow` | `POST` | Follow or unfollow user with real-time count updates |
| | `/api/users/:username` | `GET` | Public profile & posts (Cached with viewer isolation) |
| **Stories** | `/api/stories/feed` | `GET` | Home feed story tray (Followed + Public + Own active stories) |
| | `/api/stories/:id` | `GET` | Retrieve single story by ID |
| | `/api/stories/:id/view` | `POST` | Record story view tracking |
| | `/api/stories/:id/react` | `POST` | Add/update emoji reaction to story |
| | `/api/stories` | `POST`, `DELETE`| Upload photo/video story or delete existing story |
| **Posts** | `/api/posts` | `GET`, `POST` | Feed retrieval with smart ranking, create post/question |
| | `/api/posts/:id/vote` | `POST` | Upvote/downvote post with dynamic scoring |
| | `/api/posts/:id/comments`| `GET`, `POST` | Threaded comments & best answer selection |
| **Calls** | `/api/calls/initiate` | `POST` | Initiate WebRTC audio/video call with busy verification |
| | `/api/calls/:callId` | `GET`, `PUT` | Fetch active call state, accept/reject/end call session |
| **AI Doctor**| `/api/agent/diagnose` | `POST` | Vision AI leaf analysis & RAG cure plan generation |
| **Crop AI** | `/api/agent/crop-recommend` | `POST` | Soil & weather crop recommendation |
| **Mandi** | `/api/farmer/mandi` | `GET` | Live government commodity market prices |
| **Weather** | `/api/farmer/weather` | `GET` | Geolocation-based weather and rain predictions |
| **Chat** | `/api/chats`, `/api/messages` | `GET`, `POST` | Real-time chat threads and messaging history |
| **Admin** | `/api/admin` | `GET`, `POST` | Platform metrics, user moderation, flag resolution |

---

## ⚙️ Environment Configuration

### `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/krishi_social
REDIS_URL=redis://default:<password>@<host>:<port>
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI & Data Services
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
DATA_GOV_API_KEY=your_data_gov_in_api_key

# Google Earth Engine (Optional)
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: `v18.0.0` or `v20.x` LTS
* **MongoDB**: Local MongoDB or MongoDB Atlas instance
* **Redis**: Local Redis server or Redis Cloud / Upstash instance

### 1️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs at `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`).

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3️⃣ Mobile App Setup (Optional)
```bash
cd app
npm install
npx expo start
```
Scan the QR code with the **Expo Go** app on Android or iOS.

---

## 📜 Available Scripts

| Workspace | Command | Action |
| :--- | :--- | :--- |
| **Backend** | `npm run dev` | Start development server with hot reload (`nodemon`) |
| | `npm start` | Run production server (`node src/index.js`) |
| **Frontend** | `npm run dev` | Start Next.js development server |
| | `npm run build` | Compile optimized Next.js production build |
| | `npm start` | Run compiled Next.js production server |
| | `npm run lint` | Run ESLint validation |
| **Mobile App** | `npx expo start` | Start Expo development bundler |
| | `npm run android` | Launch on Android device / emulator |
| | `npm run ios` | Launch on iOS Simulator |

---

## 🛡️ License

This project is licensed under the **ISC License**.

---

<div align="center">
  <b>Built with ❤️ for the Agricultural Community</b>
</div>
