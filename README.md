# 🚆 SeatSeek

**Futuristic Railway Crowd Intelligence Dashboard**

SeatSeek is a high-fidelity, cyberpunk-inspired web application designed to solve a common commuter problem: finding the least crowded train coach before boarding. Built with a sleek "Tesla-meets-Linear" dark mode aesthetic, SeatSeek provides passengers with real-time crowd density visualization, smart boarding recommendations, and live train tracking.

**Powered by ReView AI Tech and Solutions | Team Orbit**

---

## 🌟 Key Features

*   **Live Train Tracking:** Monitor the live location, delay times, and route progression of your train via an interactive vertical timeline.
*   **Coach Density Visualization:** A horizontal, scrollable, glowing train visualizer that displays real-time capacity levels for each coach using color-coded indicators (Green = Low, Red = High).
*   **Smart Boarding Recommendations:** The system automatically flags coaches that are under 40% capacity, guiding passengers to the most comfortable seating.
*   **Premium Cyberpunk Aesthetic:** Built with a deep navy palette (`#0a0e1a`), neon blue accents, glassmorphism cards (backdrop blurs), and fluid micro-animations.
*   **Responsive Design:** Fully optimized for both desktop browsers and mobile devices.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (Custom utility classes and grid patterns)
*   **Animations:** Framer Motion (Page transitions, hover effects, interactive visualizations)
*   **Routing:** React Router v6 (`react-router-dom`)
*   **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maneshkatthi/seatseek.git
   cd seatseek
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:5173` (or the port provided in your terminal).

## 📂 Project Structure

*   `/src/pages` - Contains the main routing views (`HomePage`, `SearchPage`, `TrainDashboardPage`, `AboutPage`).
*   `/src/components` - Reusable UI components (`Navbar`, `Footer`).
*   `/src/data` - Contains `mockData.js`, simulating real-time IoT sensor data from onboard ESP32 units.
*   `/public` - Static assets including the custom `seatseek-logo.png` and `review-logo.png`.

## 🔮 Future Enhancements (Roadmap)
*   **Real-time Backend Integration:** Replace mock data with live WebSocket streams from physical ESP32 IoT sensors via Supabase.
*   **User Authentication:** Allow users to save their favorite routes and set crowd-density alarms.
*   **Push Notifications:** Send alerts to users when their train is arriving or when coach density rapidly changes.

## 👥 Credits
Developed by **Team Orbit** under the guidance of **ReView AI Tech and Solutions**.
