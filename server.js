const http = require("node:http");
const crypto = require("node:crypto");

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.AQI_API_KEY;

let latestReading = null;

const server = http.createServer((req, res) => {
  // Allow browser dashboards to read the API.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/health" && req.method === "GET") {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // Public endpoint for reading the latest AQI value.
  if (url.pathname === "/api/aqi" && req.method === "GET") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      success: true,
      data: latestReading
    }));
  }

  // All other API paths are not supported.
  if (url.pathname !== "/api/aqi") {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: "Not found" }));
  }

  if (req.method !== "POST") {
    res.writeHead(405);
    return res.end(JSON.stringify({ error: "Use POST to update data" }));
  }

  if (!API_KEY) {
    res.writeHead(503);
    return res.end(JSON.stringify({ error: "API key not configured" }));
  }

  // Protect updates with a bearer token.
  const auth = req.headers.authorization || "";
  const suppliedKey = auth.startsWith("Bearer ")
    ? auth.slice(7)
    : "";

  const a = Buffer.from(suppliedKey);
  const b = Buffer.from(API_KEY);

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    res.writeHead(401);
    return res.end(JSON.stringify({ error: "Invalid API key" }));
  }

  let body = "";
  let tooLarge = false;

  req.on("data", chunk => {
    body += chunk;
    if (Buffer.byteLength(body) > 10000) {
      tooLarge = true;
      res.writeHead(413);
      res.end(JSON.stringify({ error: "Request too large" }));
      req.destroy();
    }
  });

  req.on("end", () => {
    if (tooLarge || res.writableEnded) return;

    let reading;

    try {
      reading = JSON.parse(body);
    } catch {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Invalid JSON" }));
    }

    if (!reading || typeof reading !== "object" ||
        Array.isArray(reading)) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Expected a JSON object" }));
    }

    const numericFields = [
      "aqi", "pm25", "pm10", "temperature", "humidity"
    ];

    for (const field of numericFields) {
      if (reading[field] !== undefined &&
          (typeof reading[field] !== "number" ||
           !Number.isFinite(reading[field]))) {
        res.writeHead(400);
        return res.end(JSON.stringify({
          error: `${field} must be a valid number`
        }));
      }
    }

    if (reading.aqi === undefined) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "aqi is required" }));
    }

    if (reading.aqi < 0 || reading.aqi > 1000 ||
        (reading.pm25 !== undefined && reading.pm25 < 0) ||
        (reading.pm10 !== undefined && reading.pm10 < 0) ||
        (reading.humidity !== undefined &&
          (reading.humidity < 0 || reading.humidity > 100))) {
      res.writeHead(400);
      return res.end(JSON.stringify({
        error: "A reading is outside its permitted range"
      }));
    }

    latestReading = {
      device_id: String(reading.device_id || "AQI001").slice(0, 100),
      aqi: reading.aqi,
      ...(reading.pm25 !== undefined && { pm25: reading.pm25 }),
      ...(reading.pm10 !== undefined && { pm10: reading.pm10 }),
      ...(reading.temperature !== undefined &&
        { temperature: reading.temperature }),
      ...(reading.humidity !== undefined &&
        { humidity: reading.humidity }),
      timestamp: new Date().toISOString()
    };

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: "AQI reading updated",
      data: latestReading
    }));
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`AQI API listening on port ${PORT}`);
});
