import fs from 'fs';

let serverTs = fs.readFileSync('server.ts', 'utf-8');

const endpoints = ['banners', 'pages', 'blogs', 'categories'];
for (const ep of endpoints) {
  // Replace POST
  const postRegex = new RegExp(`app\\.post\\("\\/api\\/${ep}", async \\(req, res\\) => \\{[\\s\\S]*?res\\.status\\(201\\)\\.json\\([a-zA-Z0-9]+\\);\\s*\\}\\);`);
  serverTs = serverTs.replace(postRegex, `app.post("/api/${ep}", async (req, res) => {
    try {
      const newItem = { ...req.body, id: req.body.id || Date.now().toString(), lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, '${ep}', String(newItem.id)), newItem);
      res.status(201).json(newItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });`);

  // Replace PUT
  const putRegex = new RegExp(`app\\.put\\("\\/api\\/${ep}\\/:id", async \\(req, res\\) => \\{[\\s\\S]*?res\\.status\\(404\\)\\.json\\(\\{ error: "Not found" \\}\\);\\s*\\}\\s*\\}\\);`);
  serverTs = serverTs.replace(putRegex, `app.put("/api/${ep}/:id", async (req, res) => {
    try {
      const updatedItem = { ...req.body, lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, '${ep}', req.params.id), updatedItem, { merge: true });
      res.json(updatedItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });`);
}

fs.writeFileSync('server.ts', serverTs);
