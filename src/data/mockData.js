// ===================== MOCK DATA =====================

export const STATIONS = [
  { code: 'GLA', name: 'Garla' },
  { code: 'KMT', name: 'Khammam' },
  { code: 'WL', name: 'Warangal' },
  { code: 'HYB', name: 'Hyderabad' },
  { code: 'BZA', name: 'Vijayawada' },
  { code: 'SC', name: 'Secunderabad' },
  { code: 'DKAE', name: 'Dornakal Junction' },
  { code: 'BNK', name: 'Bona Kalu' },
  { code: 'CLX', name: 'Chirala' },
  { code: 'MMCT', name: 'Mumbai Central' },
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'PUNE', name: 'Pune Junction' },
  { code: 'NGP', name: 'Nagpur' },
  { code: 'BSP', name: 'Bilaspur' },
  { code: 'MAS', name: 'Chennai Central' },
  { code: 'SBC', name: 'Bengaluru City' },
  { code: "OEA", name: "Odela" },
];

export const TRAINS = [
  {
    trainNo: '17406',
    name: 'Krishna Express',
    from: 'GLA',
    fromName: 'Garla',
    to: 'KMT',
    toName: 'Khammam',
    departure: '06:20',
    arrival: '09:45',
    duration: '3h 25m',
    platform: '2',
    delay: 15,
    lastStation: 'Dornakal Junction',
    type: 'Express',
  },
  {
    trainNo: '17033',
    name: 'Singareni Passenger',
    from: 'GLA',
    fromName: 'Garla',
    to: 'OEA',
    toName: 'Odela',
    departure: '09:15',
    arrival: '13:30',
    duration: '4h 15m',
    platform: '1',
    delay: 10,
    lastStation: 'Garla',
    type: 'Passenger',
  },
  {
    trainNo: '17202',
    name: 'Golconda Express',
    from: 'GLA',
    fromName: 'Garla',
    to: 'KMT',
    toName: 'Khammam',
    departure: '08:10',
    arrival: '11:30',
    duration: '3h 20m',
    platform: '1',
    delay: 0,
    lastStation: 'Bona Kalu',
    type: 'Express',
  },
  {
    trainNo: '12951',
    name: 'Mumbai Rajdhani Express',
    from: 'MMCT',
    fromName: 'Mumbai Central',
    to: 'NDLS',
    toName: 'New Delhi',
    departure: '17:00',
    arrival: '08:35',
    duration: '15h 35m',
    platform: '3',
    delay: 5,
    lastStation: 'Nagpur',
    type: 'Rajdhani',
  },
];

export const COACH_DATA = {
  '17406': [
    { id: 'C1', name: '1A', percentage: 28, label: 'Low' },
    { id: 'C2', name: '2A', percentage: 35, label: 'Low' },
    { id: 'C3', name: '3A', percentage: 62, label: 'Moderate' },
    { id: 'C4', name: 'B2', percentage: 88, label: 'High' },
    { id: 'C5', name: 'B3', percentage: 112, label: 'Very High' },
    { id: 'C6', name: 'S1', percentage: 76, label: 'High' },
    { id: 'C7', name: 'S2', percentage: 40, label: 'Low' },
  ],
  '17033': [
    { id: 'C1', name: 'S1', percentage: 20, label: 'Low' },
    { id: 'C2', name: 'S2', percentage: 45, label: 'Moderate' },
    { id: 'C3', name: 'S3', percentage: 80, label: 'High' },
    { id: 'C4', name: 'S4', percentage: 110, label: 'Very High' },
    { id: 'C5', name: 'S5', percentage: 60, label: 'Moderate' },
    { id: 'C6', name: 'S6', percentage: 25, label: 'Low' },
  ],
  '17202': [
    { id: 'C1', name: '1A', percentage: 45, label: 'Moderate' },
    { id: 'C2', name: '2A', percentage: 58, label: 'Moderate' },
    { id: 'C3', name: '3A', percentage: 72, label: 'High' },
    { id: 'C4', name: 'B1', percentage: 31, label: 'Low' },
    { id: 'C5', name: 'B2', percentage: 95, label: 'High' },
    { id: 'C6', name: 'S1', percentage: 118, label: 'Very High' },
    { id: 'C7', name: 'S2', percentage: 55, label: 'Moderate' },
  ],
  '12951': [
    { id: 'C1', name: '1A', percentage: 28, label: 'Low' },
    { id: 'C2', name: '2A', percentage: 35, label: 'Low' },
    { id: 'C3', name: '3A', percentage: 62, label: 'Moderate' },
    { id: 'C4', name: 'B2', percentage: 88, label: 'High' },
    { id: 'C5', name: 'B3', percentage: 112, label: 'Very High' },
    { id: 'C6', name: 'S1', percentage: 76, label: 'High' },
    { id: 'C7', name: 'S2', percentage: 40, label: 'Low' },
  ],
};

