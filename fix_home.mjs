import fs from 'fs';
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
home = home.replace(/<Features \/>\s*<LatestBlogs \/>/, '<Features />\n        <ServicesSection />\n        <LatestBlogs />');
fs.writeFileSync('src/pages/Home.tsx', home);
