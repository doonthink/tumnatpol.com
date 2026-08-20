import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const bannersApi = `
  // Banners API
  app.get("/api/banners", async (req, res) => {
    const banners = await readData("banners.json");
    res.json(banners);
  });

  app.get("/api/banners/:id", async (req, res) => {
    const banners = await readData("banners.json");
    const banner = banners.find((b: any) => b.id === req.params.id);
    if (banner) res.json(banner);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/banners", async (req, res) => {
    const banners = await readData("banners.json");
    const newBanner = { ...req.body, id: Date.now().toString(), lastUpdated: new Date().toISOString() };
    banners.push(newBanner);
    await writeData("banners.json", banners);
    res.status(201).json(newBanner);
  });

  app.put("/api/banners/:id", async (req, res) => {
    const banners = await readData("banners.json");
    const index = banners.findIndex((b: any) => b.id === req.params.id);
    if (index !== -1) {
      banners[index] = { ...banners[index], ...req.body, lastUpdated: new Date().toISOString() };
      await writeData("banners.json", banners);
      res.json(banners[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/banners/:id", async (req, res) => {
    const banners = await readData("banners.json");
    const filtered = banners.filter((b: any) => b.id !== req.params.id);
    await writeData("banners.json", filtered);
    res.json({ success: true });
  });

`;

content = content.replace('  // Pages API', bannersApi + '  // Pages API');

fs.writeFileSync('server.ts', content);
