# 🌾 KrishiSocial — Agri-Social & AI Agronomy Ecosystem

**KrishiSocial** is a comprehensive, multi-platform agricultural social network and AI-driven agronomic advisory ecosystem designed to empower farmers, agricultural experts, and community members. 

It combines real-time community engagement (**Krishi Charcha**), 24-hour stories, instant messaging, **AI plant disease diagnosis using computer vision and RAG (Retrieval-Augmented Generation)**, **smart crop recommendations**, **live Mandi market prices**, and **localized weather insights** into a unified web and mobile experience.

---

## 🚀 Key Features

### 🌾 1. Social Feed & Farming Community ("Krishi Charcha")
* **Interactive Posts & Media**: Share photos, videos, experiences, and agronomic queries with fellow farmers.
* **Community Polls**: Vote in real-time on agricultural topics, seed choices, and farming strategies.
* **Farming Groups & Communities**: Join location-based or crop-specific communities to discuss tailored practices.
* **Social Interactions**: Like, comment, save posts, and follow experienced farmers or agricultural experts.

### 📸 2. Ephemeral Farming Stories
* Share 24-hour disappearing photo/video stories showing daily field activities, crop growth milestones, or urgent weather warnings.
* View and react to stories from followed farmers.

### 🩺 3. AI Plant Disease Diagnosis & Cure Recommendation
* **Vision AI Analysis**: Upload or capture a photo of an unhealthy leaf or crop. Google Gemini Vision AI identifies symptoms, pests, or diseases.
* **RAG Advisory Engine**: Vector database search retrieves scientific treatment guidelines from authoritative agricultural research PDFs and advisories.
* **Structured Treatment Plan**: Generates actionable recovery plans, including:
  * 🚨 **Immediate Actions**: Urgent steps to stop disease spread.
  * 🌿 **Organic & Biological Remedies**: Eco-friendly solutions (e.g., Neem oil, *Trichoderma*).
  * 🧪 **Chemical Remedies**: Exact active ingredients, dosage per liter, application timing, and pre-harvest intervals.
  * 💧 **Irrigation & Nutrient Advice**: Specific watering and fertilizer adjustments during recovery.

### 🌱 4. AI Smart Crop Recommendation
* Analyzes geolocation, seasonal weather patterns, and soil profile metrics (pH, Nitrogen, Phosphorus, Potassium, Organic Carbon).
* Recommends optimal crops suited for maximum yield and profitability.

### 📈 5. Real-Time Mandi Prices & Market Intelligence
* Fetches live market rates for agricultural commodities across Indian states and districts via government market APIs (Data.gov.in).
* Filter prices by commodity, variety, state, and district to find the best market rates.

### 🌤️ 6. Agri Weather Forecasts
* Real-time temperature, humidity, rainfall probability, and wind metrics.
* Practical field activity recommendations based on upcoming weather conditions.

### 💬 7. Real-Time Messaging & Notifications
* Socket.IO-powered 1-on-1 private messaging and group discussions.
* Direct in-app and push notifications for likes, comments, mentions, and community activity.

### 👑 8. Admin Moderation & Dashboard
* Administrative interface for managing platform users, content moderation, resolving flags, and viewing platform analytics.

### 📱 9. Multi-Platform Support
* **Web Client**: Ultra-fast, responsive Next.js 16 web application.
* **Mobile Client**: Native iOS and Android mobile app built with Expo SDK 54 and React Native.

---

## 🛠️ Technology Stack

| Component | Technologies & Libraries |
| :--- | :--- |
| **Backend API** | Node.js (ES Modules), Express.js 5.x, MongoDB, Mongoose ODM, Socket.IO, JWT, Bcryptjs, Multer |
| **Frontend (Web)** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, Socket.io-client, Axios |
| **Mobile App** | React Native 0.81, Expo SDK 54, Expo Router, NativeWind (Tailwind v3), React Native Reanimated, Expo Location, Expo ImagePicker |
| **AI / Machine Learning** | Google Gemini API (`@google/generative-ai`, `gemini-flash-latest`), LangChain (`@langchain/google-genai`), LangChain Core |
| **Geospatial & Remote Sensing** | Google Earth Engine API (`@google/earthengine`) |
| **Media Cloud Storage** | Cloudinary (`cloudinary`, `multer-storage-cloudinary`) |
| **Agri-Data Engine** | `agri-data` pipeline (`pdf-parse`, `fs-extra`, `csv-parser`), Custom Vector Ingestion Scripts |

---

## 📁 Repository Structure

