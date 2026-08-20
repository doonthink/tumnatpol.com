import fs from 'fs';

let serverTs = fs.readFileSync('server.ts', 'utf-8');

const endpoints = ['banners', 'pages', 'blogs', 'categories'];
for (const ep of endpoints) {
  const regex = new RegExp(`app\\.delete\\("\\/api\\/${ep}\\/:id", async \\(req, res\\) => \\{[\\s\\S]*?res\\.json\\(\\{ success: true \\}\\);\\s*\\}\\s*\\}\\);`);
  serverTs = serverTs.replace(regex, `app.delete("/api/${ep}/:id", async (req, res) => {
    try {
      await deleteDoc(doc(db, '${ep}', req.params.id));
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to delete" });
    }
  });`);
}

// backups don't use Firestore, they use zip files and dataDir. Wait, backups use file system, let's look at backups.

fs.writeFileSync('server.ts', serverTs);
