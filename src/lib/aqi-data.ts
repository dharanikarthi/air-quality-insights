export type AqiCategory = "good" | "fair" | "moderate" | "poor" | "severe";

export interface Pollutant {
  key: string;
  label: string;
  unit: string;
  value: number;
  limit: number; // guideline value for the bar scale
}

export interface CityAqi {
  city: string;
  region: string;
  aqi: number;
  category: AqiCategory;
  dominant: string;
  updatedAt: string;
  temperature: number;
  humidity: number;
  wind: number;
  advisory: { title: string; body: string };
  pollutants: Pollutant[];
  hourly: { hour: string; aqi: number }[];
}

export const categoryMeta: Record<
  AqiCategory,
  { label: string; token: string; dimToken: string }
> = {
  good: { label: "Good", token: "text-good", dimToken: "bg-good-dim" },
  fair: { label: "Fair", token: "text-fair", dimToken: "bg-fair-dim" },
  moderate: { label: "Moderate", token: "text-moderate", dimToken: "bg-moderate-dim" },
  poor: { label: "Poor", token: "text-poor", dimToken: "bg-poor-dim" },
  severe: { label: "Severe", token: "text-severe", dimToken: "bg-severe-dim" },
};

export function aqiToCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "fair";
  if (aqi <= 200) return "moderate";
  if (aqi <= 300) return "poor";
  return "severe";
}

