import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const recaptchaEndpoint = `
  app.post("/api/verify-recaptcha", async (req, res) => {
    try {
      const { token } = req.body;
      const secretKey = process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; // Google's provided test secret
      
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: \`secret=\${secretKey}&response=\${token}\`
      });
      
      const data = await response.json();
      // For v3, score >= 0.5 is generally considered a human
      if (data.success && data.score >= 0.5) {
        res.json({ success: true, score: data.score });
      } else {
        res.status(403).json({ error: "Bot detected (reCAPTCHA score too low)", details: data });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to verify reCAPTCHA" });
    }
  });
`;

// Insert it right after the health check
content = content.replace(
  /app\.get\("\/api\/health", \(req, res\) => \{\n    res\.json\(\{ status: "ok" \}\);\n  \}\);/,
  `app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
${recaptchaEndpoint}`
);

fs.writeFileSync('server.ts', content);
