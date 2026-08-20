const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf-8');

const resources = ['media', 'members', 'packages', 'finance', 'settings', 'dashboard'];

let genericApis = `
  // Generic CRUD endpoints
  const createCrud = (resource: string) => {
    app.get("/api/" + resource, async (req, res) => {
      let data = await readData(resource + ".json");
      if (!data || (Array.isArray(data) && data.length === 0) || Object.keys(data).length === 0) {
        if (resource === 'media') {
          data = [
            { id: '1', name: 'hero-banner.jpg', type: 'image', size: '2.4 MB', date: '2024-08-01', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80' },
            { id: '2', name: 'company-profile.pdf', type: 'document', size: '5.1 MB', date: '2024-07-28', url: '' }
          ];
        } else if (resource === 'members') {
          data = [
            { id: 'M-001', name: 'Somsak Jaidee', email: 'somsak@example.com', package: 'Enterprise', status: 'Active', login: '2 mins ago', joined: '2023-01-15' },
            { id: 'M-002', name: 'Wipawee Sritong', email: 'wipawee@example.com', package: 'Premium', status: 'Active', login: '1 hour ago', joined: '2023-03-22' }
          ];
        } else if (resource === 'packages') {
          data = [
            { id: '1', name: 'Basic', description: 'Perfect for beginners and small sites.', price: 500, duration: '1 Month', status: 'Active', isFeatured: false, users: 1240 },
            { id: '2', name: 'Premium', description: 'Most popular choice for growing businesses.', price: 2500, duration: '6 Months', status: 'Active', isFeatured: true, users: 4500 }
          ];
        } else if (resource === 'finance') {
           data = [
             { id: 'INV-2024-001', customer: 'Acme Corp', package: 'Enterprise', amount: '12000', status: 'Paid', date: 'Today, 10:24 AM' }
           ];
        } else if (resource === 'settings') {
           data = { general: { siteName: 'BIZ Top Tier' } };
        } else if (resource === 'dashboard') {
           data = { 
             stats: [
              { title: 'Total Members', value: '14,295', change: '+4.75%', trend: 'up', icon: 'Users', color: 'bg-blue-500' }
             ]
           };
        }
        await writeData(resource + ".json", data);
      }
      res.json(data);
    });

    app.post("/api/" + resource, async (req, res) => {
      let data = await readData(resource + ".json");
      if (Array.isArray(data)) {
        const newItem = { ...req.body, id: Date.now().toString() };
        data.push(newItem);
        await writeData(resource + ".json", data);
        res.status(201).json(newItem);
      } else {
        data = { ...data, ...req.body };
        await writeData(resource + ".json", data);
        res.status(201).json(data);
      }
    });

    app.put("/api/" + resource + "/:id", async (req, res) => {
      const data = await readData(resource + ".json");
      if (Array.isArray(data)) {
        const index = data.findIndex((item: any) => String(item.id) === req.params.id);
        if (index !== -1) {
          data[index] = { ...data[index], ...req.body };
          await writeData(resource + ".json", data);
          res.json(data[index]);
        } else {
          res.status(404).json({ error: "Not found" });
        }
      }
    });

    app.delete("/api/" + resource + "/:id", async (req, res) => {
      const data = await readData(resource + ".json");
      if (Array.isArray(data)) {
        const filtered = data.filter((item: any) => String(item.id) !== req.params.id);
        await writeData(resource + ".json", filtered);
        res.json({ success: true });
      }
    });
  };

  createCrud('media');
  createCrud('members');
  createCrud('packages');
  createCrud('finance');
  createCrud('settings');
  createCrud('dashboard');
`;

serverContent = serverContent.replace('// Vite middleware for development', genericApis + '\n  // Vite middleware for development');
fs.writeFileSync('server.ts', serverContent);