export const cities: CityAqi[] = [
  {
    city: "Delhi",
    region: "National Capital Territory",
    aqi: 284,
    category: "severe",
    dominant: "PM2.5",
    updatedAt: "Updated 8 min ago",
    temperature: 24,
    humidity: 58,
    wind: 6,
    advisory: {
      title: "Limit outdoor activity",
      body: "Air is hazardous for everyone. Wear an N95 mask outside, run air purifiers indoors, and keep windows closed until evening.",
    },
    pollutants: [
      { key: "pm25", label: "PM2.5", unit: "µg/m³", value: 186, limit: 250 },
      { key: "pm10", label: "PM10", unit: "µg/m³", value: 312, limit: 400 },
      { key: "o3", label: "Ozone", unit: "µg/m³", value: 64, limit: 180 },
      { key: "no2", label: "NO₂", unit: "µg/m³", value: 92, limit: 200 },
      { key: "so2", label: "SO₂", unit: "µg/m³", value: 38, limit: 180 },
      { key: "co", label: "CO", unit: "mg/m³", value: 1.8, limit: 4 },
    ],
    hourly: [
      { hour: "00", aqi: 262 },
      { hour: "02", aqi: 275 },
      { hour: "04", aqi: 288 },
      { hour: "06", aqi: 301 },
      { hour: "08", aqi: 284 },
      { hour: "10", aqi: 258 },
      { hour: "12", aqi: 234 },
      { hour: "14", aqi: 222 },
      { hour: "16", aqi: 238 },
      { hour: "18", aqi: 261 },
      { hour: "20", aqi: 276 },
      { hour: "22", aqi: 281 },
    ],
  },
  {
    city: "Mumbai",
    region: "Maharashtra",
    aqi: 156,
    category: "moderate",
    dominant: "PM10",
    updatedAt: "Updated 5 min ago",
    temperature: 29,
    humidity: 71,
    wind: 14,
    advisory: {
      title: "Sensitive groups take care",
      body: "Long outdoor exertion may cause irritation for children, the elderly, and people with asthma. Breaks indoors are enough for most.",
    },
    pollutants: [
      { key: "pm25", label: "PM2.5", unit: "µg/m³", value: 74, limit: 250 },
      { key: "pm10", label: "PM10", unit: "µg/m³", value: 168, limit: 400 },
      { key: "o3", label: "Ozone", unit: "µg/m³", value: 58, limit: 180 },
      { key: "no2", label: "NO₂", unit: "µg/m³", value: 61, limit: 200 },
      { key: "so2", label: "SO₂", unit: "µg/m³", value: 22, limit: 180 },
      { key: "co", label: "CO", unit: "mg/m³", value: 0.9, limit: 4 },
    ],
    hourly: [
      { hour: "00", aqi: 148 },
      { hour: "02", aqi: 152 },
      { hour: "04", aqi: 161 },
      { hour: "06", aqi: 170 },
      { hour: "08", aqi: 158 },
      { hour: "10", aqi: 141 },
      { hour: "12", aqi: 129 },
      { hour: "14", aqi: 122 },
      { hour: "16", aqi: 131 },
      { hour: "18", aqi: 145 },
      { hour: "20", aqi: 153 },
      { hour: "22", aqi: 149 },
    ],
  },
  {
    city: "Bengaluru",
    region: "Karnataka",
    aqi: 72,
    category: "fair",
    dominant: "PM2.5",
    updatedAt: "Updated 3 min ago",
    temperature: 27,
    humidity: 66,
    wind: 11,
    advisory: {
      title: "Enjoy your day",
      body: "Air quality is acceptable. Outdoor walks and exercise are fine, though very sensitive people may notice mild haze near traffic.",
    },
    pollutants: [
      { key: "pm25", label: "PM2.5", unit: "µg/m³", value: 32, limit: 250 },
      { key: "pm10", label: "PM10", unit: "µg/m³", value: 78, limit: 400 },
      { key: "o3", label: "Ozone", unit: "µg/m³", value: 44, limit: 180 },
      { key: "no2", label: "NO₂", unit: "µg/m³", value: 28, limit: 200 },
      { key: "so2", label: "SO₂", unit: "µg/m³", value: 12, limit: 180 },
      { key: "co", label: "CO", unit: "mg/m³", value: 0.5, limit: 4 },
    ],
    hourly: [
      { hour: "00", aqi: 68 },
      { hour: "02", aqi: 71 },
      { hour: "04", aqi: 76 },
      { hour: "06", aqi: 82 },
      { hour: "08", aqi: 75 },
      { hour: "10", aqi: 66 },
      { hour: "12", aqi: 58 },
      { hour: "14", aqi: 54 },
      { hour: "16", aqi: 61 },
      { hour: "18", aqi: 69 },
      { hour: "20", aqi: 74 },
      { hour: "22", aqi: 71 },
    ],
  },
  {
    city: "Kolkata",
    region: "West Bengal",
    aqi: 194,
    category: "moderate",
    dominant: "PM2.5",
    updatedAt: "Updated 6 min ago",
    temperature: 30,
    humidity: 76,
    wind: 9,
    advisory: {
      title: "Reduce prolonged exertion",
      body: "Air is unhealthy on long exposure. Shift runs to early morning, keep children indoors after school, and wear a mask on busy roads.",
    },
    pollutants: [
      { key: "pm25", label: "PM2.5", unit: "µg/m³", value: 118, limit: 250 },
      { key: "pm10", label: "PM10", unit: "µg/m³", value: 206, limit: 400 },
      { key: "o3", label: "Ozone", unit: "µg/m³", value: 71, limit: 180 },
      { key: "no2", label: "NO₂", unit: "µg/m³", value: 74, limit: 200 },
      { key: "so2", label: "SO₂", unit: "µg/m³", value: 26, limit: 180 },
      { key: "co", label: "CO", unit: "mg/m³", value: 1.2, limit: 4 },
    ],
    hourly: [
      { hour: "00", aqi: 182 },
      { hour: "02", aqi: 190 },
      { hour: "04", aqi: 201 },
      { hour: "06", aqi: 212 },
      { hour: "08", aqi: 196 },
      { hour: "10", aqi: 178 },
      { hour: "12", aqi: 162 },
      { hour: "14", aqi: 155 },
      { hour: "16", aqi: 168 },
      { hour: "18", aqi: 186 },
      { hour: "20", aqi: 197 },
      { hour: "22", aqi: 201 },
    ],
  },
  {
    city: "Chennai",
    region: "Tamil Nadu",
    aqi: 98,
    category: "fair",
    dominant: "PM10",
    updatedAt: "Updated 11 min ago",
    temperature: 31,
    humidity: 69,
    wind: 16,
    advisory: {
      title: "Clear with a watchful eye",
      body: "Conditions are broadly fine. Coastal breeze is keeping pollutants down; recheck levels if you plan evening exercise near highways.",
    },
    pollutants: [
      { key: "pm25", label: "PM2.5", unit: "µg/m³", value: 46, limit: 250 },
      { key: "pm10", label: "PM10", unit: "µg/m³", value: 96, limit: 400 },
      { key: "o3", label: "Ozone", unit: "µg/m³", value: 52, limit: 180 },
      { key: "no2", label: "NO₂", unit: "µg/m³", value: 33, limit: 200 },
      { key: "so2", label: "SO₂", unit: "µg/m³", value: 15, limit: 180 },
      { key: "co", label: "CO", unit: "mg/m³", value: 0.7, limit: 4 },
    ],
    hourly: [
      { hour: "00", aqi: 92 },
      { hour: "02", aqi: 95 },
      { hour: "04", aqi: 101 },
      { hour: "06", aqi: 108 },
      { hour: "08", aqi: 99 },
      { hour: "10", aqi: 88 },
      { hour: "12", aqi: 79 },
      { hour: "14", aqi: 74 },
      { hour: "16", aqi: 81 },
      { hour: "18", aqi: 91 },
      { hour: "20", aqi: 97 },
      { hour: "22", aqi: 94 },
    ],
  },
];
