import fs from 'fs/promises';

async function patchServer() {
  const file = 'server.ts';
  let content = await fs.readFile(file, 'utf8');

  const apiCode = `
  // Newsletter API
  app.get("/api/newsletters", async (req, res) => {
    let subs = (await readData("newsletters.json", [])) as any[];
    res.json(subs);
  });

  app.post("/api/newsletters", async (req, res) => {
    let subs = (await readData("newsletters.json", [])) as any[];
    const { email } = req.body;
    
    // Check if exists
    let existing = subs.find(s => s.email === email);
    if (existing) {
       existing.status = 'Active';
       existing.subscribedAt = new Date().toISOString();
    } else {
      const newItem = { 
        id: Date.now().toString(),
        email, 
        status: 'Active',
        subscribedAt: new Date().toISOString() 
      };
      subs.push(newItem);
    }
    
    await writeData("newsletters.json", subs);
    res.status(201).json({ success: true });
  });

  app.put("/api/newsletters/:id", async (req, res) => {
    let subs = (await readData("newsletters.json", [])) as any[];
    const index = subs.findIndex((s: any) => s.id === req.params.id);
    if (index !== -1) {
      subs[index] = { ...subs[index], ...req.body };
      await writeData("newsletters.json", subs);
      res.json(subs[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/newsletters/:id", async (req, res) => {
    try {
      await deleteDoc(doc(db, "newsletters", req.params.id));
      res.json({ success: true });
    } catch (e) {
      // Fallback for json file mode
      let subs = (await readData("newsletters.json", [])) as any[];
      const filtered = subs.filter((s: any) => s.id !== req.params.id);
      await writeData("newsletters.json", filtered);
      res.json({ success: true });
    }
  });
`;

  if (!content.includes('/api/newsletters')) {
    content = content.replace('// Services API', apiCode + '\n  // Services API');
    await fs.writeFile(file, content, 'utf8');
    console.log("Patched server.ts");
  } else {
    console.log("Already patched");
  }
}
patchServer();