```
social-app/
├── backend/                  # Express.js REST API & Socket.IO server
│   ├── dataset/              # Agricultural datasets (crops, soil profiles, mandi rates)
│   ├── src/
│   │   ├── agents/           # AI Agents (Disease Detection & Crop Recommendation)
│   │   ├── config/           # Database, Socket.IO, and Vector DB configuration
│   │   ├── controller/       # Route controllers
│   │   ├── middleware/       # Auth JWT & upload middlewares
│   │   ├── model/            # Mongoose schemas (User, Post, Story, Community, Message, etc.)
│   │   ├── route/            # API Route handlers (/auth, /users, /posts, /farmer, /agent, etc.)
│   │   ├── scripts/          # Ingestion & seeding scripts (Vector DB, Admin seed)
│   │   ├── services/         # Weather, Mandi, Earth Engine, & Dataset services
│   │   ├── socket/           # Real-time message & notification handlers
│   │   ├── tools/            # AI tools (Vision AI, Soil Profile, Weather API)
│   │   └── index.js          # Entry point
│   ├── Dockerfile            # Container configuration
│   └── package.json
│
├── frontend/                 # Next.js 16 Web Application
│   ├── app/                  # Next.js App Router pages
│   │   ├── admin/            # Admin moderation dashboard
│   │   ├── charcha/          # Farming communities & discussions
│   │   ├── crop-advisor/     # AI Crop Recommendation tool
│   │   ├── disease-detector/ # AI Plant Disease Vision diagnosis
│   │   ├── mandi/            # Live Mandi market rates
│   │   ├── weather/          # Agri Weather forecast
│   │   ├── profile/          # User profile view
│   │   ├── login/ & register/# Authentication pages
│   │   └── page.tsx          # Main social feed
│   ├── components/           # Reusable UI components (Feed, Navbar, Sidebar, Cards, etc.)
│   ├── context/              # Auth & Socket React contexts
│   ├── services/             # API client calls
│   └── package.json
│
├── app/                      # Mobile Application (React Native + Expo SDK 54)
│   ├── app/                  # Expo Router file-based screens
│   │   └── src/
│   │       ├── components/   # UI components tailored for mobile
│   │       ├── navigation/   # Tab & stack navigation logic
│   │       ├── screens/      # Feed, Scan, Weather, Mandi, Charcha, Profile screens
│   │       └── services/     # Mobile API integrations
│   ├── assets/               # Mobile app icons and splash assets
│   └── package.json
│
└── agri-data/                # Agronomic Data Processing Pipeline
    ├── raw-pdfs/             # Raw agricultural research PDFs & advisories
    ├── processed-json/       # Parsed agronomic structured JSON data
    ├── vector-db/            # Vector store embeddings for RAG retrieval
    ├── inspect_pdf.js        # PDF inspection utility script
    └── package.json
```

---

## 🌐 API Route Summary

| Endpoint Group | Base Route | Description |
| :--- | :--- | :--- |
| **Auth** | `/api/auth` | User registration, login, logout, session verification |
| **Users** | `/api/users` | Profile view/edit, follow/unfollow, user stats, saved posts |
| **Posts** | `/api/posts` | Create post, feed retrieval, like/unlike, comments, poll voting |
| **Stories** | `/api/stories` | Create 24h story, view active stories, react to stories |
| **Communities** | `/api/communities` | Create/join/leave groups, community post feed |
| **Farmer Tools** | `/api/farmer` | Mandi market prices, Weather forecasts, Soil analysis |
| **AI Agents** | `/api/agent` | Disease diagnosis Vision AI agent & Crop Recommendation agent |
| **Chat & Messages**| `/api/chats`, `/api/messages` | Real-time chat threads and messaging history |
| **Admin** | `/api/admin` | Platform analytics, user ban/unban, content moderation |

---

## ⚙️ Environment Variables

Create `.env` files in `backend/` and `frontend/` as needed.

### `backend/.env`
```env
PORT=5000
SOCKET_PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/krishi_social
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI & Data APIs
GEMINI_API_KEY=your_google_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
DATA_GOV_API_KEY=your_data_gov_in_api_key

# Google Service Account JSON (For Earth Engine)
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **yarn** / **pnpm**
* **MongoDB**: Local instance or MongoDB Atlas URI
* **Expo Go App** (Optional, for testing mobile app on physical phone)

---

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Ingest agricultural advisory vector embeddings
node src/scripts/ingestAdvisoryStructured.js

# (Optional) Seed default admin account
node src/scripts/seedAdmin.js

# Start backend server in development mode (Nodemon)
npm run dev
```
The server will start at `http://localhost:5000` with health check available at `http://localhost:5000/api/health`.

---

### 2️⃣ Frontend (Next.js Web App) Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 3️⃣ Mobile App (Expo / React Native) Setup

```bash
# Navigate to app directory
cd app

# Install dependencies
npm install

# Start Expo development server
npx expo start
```
* Press `a` to launch Android Emulator.
* Press `i` to launch iOS Simulator.
* Scan the QR code with the **Expo Go** app on Android/iOS physical device.

---

### 4️⃣ Agri-Data Processing Pipeline Setup

```bash
# Navigate to agri-data directory
cd agri-data

# Install dependencies
npm install

# Inspect & process raw agricultural PDFs
node inspect_pdf.js
```

---

## 📜 Available NPM Scripts

### Backend (`/backend`)
* `npm run dev`: Runs server with hot-reloading via `nodemon`.
* `npm start`: Runs production server using `node src/index.js`.

### Frontend (`/frontend`)
* `npm run dev`: Starts Next.js development server.
* `npm run build`: Compiles production web build.
* `npm run start`: Runs compiled production server.
* `npm run lint`: Runs ESLint check.

### Mobile App (`/app`)
* `npx expo start`: Launches Expo bundler.
* `npm run android`: Runs app on connected Android device/emulator.
* `npm run ios`: Runs app on iOS simulator.
* `npm run web`: Launches web preview of React Native app.

---

## 🛡️ License

This project is licensed under the **ISC License**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or pull request.
