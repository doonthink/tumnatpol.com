import fs from 'fs';

let serverTs = fs.readFileSync('server.ts', 'utf-8');

serverTs = serverTs.replace(
  /const createCrud = \(resource: string\) => \{[\s\S]*?app\.delete\("\/api\/" \+ resource \+ "\/:id"/,
  `const createCrud = (resource: string) => {
    app.get("/api/" + resource, async (req, res) => {
      const data = await readData(resource + ".json");
      res.json(data);
    });

    app.post("/api/" + resource, async (req, res) => {
      try {
        if (singletons.includes(resource)) {
          await setDoc(doc(db, 'singletons', resource), req.body, { merge: true });
          res.status(201).json(req.body);
        } else {
          const newItem = { ...req.body, id: req.body.id || Date.now().toString() };
          await setDoc(doc(db, resource, String(newItem.id)), newItem);
          res.status(201).json(newItem);
        }
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    app.get("/api/" + resource + "/:id", async (req, res) => {
      try {
        if (singletons.includes(resource)) {
          const docSnap = await getDoc(doc(db, 'singletons', resource));
          res.json(docSnap.exists() ? docSnap.data() : {});
        } else {
          const docSnap = await getDoc(doc(db, resource, req.params.id));
          if (docSnap.exists()) {
            res.json(docSnap.data());
          } else {
            res.status(404).json({ error: "Not found" });
          }
        }
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    app.put("/api/" + resource + "/:id", async (req, res) => {
      try {
        if (singletons.includes(resource)) {
          await setDoc(doc(db, 'singletons', resource), req.body, { merge: true });
          res.json(req.body);
        } else {
          await setDoc(doc(db, resource, req.params.id), req.body, { merge: true });
          res.json(req.body);
        }
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    app.delete("/api/" + resource + "/:id"`
);

fs.writeFileSync('server.ts', serverTs);
