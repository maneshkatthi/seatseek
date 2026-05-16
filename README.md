# 🚆 SeatSeek - Train Intelligence Platform

SeatSeek is a production-ready train intelligence platform that provides real-time train running status, route tracking, and coach-wise crowd density visualization. Designed for scalability, it leverages IoT sensor data and AI-based predictions to help passengers board smarter.


## 🌟 Key Features

- **Live Train Status**: Real-time tracking with station-by-station updates.
- **Coach-wise Crowd Density**: Visual representation of occupancy levels (Low, Medium, High).
- **IoT Ready**: Scalable architecture for GPS and ESP32 sensor integration.
- **Modern UI**: Dark futuristic theme with smooth Framer Motion animations.
- **Caching Layer**: Optimized performance using `node-cache`.
- **Production-Ready**: Modular backend, centralized error handling, and robust data services.

## 🛠️ Tech Stack

### Frontend
- **React + Vite**: High-performance frontend framework.
- **TailwindCSS**: Premium utility-first styling.
- **Framer Motion**: Smooth, high-fidelity animations.
- **Lucide React**: Beautiful icons.
- **Axios**: Robust API communication.

### Backend
- **Node.js + Express**: Scalable server-side logic.
- **Supabase (PostgreSQL)**: Scalable database and authentication.
- **Node-Cache**: High-speed in-memory data caching.
- **Cheerio/Axios**: Robust data scraping and API aggregation.

## 📁 Project Structure

```text
seatseek/
 ├── client/           # React frontend
 │    ├── src/
 │    │    ├── components/
 │    │    ├── pages/
 │    │    ├── services/
 │    │    └── data/
 └── server/           # Node.js backend
      ├── routes/
      ├── controllers/
      ├── services/
      ├── middleware/
      ├── database/
      └── cache/
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase Account

### Setup Instructions

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd server
   npm install
   cp .env.example .env # Add your Supabase & RapidAPI keys
   npm run dev
   ```
3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📖 Documentation

- [Setup Guide](docs/setup_guide.md)
- [API Documentation](docs/api_docs.md)
- [Supabase Configuration](docs/supabase_setup.md)
- [Deployment Guide](docs/deployment_guide.md)

## 🔮 Future Roadmap

- **IoT Integration**: Direct ingestion of GPS/IR data from ESP32 modules.
- **AI Predictions**: Machine learning models for predicting coach density based on historical data.
- **WebSockets**: Real-time push updates for live train positions.
- **Mobile App**: Native experience for on-the-go tracking.

---

Built with ❤️ by Team Orbit.
