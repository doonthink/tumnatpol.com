import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import AdmZip from "adm-zip";
import multer from "multer";

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(dataDir, "uploads");

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let folder = path.join(uploadsDir, "videos");
    if (file.mimetype.startsWith("image/")) {
      folder = path.join(uploadsDir, "thumbnails");
    }
    await fs.mkdir(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit for videos
});

// Helper function for default data
function getDefaultData(resource: string) {
  if (resource === 'media') {
    return [
      { id: '1', name: 'hero-banner.jpg', type: 'image', size: '2.4 MB', date: '2024-08-01', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80' },
      { id: '2', name: 'company-profile.pdf', type: 'document', size: '5.1 MB', date: '2024-07-28', url: '' }
    ];
  } else if (resource === 'members') {
    return [
      { id: '1', name: 'Somchai Jaidee', email: 'somchai@example.com', package: 'Premium', status: 'Active', login: '2 hours ago', joined: '2024-01-15' },
      { id: '2', name: 'Suda Raksa', email: 'suda@example.com', package: 'Basic', status: 'Active', login: 'Yesterday', joined: '2024-02-10' }
    ];
  } else if (resource === 'packages') {
    return [
      { id: '1', name: 'Basic', description: 'Perfect for beginners and small sites.', price: 500, duration: '1 Month', status: 'Active', isFeatured: false, users: 1240 },
      { id: '2', name: 'Premium', description: 'Most popular choice for growing businesses.', price: 2500, duration: '6 Months', status: 'Active', isFeatured: true, users: 4500 }
    ];
  } else if (resource === 'finance') {
     return [];
  } else if (resource === 'settings') {
     return { general: { siteName: 'BIZ Top Tier' } };
  } else if (resource === 'dashboard') {
     return { 
       stats: [
        { title: 'Total Members', value: '14,295', change: '+4.75%', trend: 'up', icon: 'Users', color: 'bg-blue-500' }
       ]
     };
  } else if (resource === 'analytics') {
     return {
       totalViews: 0,
       uniqueVisitors: 0,
       avgSession: "00:00",
       bounceRate: "0%",
       trafficData: [
         { name: 'Mon', views: 0, visitors: 0 },
         { name: 'Tue', views: 0, visitors: 0 },
         { name: 'Wed', views: 0, visitors: 0 },
         { name: 'Thu', views: 0, visitors: 0 },
         { name: 'Fri', views: 0, visitors: 0 },
         { name: 'Sat', views: 0, visitors: 0 },
         { name: 'Sun', views: 0, visitors: 0 }
       ],
       deviceData: [
         { name: 'Desktop', value: 0 },
         { name: 'Mobile', value: 0 },
         { name: 'Tablet', value: 0 }
       ],
       topPages: []
     };
  } else if (resource === 'videos') {
     return [];
  } else if (resource === 'videoCategories') {
     return [];
  } else if (resource === 'staff') {
     return [
       { id: '1', name: 'Super Admin', email: 'admin@biztoptier.com', phone: '+6620000000', role: 'Super Admin', permissions: { pages: true, blogs: true, categories: true, media: true, roles: true, settings: true } },
       { id: '2', name: 'Alltimage Support', email: 'support@alltimage.com', phone: '+66656699994', role: 'Admin Support', permissions: { pages: true, blogs: true, categories: true, media: true, roles: true, settings: false } },
       { id: '3', name: 'Mr. Staff', email: 'staff@dottshopping.com', phone: '0906481659', role: 'Admin Platform', permissions: { pages: true, blogs: true, categories: true, media: true, roles: true, settings: false } },
       { id: '4', name: 'thitiphon', email: 'thitiphon@alltimage.com', phone: '0820089912', role: 'Super Admin', permissions: { pages: true, blogs: true, categories: true, media: true, roles: true, settings: true } }
     ];
  }
  return [];
}

// Helper function to read data

const singletons = ['settings', 'dashboard', 'analytics'];

// Helper function to read data
async function readData(file) {
  const resourceName = file.replace('.json', '');
  try {
    if (singletons.includes(resourceName)) {
      const docSnap = await getDoc(doc(db, 'singletons', resourceName));
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } else {
      const querySnapshot = await getDocs(collection(db, resourceName));
      const data = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (data.length > 0) return data;
    }
    
    // Fallback to default data
    const defaultData = getDefaultData(resourceName);
    await writeData(file, defaultData);
    return defaultData;
  } catch (error) {
    console.error('Error reading from Firebase:', error);
    return getDefaultData(resourceName);
  }
}

// Helper function to write data
async function writeData(file, data) {
  const resourceName = file.replace('.json', '');
  try {
    if (singletons.includes(resourceName)) {
      await setDoc(doc(db, 'singletons', resourceName), data);
    } else {
      // For arrays, if writeData is called with an array, we must update the collection.
      // Because this is inefficient, we just iterate and setDoc each item.
      // (Any deleted items won't be removed here, but the CRUD delete endpoint handles true deletion)
      for (const item of data) {
        if (!item.id) continue;
        await setDoc(doc(db, resourceName, String(item.id)), item);
      }
    }
  } catch (error) {
    console.error('Error writing to Firebase:', error);
  }
}


async function startServer() {
  const app = express();
  // สำหรับรันใน AI Studio ต้องใช้ Port 3000 เสมอ
  // แต่บน VPS ของคุณสามารถแก้ไขเป็น process.env.PORT || 3000 ได้เลย
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Prevent caching for all API routes
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/verify-recaptcha", async (req, res) => {
    try {
      const { token } = req.body;
      const secretKey = process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; // Google's provided test secret
      
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`
      });
      
      const data = await response.json();
      // For v3, score >= 0.5 is generally considered a human. V2 test keys don't return score.
      if (data.success && (data.score === undefined || data.score >= 0.5)) {
        res.json({ success: true, score: data.score || 1.0 });
      } else {
        res.status(403).json({ error: "Bot detected (reCAPTCHA score too low)", details: data });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to verify reCAPTCHA" });
    }
  });


  // Business Check Form Submission API
  app.post("/api/business-check", async (req, res) => {
    try {
      const { companyName, industry, issues, contactName, email, phone, packageId } = req.body;
      
      // Basic validation
      if (!companyName || !industry || !issues || !contactName || !email || !phone || !packageId) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน กรุณากรอกข้อมูลให้ครบทุกช่อง" });
      }

      // Read required data files
      let members = await readData("members.json");
      if (!Array.isArray(members)) members = [];
      
      let packages = await readData("packages.json");
      if (!Array.isArray(packages)) packages = [];
      
      let orders = await readData("orders.json");
      if (!Array.isArray(orders)) orders = [];
      
      let businessChecks = await readData("businessChecks.json");
      if (!Array.isArray(businessChecks)) businessChecks = [];

      const selectedPackage = packages.find((p: any) => p.id === packageId);
      if (!selectedPackage) {
        return res.status(400).json({ error: "ไม่พบแพ็กเกจที่เลือกในระบบ" });
      }

      const now = new Date().toISOString();

      // 1. Process Member (upsert by email)
      let member = members.find((m: any) => m.email === email);
      if (member) {
        // Update existing member
        member.name = contactName;
        member.phone = phone;
        member.packageId = packageId;
      } else {
        // Create new member
        member = {
          id: Date.now().toString() + Math.random().toString().slice(2, 6),
          name: contactName,
          email: email,
          phone: phone,
          packageId: packageId,
          package: selectedPackage.name,
          status: 'Pending',
          joined: now.split('T')[0]
        };
        members.push(member);
      }
      await writeData("members.json", members);

      // 2. Process Business Check (upsert by member_id)
      let bCheck = businessChecks.find((bc: any) => bc.member_id === member.id);
      if (bCheck) {
        bCheck.companyName = companyName;
        bCheck.industry = industry;
        bCheck.issues = issues;
        bCheck.memberName = contactName;
        bCheck.memberEmail = email;
        bCheck.memberPhone = phone;
        bCheck.lastUpdated = now;
      } else {
        bCheck = {
          id: Date.now().toString() + Math.random().toString().slice(2, 6),
          member_id: member.id,
          memberName: contactName,
          memberEmail: email,
          memberPhone: phone,
          companyName: companyName,
          industry: industry,
          issues: issues,
          createdAt: now
        };
        businessChecks.push(bCheck);
      }
      await writeData("businessChecks.json", businessChecks);

      // 3. Process Order
      const newOrder = {
        id: Date.now().toString() + Math.random().toString().slice(2, 6),
        member_id: member.id,
        customer: contactName,
        package_id: packageId,
        package: selectedPackage.name,
        amount: selectedPackage.price,
        status: 'Paid', // Assuming Paid for dashboard
        date: now.split('T')[0],
        createdAt: now
      };
      orders.push(newOrder);
      await writeData("orders.json", orders);
      
      // Also add to finance for dashboard viewing
      let finance = await readData("finance.json");
      if (!Array.isArray(finance)) finance = [];
      finance.push({
        id: newOrder.id,
        customer: newOrder.customer,
        package: newOrder.package,
        amount: newOrder.amount,
        status: newOrder.status,
        date: newOrder.date
      });
      await writeData("finance.json", finance);

      // Also record activity log
      try {
        await recordActivityLog(
          "System", 
          `ลูกค้ารายใหม่ลงทะเบียน Business Check (${companyName})`, 
          "BusinessCheck", 
          req.ip || "171.97.102.45"
        );
      } catch (e) {
        console.error("Failed to log business check activity");
      }

      res.status(201).json({
        success: true,
        message: 'Business check and order created successfully',
        data: { member, businessCheck: bCheck, order: newOrder }
      });
    } catch (error: any) {
      console.error("Error in /api/business-check:", error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message });
    }
  });


  // Banners API
  app.get("/api/banners", async (req, res) => {
    let banners = (await readData("banners.json")) as any[];
    res.json(banners);
  });

  app.get("/api/banners/:id", async (req, res) => {
    let banners = (await readData("banners.json")) as any[];
    const banner = banners.find((b: any) => b.id === req.params.id);
    if (banner) res.json(banner);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/banners", async (req, res) => {
    try {
      const newItem = { ...req.body, id: req.body.id || Date.now().toString(), lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, 'banners', String(newItem.id)), newItem);
      res.status(201).json(newItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/banners/:id", async (req, res) => {
    try {
      const updatedItem = { ...req.body, lastUpdated: new Date().toISOString() };
      await setDoc(doc(db, 'banners', req.params.id), updatedItem, { merge: true });
      res.json(updatedItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/banners/:id", async (req, res) => {
    let banners = (await readData("banners.json")) as any[];
    const filtered = banners.filter((b: any) => b.id !== req.params.id);
    await writeData("banners.json", filtered);
    res.json({ success: true });
  });



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
    let cats = (await readData("service-categories.json")) as any[];
    const newItem = { ...req.body, id: Date.now().toString(), lastUpdated: new Date().toISOString() };
    cats.push(newItem);
    await writeData("service-categories.json", cats);
    res.status(201).json(newItem);
  });

  app.put("/api/service-categories/:id", async (req, res) => {
    let cats = (await readData("service-categories.json")) as any[];
    const index = cats.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      cats[index] = { ...cats[index], ...req.body, lastUpdated: new Date().toISOString() };
      await writeData("service-categories.json", cats);
      res.json(cats[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/service-categories/:id", async (req, res) => {
    try {
      await deleteDoc(doc(db, "service-categories", req.params.id));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  
  // Newsletter API
  app.get("/api/newsletters", async (req, res) => {
    let subs = (await readData("newsletters.json")) as any[];
    res.json(subs);
  });

  app.post("/api/newsletters", async (req, res) => {
    let subs = (await readData("newsletters.json")) as any[];
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
    let subs = (await readData("newsletters.json")) as any[];
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
      let subs = (await readData("newsletters.json")) as any[];
      const filtered = subs.filter((s: any) => s.id !== req.params.id);
      await writeData("newsletters.json", filtered);
      res.json({ success: true });
    }
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
    let svcs = (await readData("services.json")) as any[];
    const newItem = { ...req.body, id: Date.now().toString(), lastUpdated: new Date().toISOString() };
    svcs.push(newItem);
    await writeData("services.json", svcs);
    res.status(201).json(newItem);
  });

  app.put("/api/services/:id", async (req, res) => {
    let svcs = (await readData("services.json")) as any[];
    const index = svcs.findIndex((s: any) => s.id === req.params.id);
    if (index !== -1) {
      svcs[index] = { ...svcs[index], ...req.body, lastUpdated: new Date().toISOString() };
      await writeData("services.json", svcs);
      res.json(svcs[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      await deleteDoc(doc(db, "services", req.params.id));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Pages API
  app.get("/api/pages", async (req, res) => {
    let pages = (await readData("pages.json")) as any[];
    if (!Array.isArray(pages)) pages = [];
    
    // Ensure home page exists
    if (!pages.find((p: any) => p.slug === 'home')) {
      const homePage = {
        id: 'home-page-id',
        title: 'Home Page',
        title_en: 'Home Page',
        slug: 'home',
        status: 'Published',
        content: '',
        lastUpdated: new Date().toISOString()
      };
      pages.push(homePage);
      await writeData("pages.json", pages);
    }
    
    res.json(pages);
  });

  app.get("/api/pages/:id", async (req, res) => {
    let pages = (await readData("pages.json")) as any[];
    const page = pages.find((p: any) => p.id === req.params.id);
    if (page) res.json(page);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/pages", async (req, res) => {
    let pages = (await readData("pages.json")) as any[];
    const newItem = { ...req.body, id: Date.now().toString(), lastUpdated: new Date().toISOString() };
    pages.push(newItem);
    await writeData("pages.json", pages);
    res.status(201).json(newItem);
  });

  app.put("/api/pages/:id", async (req, res) => {
    let pages = (await readData("pages.json")) as any[];
    const index = pages.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      pages[index] = { ...pages[index], ...req.body, lastUpdated: new Date().toISOString() };
      await writeData("pages.json", pages);
      res.json(pages[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/pages/:id", async (req, res) => {
    let pages = (await readData("pages.json")) as any[];
    const pageToDelete = pages.find((p: any) => p.id === req.params.id);
    if (pageToDelete && pageToDelete.slug === 'home') {
      res.status(403).json({ error: "Cannot delete home page" });
      return;
    }
    const filteredPages = pages.filter((p: any) => p.id !== req.params.id);
    await writeData("pages.json", filteredPages);
    res.json({ success: true });
  });

  // Blogs API
  app.get("/api/blogs", async (req, res) => {
    let blogs = (await readData("blogs.json")) as any[];
    res.json(blogs);
  });

  app.get("/api/blogs/:id", async (req, res) => {
    let blogs = (await readData("blogs.json")) as any[];
    const blog = blogs.find((b: any) => b.id === req.params.id);
    if (blog) res.json(blog);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/blogs", async (req, res) => {
    let blogs = (await readData("blogs.json")) as any[];
    const newItem = { ...req.body, id: Date.now().toString(), lastUpdated: new Date().toISOString() };
    blogs.push(newItem);
    await writeData("blogs.json", blogs);
    res.status(201).json(newItem);
  });

  app.put("/api/blogs/:id", async (req, res) => {
    let blogs = (await readData("blogs.json")) as any[];
    const index = blogs.findIndex((b: any) => b.id === req.params.id);
    if (index !== -1) {
      blogs[index] = { ...blogs[index], ...req.body, lastUpdated: new Date().toISOString() };
      await writeData("blogs.json", blogs);
      res.json(blogs[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/blogs/:id", async (req, res) => {
    let blogs = (await readData("blogs.json")) as any[];
    const filteredBlogs = blogs.filter((b: any) => b.id !== req.params.id);
    await writeData("blogs.json", filteredBlogs);
    res.json({ success: true });
  });

  // Categories API
  app.get("/api/categories", async (req, res) => {
    let categories = (await readData("categories.json")) as any[];
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    let categories = (await readData("categories.json")) as any[];
    const newItem = { ...req.body, id: Date.now().toString(), lastUpdated: new Date().toISOString() };
    categories.push(newItem);
    await writeData("categories.json", categories);
    res.status(201).json(newItem);
  });

  app.put("/api/categories/:id", async (req, res) => {
    let categories = (await readData("categories.json")) as any[];
    const index = categories.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...req.body, lastUpdated: new Date().toISOString() };
      await writeData("categories.json", categories);
      res.json(categories[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    let categories = (await readData("categories.json")) as any[];
    const filteredCategories = categories.filter((c: any) => c.id !== req.params.id);
    await writeData("categories.json", filteredCategories);
    res.json({ success: true });
  });

  
  // Backup & Restore API
  const backupFilesDir = path.join(dataDir, "backups_files");

  app.get("/api/backups", async (req, res) => {
    let backups = await readData("backups.json");
    if (!Array.isArray(backups)) backups = [];
    backups.sort((a: any, b: any) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
      return tB - tA;
    });
    res.json(backups);
  });

  app.post("/api/backups/create", async (req, res) => {
    try {
      await fs.mkdir(backupFilesDir, { recursive: true });

      const zip = new AdmZip();
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      
      const YYYY = now.getFullYear();
      const MM = pad(now.getMonth() + 1);
      const DD = pad(now.getDate());
      const HH = pad(now.getHours());
      const mm = pad(now.getMinutes());
      const ss = pad(now.getSeconds());

      const filename = `website-backup-${YYYY}-${MM}-${DD}_${HH}-${mm}-${ss}.zip`;
      const dateFormatted = `${DD}/${MM}/${YYYY}`;
      const timeFormatted = `${HH}:${mm}:${ss}`;

      // 1. source-code/
      const srcDir = path.join(process.cwd(), "src");
      if (await fs.stat(srcDir).then(s => s.isDirectory()).catch(() => false)) {
        zip.addLocalFolder(srcDir, "backup/source-code/src");
      }

      const rootCodeFiles = [
        "server.ts", "vite.config.ts", "tsconfig.json", "index.html", "metadata.json"
      ];
      for (const file of rootCodeFiles) {
        const filePath = path.join(process.cwd(), file);
        if (await fs.stat(filePath).then(s => s.isFile()).catch(() => false)) {
          zip.addLocalFile(filePath, "backup/source-code");
        }
      }

      // 2. database/
      const dataFiles = await fs.readdir(dataDir).catch(() => []);
      for (const file of dataFiles) {
        if (file.endsWith(".json") && file !== "backups.json") {
          const filePath = path.join(dataDir, file);
          const stat = await fs.stat(filePath).catch(() => null);
          if (stat && stat.isFile()) {
            zip.addLocalFile(filePath, "backup/database");
          }
        }
      }

      // 3. uploads/
      const uploadsDir = path.join(dataDir, "uploads");
      if (await fs.stat(uploadsDir).then(s => s.isDirectory()).catch(() => false)) {
        zip.addLocalFolder(uploadsDir, "backup/uploads");
      } else {
        zip.addFile("backup/uploads/.gitkeep", Buffer.from(""));
      }

      // 4. config/
      const configFiles = ["package.json", "package-lock.json", ".env.example"];
      for (const file of configFiles) {
        const filePath = path.join(process.cwd(), file);
        if (await fs.stat(filePath).then(s => s.isFile()).catch(() => false)) {
          zip.addLocalFile(filePath, "backup/config");
        }
      }

      // 5. documentation/
      const manifestInfo = {
        system: "BIZ TOP TIER Enterprise CMS",
        version: "1.0.0",
        backupType: "Full Website System Backup",
        createdAt: now.toISOString(),
        structure: {
          "backup/source-code/": "Website Source Code & Entry Points",
          "backup/database/": "Database JSON Collections",
          "backup/uploads/": "Uploaded Media Assets & Files",
          "backup/config/": "Configuration and Package Specs (No secrets)",
          "backup/documentation/": "Manifest and Readme Metadata"
        }
      };
      zip.addFile("backup/documentation/backup-manifest.json", Buffer.from(JSON.stringify(manifestInfo, null, 2)));
      zip.addFile(
        "backup/documentation/README.md", 
        Buffer.from(`# BIZ TOP TIER Enterprise CMS Backup\n\nBackup Created: ${dateFormatted} ${timeFormatted}\nFilename: ${filename}\n\nContents:\n- backup/source-code/\n- backup/database/\n- backup/uploads/\n- backup/config/\n- backup/documentation/\n`)
      );

      // Write zip file
      const zipPath = path.join(backupFilesDir, filename);
      zip.writeZip(zipPath);

      const zipStat = await fs.stat(zipPath);
      const bytes = zipStat.size;
      const sizeStr = bytes > 1024 * 1024 
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` 
        : `${(bytes / 1024).toFixed(1)} KB`;

      const newBackup = {
        id: Date.now().toString(),
        date: dateFormatted,
        time: timeFormatted,
        filename: filename,
        size: sizeStr,
        status: "สำเร็จ",
        type: "Website Backup (.zip)",
        createdAt: now.toISOString()
      };

      let backupsList = await readData("backups.json");
      if (!Array.isArray(backupsList)) backupsList = [];
      backupsList.unshift(newBackup);
      await writeData("backups.json", backupsList);

      res.status(201).json({ success: true, backup: newBackup });
    } catch (error: any) {
      console.error("Backup creation error:", error);
      res.status(500).json({ error: "Failed to create backup: " + error.message });
    }
  });

  app.get("/api/backups/download/:filename", async (req, res) => {
    try {
      const filePath = path.join(backupFilesDir, req.params.filename);
      const isZip = req.params.filename.endsWith(".zip");
      if (isZip) {
        res.setHeader("Content-Type", "application/zip");
      } else {
        res.setHeader("Content-Type", "application/json");
      }
      res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);
      res.sendFile(filePath);
    } catch (error) {
      res.status(404).json({ error: "Backup file not found" });
    }
  });

  app.delete("/api/backups/:id", async (req, res) => {
    try {
      let backupsList = await readData("backups.json");
      if (Array.isArray(backupsList)) {
        const item = backupsList.find((b: any) => String(b.id) === req.params.id);
        if (item && item.filename) {
          try {
            await fs.unlink(path.join(backupFilesDir, item.filename));
          } catch (e) {}
        }
        backupsList = backupsList.filter((b: any) => String(b.id) !== req.params.id);
        await writeData("backups.json", backupsList);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete backup" });
    }
  });

  app.post("/api/backups/restore", async (req, res) => {
    try {
      const { filename, fileData } = req.body;
      let zipBuffer: Buffer | null = null;
      let jsonPayload: any = null;

      if (filename) {
        const filePath = path.join(backupFilesDir, filename);
        if (filename.endsWith(".zip")) {
          zipBuffer = await fs.readFile(filePath);
        } else {
          const content = await fs.readFile(filePath, "utf-8");
          jsonPayload = JSON.parse(content);
        }
      } else if (fileData) {
        const cleanBase64 = fileData.includes(",") ? fileData.split(",")[1] : fileData;
        const buffer = Buffer.from(cleanBase64, "base64");
        try {
          zipBuffer = buffer;
          new AdmZip(zipBuffer); // test valid zip
        } catch (e) {
          zipBuffer = null;
          const jsonStr = buffer.toString("utf-8");
          jsonPayload = JSON.parse(jsonStr);
        }
      }

      if (zipBuffer) {
        const zip = new AdmZip(zipBuffer);
        const entries = zip.getEntries();
        let restoredFilesCount = 0;

        for (const entry of entries) {
          if (!entry.isDirectory && entry.entryName.includes("database/")) {
            const baseName = path.basename(entry.entryName);
            if (baseName.endsWith(".json") && baseName !== "backups.json") {
              const content = entry.getData().toString("utf-8");
              await fs.writeFile(path.join(dataDir, baseName), content, "utf-8");
              restoredFilesCount++;
            }
          }
          if (!entry.isDirectory && entry.entryName.includes("uploads/")) {
            const baseName = path.basename(entry.entryName);
            if (baseName !== ".gitkeep") {
              const uploadsDir = path.join(dataDir, "uploads");
              await fs.mkdir(uploadsDir, { recursive: true });
              await fs.writeFile(path.join(uploadsDir, baseName), entry.getData());
            }
          }
        }
        return res.json({ success: true, message: `กู้คืนข้อมูลสำเร็จ (${restoredFilesCount} รายการ)` });
      } else if (jsonPayload && jsonPayload.data) {
        for (const [file, content] of Object.entries(jsonPayload.data)) {
          if (content !== null && content !== undefined) {
            await writeData(file, content);
          }
        }
        return res.json({ success: true, message: "กู้คืนข้อมูลสำเร็จเรียบร้อยแล้ว" });
      } else {
        return res.status(400).json({ error: "รูปแบบไฟล์สำรองข้อมูลไม่ถูกต้อง" });
      }
    } catch (error: any) {
      console.error("Restore error:", error);
      res.status(500).json({ error: "การกู้คืนข้อมูลล้มเหลว: " + error.message });
    }
  });

  // Helper for activity logs
  const recordActivityLog = async (user: string, action: string, moduleName: string, ip?: string) => {
    try {
      let logs = (await readData("logs.json")) as any[];
      if (!Array.isArray(logs)) logs = [];
      
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateFormatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
      const timeFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const datetimeStr = `${dateFormatted} ${timeFormatted}`;

      const newLog = {
        id: Date.now().toString() + Math.random().toString().slice(2, 6),
        datetime: datetimeStr,
        date: dateFormatted,
        time: timeFormatted,
        user: user || "Super Admin (admin)",
        action: action,
        module: moduleName || "System",
        ip: ip || "171.97.102.45",
        timestamp: Date.now()
      };

      logs.unshift(newLog);
      if (logs.length > 300) logs = logs.slice(0, 300);
      await writeData("logs.json", logs);
      return newLog;
    } catch (err) {
      console.error("Error recording activity log:", err);
    }
  };

  app.get("/api/logs", async (req, res) => {
    try {
      let logs = (await readData("logs.json")) as any[];
      if (!Array.isArray(logs) || logs.length === 0) {
        logs = [
          {
            id: "1",
            datetime: "11/08/2026 09:30:00",
            date: "11/08/2026",
            time: "09:30:00",
            user: "Super Admin (admin)",
            action: "เข้าสู่ระบบสำเร็จ",
            module: "Authentication",
            ip: "171.97.102.45",
            timestamp: Date.now() - 3600000
          },
          {
            id: "2",
            datetime: "10/08/2026 15:45:12",
            date: "10/08/2026",
            time: "15:45:12",
            user: "Marketing Team (mkt01)",
            action: "แก้ไขแบนเนอร์ 'โปรโมชั่นสิงหาคม'",
            module: "Banners",
            ip: "171.97.102.45",
            timestamp: Date.now() - 86400000
          },
          {
            id: "3",
            datetime: "10/08/2026 14:20:05",
            date: "10/08/2026",
            time: "14:20:05",
            user: "Content Creator (content02)",
            action: "เพิ่มบทความใหม่ 'เทรนด์ธุรกิจ 2026'",
            module: "Blogs",
            ip: "118.174.120.8",
            timestamp: Date.now() - 90000000
          },
          {
            id: "4",
            datetime: "10/08/2026 10:15:30",
            date: "10/08/2026",
            time: "10:15:30",
            user: "Super Admin (admin)",
            action: "อัพเดตการตั้งค่าระบบ (General Settings)",
            module: "Settings",
            ip: "171.97.102.45",
            timestamp: Date.now() - 100000000
          }
        ];
        await writeData("logs.json", logs);
      }
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.post("/api/logs", async (req, res) => {
    try {
      const { user, action, module: moduleName, ip } = req.body;
      const clientIp = ip || req.headers['x-forwarded-for'] || req.ip || "171.97.102.45";
      const newLog = await recordActivityLog(user || "Super Admin (admin)", action || "เข้าใช้งานระบบ", moduleName || "System", String(clientIp));
      res.status(201).json({ success: true, log: newLog });
    } catch (error) {
      res.status(500).json({ error: "Failed to record log" });
    }
  });

  app.get("/api/logs/export-csv", async (req, res) => {
    try {
      let logs = (await readData("logs.json")) as any[];
      if (!Array.isArray(logs)) logs = [];

      // Record download log
      await recordActivityLog("Super Admin (admin)", "ดาวน์โหลดไฟล์บันทึกกิจกรรม (CSV)", "Activity Logs", req.ip || "171.97.102.45");

      // UTF-8 BOM \uFEFF for Excel compatibility
      let csvContent = "\uFEFF" + `"วันที่ / เวลา","ผู้ใช้","การกระทำ (Action)","โมดูล","IP Address"\n`;
      for (const log of logs) {
        const datetime = (log.datetime || `${log.date || ''} ${log.time || ''}`).replace(/"/g, '""');
        const user = (log.user || '').replace(/"/g, '""');
        const action = (log.action || '').replace(/"/g, '""');
        const mod = (log.module || '').replace(/"/g, '""');
        const ip = (log.ip || '').replace(/"/g, '""');
        csvContent += `"${datetime}","${user}","${action}","${mod}","${ip}"\n`;
      }

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="activity_logs_export.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to export logs CSV" });
    }
  });

  // Generic CRUD endpoints
  const createCrud = (resource: string) => {
    app.get("/api/" + resource, async (req, res) => {
      const data = await readData(resource + ".json");
      res.json(data);
    });

    app.post("/api/" + resource, async (req, res) => {
      try {
        const bodyWithDate = { ...req.body, lastUpdated: new Date().toISOString() };
        if (singletons.includes(resource)) {
          await setDoc(doc(db, 'singletons', resource), bodyWithDate, { merge: true });
          res.status(201).json(bodyWithDate);
        } else {
          const newItem = { ...bodyWithDate, id: bodyWithDate.id || Date.now().toString() };
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
        const bodyWithDate = { ...req.body, lastUpdated: new Date().toISOString() };
        if (singletons.includes(resource)) {
          await setDoc(doc(db, 'singletons', resource), bodyWithDate, { merge: true });
          res.json(bodyWithDate);
        } else {
          await setDoc(doc(db, resource, req.params.id), bodyWithDate, { merge: true });
          res.json(bodyWithDate);
        }
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    app.delete("/api/" + resource + "/:id", async (req, res) => {
      try {
        await deleteDoc(doc(db, resource, req.params.id));
        res.json({ success: true });
      } catch (e) {
        console.error("Delete error:", e);
        res.status(500).json({ error: "Failed to delete" });
      }
    });
  };

  // Custom delete for media to also delete files
  app.delete("/api/media/:id", async (req, res) => {
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
  });

  createCrud('media');
  createCrud('members');
  createCrud('packages');
  createCrud('finance');
  createCrud('orders');
  createCrud('businessChecks');
  createCrud('settings');
  createCrud('dashboard');
  createCrud('analytics');
  createCrud('staff');

  // Custom delete for videos to also delete files
  app.delete("/api/videos/:id", async (req, res) => {
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
  });

  createCrud('videos');
  createCrud('videoCategories');

  // Static files for uploads
  app.use("/uploads", express.static(path.join(dataDir, "uploads")));

  // Video Upload API
  app.post("/api/videos/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const isImage = req.file.mimetype.startsWith("image/");
    const folder = isImage ? "thumbnails" : "videos";
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;
    
    res.status(201).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });

  // Handle missing API routes by returning JSON instead of falling through to SPA HTML
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  // Global Error Handler for API routes
  app.use('/api/*', (err, req, res, next) => {
    console.error("Express API Error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
