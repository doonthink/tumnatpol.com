import fs from 'fs';

let serverTs = fs.readFileSync('server.ts', 'utf-8');

// Replace createCrud delete
serverTs = serverTs.replace(
  /app\.delete\("\/api\/" \+ resource \+ "\/:id", async \(req, res\) => \{[\s\S]*?\}\);/g,
  `app.delete("/api/" + resource + "/:id", async (req, res) => {
      try {
        await deleteDoc(doc(db, resource, req.params.id));
        res.json({ success: true });
      } catch (e) {
        console.error("Delete error:", e);
        res.status(500).json({ error: "Failed to delete" });
      }
    });`
);

// We need to also patch custom deletes
serverTs = serverTs.replace(
  /app\.delete\("\/api\/media\/:id", async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: "Failed to delete media" \}\);\n    \}\n  \}\);/g,
  `app.delete("/api/media/:id", async (req, res) => {
    try {
      const docSnap = await getDoc(doc(db, "media", req.params.id));
      if (docSnap.exists()) {
        const item = docSnap.data();
        if (item.url && item.url.startsWith("/uploads/")) {
          const filePath = path.join(dataDir, item.url.replace("/uploads/", "uploads/"));
          try { await fs.unlink(filePath); } catch (e) { console.error("Error deleting media file", e); }
        }
        await deleteDoc(doc(db, "media", req.params.id));
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete media" });
    }
  });`
);

serverTs = serverTs.replace(
  /app\.delete\("\/api\/videos\/:id", async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: "Internal server error" \}\);\n    \}\n  \}\);/g,
  `app.delete("/api/videos/:id", async (req, res) => {
    try {
      const docSnap = await getDoc(doc(db, "videos", req.params.id));
      if (docSnap.exists()) {
        const video = docSnap.data();
        if (video.videoFile && video.videoFile.startsWith("/uploads/")) {
          const filePath = path.join(dataDir, video.videoFile.replace("/uploads/", "uploads/"));
          try { await fs.unlink(filePath); } catch (e) { console.error("Error deleting video file", e); }
        }
        if (video.thumbnail && video.thumbnail.startsWith("/uploads/")) {
          const filePath = path.join(dataDir, video.thumbnail.replace("/uploads/", "uploads/"));
          try { await fs.unlink(filePath); } catch (e) { console.error("Error deleting thumbnail file", e); }
        }
        await deleteDoc(doc(db, "videos", req.params.id));
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });`
);

// We need to also patch the DELETE inside app.delete("/api/members/:id") which is defined separately if any? 
// Wait, is there a custom app.delete("/api/members/:id") ? I should check.

fs.writeFileSync('server.ts', serverTs);
