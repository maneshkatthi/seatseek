# Deployment Guide

SeatSeek is optimized for zero-cost or low-cost deployment on modern cloud platforms.

## Frontend (Vercel)

1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add the environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://seatseek-api.onrender.com/api`).

## Backend (Render / Railway)

### Render
1. Create a new **Web Service**.
2. Connect your repository.
3. Set the build command to `npm install`.
4. Set the start command to `node index.js`.
5. Add all environment variables from `server/.env`.

### Railway
1. Create a new **Project**.
2. Connect your repository.
3. Railway will automatically detect the `package.json` and start the server.
4. Add environment variables in the **Variables** tab.

## Production Checklist

- [ ] Disable `morgan` logging in production (handled in `errorMiddleware.js`).
- [ ] Use a production-grade database (Supabase is fine).
- [ ] Configure CORS to only allow your frontend domain.
- [ ] Ensure `NODE_ENV=production` is set.
