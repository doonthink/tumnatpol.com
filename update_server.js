const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const servicesApi = `

  // Service Categories API
  app.get("/api/service-categories", async (req, res) => {
    let cats = (await readData("service-categories.json")) as any[];
    res.json(cats);
  });

  app.get("/api/service-categories/:id", async (req, res) => {
    let cats = (await readData("service-categories.json")) as any[];
    const cat = cats.find((c: any) => c.id === req.params.id);
    if (cat) res.json(cat);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/service-categories", async (req, res) => {
    try {
      const newItem = { ...req.body, id: req.body.id || Date.now().toString(), lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, 'service-categories', String(newItem.id)), newItem);
      res.status(201).json(newItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/service-categories/:id", async (req, res) => {
    try {
      const updatedItem = { ...req.body, lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, 'service-categories', req.params.id), updatedItem, { merge: true });
      res.json(updatedItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/service-categories/:id", async (req, res) => {
    let cats = (await readData("service-categories.json")) as any[];
    const filtered = cats.filter((c: any) => c.id !== req.params.id);
    await writeData("service-categories.json", filtered);
    res.json({ success: true });
  });

  // Services API
  app.get("/api/services", async (req, res) => {
    let svcs = (await readData("services.json")) as any[];
    res.json(svcs);
  });

  app.get("/api/services/:id", async (req, res) => {
    let svcs = (await readData("services.json")) as any[];
    const svc = svcs.find((s: any) => s.id === req.params.id);
    if (svc) res.json(svc);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/services", async (req, res) => {
    try {
      const newItem = { ...req.body, id: req.body.id || Date.now().toString(), lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, 'services', String(newItem.id)), newItem);
      res.status(201).json(newItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    try {
      const updatedItem = { ...req.body, lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, 'services', req.params.id), updatedItem, { merge: true });
      res.json(updatedItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    let svcs = (await readData("services.json")) as any[];
    const filtered = svcs.filter((s: any) => s.id !== req.params.id);
    await writeData("services.json", filtered);
    res.json({ success: true });
  });

`;

content = content.replace('  // Pages API', servicesApi + '  // Pages API');
fs.writeFileSync('server.ts', content);
