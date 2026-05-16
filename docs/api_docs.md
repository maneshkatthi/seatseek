# API Documentation

The SeatSeek Backend API provides endpoints for train tracking, search, and crowd density.

## Base URL
`http://localhost:5000/api`

## Endpoints

### 1. Live Train Status
`GET /live/:trainNo`
- **Description**: Returns the real-time status of a train.
- **Response**:
  ```json
  {
    "trainNumber": "12723",
    "trainName": "Telangana Express",
    "currentStation": "New Delhi",
    "nextStation": "Agra Cantt",
    "delay": 10,
    "platform": 4,
    "eta": "16:45",
    "status": "Running",
    "lastUpdated": "2026-05-16T11:00:00Z"
  }
  ```

### 2. Train Route
`GET /route/:trainNo`
- **Description**: Returns the full list of stations and timings for a train.

### 3. Search Train
`GET /search/:trainNo`
- **Description**: Searches for a train by number.

### 4. Trains Between Stations
`GET /between/:from/:to`
- **Description**: Returns a list of trains running between two station codes.

### 5. Coach Crowd Density
`GET /density/:trainNo`
- **Description**: Returns simulated or real-time crowd levels for each coach.
- **Response**:
  ```json
  [
    { "coach": "D1", "density": "Low", "passengers": 34 },
    { "coach": "D2", "density": "Medium", "passengers": 61 },
    { "coach": "D3", "density": "High", "passengers": 97 }
  ]
  ```

## Error Handling
All errors follow this format:
```json
{
  "message": "Error description",
  "stack": "..." // Only in development
}
```
