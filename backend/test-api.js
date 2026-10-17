const http = require("http");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data.substring(0, 200) });
        }
      });
    }).on("error", reject);
  });
}

async function runTests() {
  console.log("=== CINEPULSE END-TO-END API VERIFICATION ===");

  const endpoints = [
    "http://localhost:5000/health",
    "http://localhost:5000/api/news",
    "http://localhost:5000/api/news/latest",
    "http://localhost:5000/api/news/featured",
    "http://localhost:5000/api/news/trending",
    "http://localhost:5000/api/news/category/movies",
    "http://localhost:5000/api/news/category/anime",
    "http://localhost:5000/api/news/category/k-drama",
    "http://localhost:5000/api/news/category/web-series",
    "http://localhost:5000/api/news/search?q=Dune",
    "http://localhost:5000/api/news/slug/dune-messiah-fast-tracks-production-with-denis-villeneuve-cinepulse",
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetchJson(ep);
      const isOk = res.status === 200 && (res.data?.success !== false);
      const count = Array.isArray(res.data?.data) ? res.data.data.length : (res.data?.data ? 1 : 0);
      const corsHeader = res.headers["access-control-allow-origin"];
      console.log(`[TEST] ${ep}`);
      console.log(`  └─ Status: ${res.status} | Success: ${isOk} | Items: ${count} | CORS: ${corsHeader || "None"}`);
    } catch (err) {
      console.error(`[FAIL] ${ep}: ${err.message}`);
    }
  }
}

runTests();
