const http = require("http");

http.get("http://localhost:3000", (res) => {
  let html = "";
  res.on("data", (chunk) => (html += chunk));
  res.on("end", () => {
    console.log("Status Code:", res.statusCode);
    const cssLinks = html.match(/<link[^>]+rel="stylesheet"[^>]*>/gi);
    console.log("CSS Links found in HTML:", cssLinks);
    
    // Extract CSS URL if present
    const hrefMatch = html.match(/href="(\/_next\/static\/css\/[^"]+)"/);
    if (hrefMatch) {
      console.log("Fetching CSS file:", hrefMatch[1]);
      http.get(`http://localhost:3000${hrefMatch[1]}`, (cssRes) => {
        let css = "";
        cssRes.on("data", (chunk) => (css += chunk));
        cssRes.on("end", () => {
          console.log("CSS Response Code:", cssRes.statusCode);
          console.log("CSS Bytes:", css.length);
          console.log("CSS Preview (first 200 chars):", css.substring(0, 200));
        });
      });
    } else {
      console.log("No CSS stylesheet link found in response HTML!");
    }
  });
}).on("error", (err) => console.error("Error connecting to frontend:", err.message));
