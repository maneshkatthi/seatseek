# 🚆 SeatSeek Full-Stack

SeatSeek has been refactored into a scalable full-stack architecture. The project is divided into a React frontend and an Express backend.

## 📂 Project Structure

```
seatseek/
├── client/   # React + Vite frontend
└── server/   # Node.js + Express backend
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)

### Installation

1. **Clone and enter the directory:**
   ```bash
   git clone https://github.com/maneshkatthi/seatseek.git
   cd seatseek
   ```

2. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

### Configuration

1. **Backend Setup:**
   Create a `server/.env` file and add your RapidAPI keys:
   ```env
   PORT=5000
   RAPIDAPI_KEYS=key1,key2,key3
   RAPIDAPI_HOST=indian-railway-irctc.p.rapidapi.com
   ```

2. **Frontend Setup:**
   Create a `client/.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the App

Run both frontend and backend simultaneously:
```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios.
- **Backend:** Node.js, Express, Axios, Dotenv, CORS, Morgan.

## 🔮 Roadmap
- ESP32 IoT Sensor integration.
- Supabase/Firebase for user profiles.
- GPS live tracking modules.