export const TRACK_DATA = {
  '17406': {
    trainNo: '17406',
    name: 'Krishna Express',
    from: 'GLA',
    to: 'KMT',
    currentStation: 'Dornakal Junction',
    delay: 15,
    stops: [
      { station: 'Garla', code: 'GLA', scheduledArr: null, actualArr: null, scheduledDep: '06:20', actualDep: '06:22', distance: 0, platform: '2', status: 'departed' },
      { station: 'Bona Kalu', code: 'BNK', scheduledArr: '06:55', actualArr: '07:05', scheduledDep: '06:57', actualDep: '07:07', distance: 42, platform: '1', status: 'departed' },
      { station: 'Dornakal Junction', code: 'DKAE', scheduledArr: '07:38', actualArr: '07:53', scheduledDep: '07:40', actualDep: null, distance: 87, platform: '3', status: 'current' },
      { station: 'Khammam', code: 'KMT', scheduledArr: '09:45', actualArr: null, scheduledDep: null, actualDep: null, distance: 135, platform: '2', status: 'upcoming' },
    ],
  },
  '17033': {
    trainNo: '17033',
    name: 'Singareni Passenger',
    from: 'GLA',
    to: 'OEA',
    currentStation: 'Garla',
    delay: 10,
    stops: [
      { station: 'Garla', code: 'GLA', scheduledArr: null, actualArr: null, scheduledDep: '09:15', actualDep: '09:25', distance: 0, platform: '1', status: 'departed' },
      { station: 'Dornakal Junction', code: 'DKAE', scheduledArr: '09:40', actualArr: null, scheduledDep: '09:45', actualDep: null, distance: 87, platform: '3', status: 'upcoming' },
      { station: 'Warangal', code: 'WL', scheduledArr: '11:00', actualArr: null, scheduledDep: '11:05', actualDep: null, distance: 120, platform: '2', status: 'upcoming' },
      { station: 'Odela', code: 'OEA', scheduledArr: '13:30', actualArr: null, scheduledDep: null, actualDep: null, distance: 150, platform: '2', status: 'upcoming' },
    ],
  },
  '17202': {
    trainNo: '17202',
    name: 'Golconda Express',
    from: 'GLA',
    to: 'KMT',
    currentStation: 'Bona Kalu',
    delay: 0,
    stops: [
      { station: 'Garla', code: 'GLA', scheduledArr: null, actualArr: null, scheduledDep: '08:10', actualDep: '08:10', distance: 0, platform: '1', status: 'departed' },
      { station: 'Bona Kalu', code: 'BNK', scheduledArr: '08:48', actualArr: '08:48', scheduledDep: '08:50', actualDep: null, distance: 42, platform: '2', status: 'current' },
      { station: 'Dornakal Junction', code: 'DKAE', scheduledArr: '09:22', actualArr: null, scheduledDep: '09:25', actualDep: null, distance: 87, platform: '1', status: 'upcoming' },
      { station: 'Chirala', code: 'CLX', scheduledArr: '10:05', actualArr: null, scheduledDep: '10:07', actualDep: null, distance: 112, platform: '2', status: 'upcoming' },
      { station: 'Khammam', code: 'KMT', scheduledArr: '11:30', actualArr: null, scheduledDep: null, actualDep: null, distance: 135, platform: '1', status: 'upcoming' },
    ],
  },
  '12951': {
    trainNo: '12951',
    name: 'Mumbai Rajdhani Express',
    from: 'MMCT',
    to: 'NDLS',
    currentStation: 'Nagpur',
    delay: 5,
    stops: [
      { station: 'Mumbai Central', code: 'MMCT', scheduledArr: null, actualArr: null, scheduledDep: '17:00', actualDep: '17:00', distance: 0, platform: '3', status: 'departed' },
      { station: 'Pune Junction', code: 'PUNE', scheduledArr: '19:28', actualArr: '19:30', scheduledDep: '19:30', actualDep: '19:35', distance: 190, platform: '4', status: 'departed' },
      { station: 'Nagpur', code: 'NGP', scheduledArr: '23:50', actualArr: '23:55', scheduledDep: '00:05', actualDep: null, distance: 1089, platform: '5', status: 'current' },
      { station: 'Bilaspur', code: 'BSP', scheduledArr: '03:15', actualArr: null, scheduledDep: '03:20', actualDep: null, distance: 1421, platform: '2', status: 'upcoming' },
      { station: 'New Delhi', code: 'NDLS', scheduledArr: '08:35', actualArr: null, scheduledDep: null, actualDep: null, distance: 1384, platform: '9', status: 'upcoming' },
    ],
  },
};

export const getLabel = (percentage) => {
  if (percentage <= 40) return 'Low';
  if (percentage <= 70) return 'Moderate';
  if (percentage <= 100) return 'High';
  return 'Very High';
};

export const getLabelColor = (label) => {
  switch (label) {
    case 'Low': return 'text-green-400';
    case 'Moderate': return 'text-amber-400';
    case 'High': return 'text-orange-400';
    case 'Very High': return 'text-red-400';
    default: return 'text-blue-400';
  }
};

export const getLabelBg = (label) => {
  switch (label) {
    case 'Low': return 'bg-green-500/15 border-green-500/40 text-green-400';
    case 'Moderate': return 'bg-amber-500/15 border-amber-500/40 text-amber-400';
    case 'High': return 'bg-orange-500/15 border-orange-500/40 text-orange-400';
    case 'Very High': return 'bg-red-500/15 border-red-500/40 text-red-400';
    default: return 'bg-blue-500/15 border-blue-500/40 text-blue-400';
  }
};

export const getCoachGlowClass = (label) => {
  switch (label) {
    case 'Low': return 'coach-low';
    case 'Moderate': return 'coach-moderate';
    case 'High': return 'coach-high';
    case 'Very High': return 'coach-very-high';
    default: return 'coach-low';
  }
};

export const getBarColor = (label) => {
  switch (label) {
    case 'Low': return 'bg-green-500';
    case 'Moderate': return 'bg-amber-500';
    case 'High': return 'bg-orange-500';
    case 'Very High': return 'bg-red-500';
    default: return 'bg-blue-500';
  }
};
