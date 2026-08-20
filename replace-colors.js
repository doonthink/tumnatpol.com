const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
};

const replaceColors = () => {
  const files = walk('./src');
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace class names
    content = content.replace(/bg-\[\#0D1B3D\]/g, 'bg-primary');
    content = content.replace(/text-\[\#0D1B3D\]/g, 'text-primary');
    content = content.replace(/border-\[\#0D1B3D\]/g, 'border-primary');
    content = content.replace(/hover:bg-\[\#0a152e\]/g, 'hover:bg-primary-dark');
    content = content.replace(/hover:text-\[\#0a152e\]/g, 'hover:text-primary-dark');
    
    content = content.replace(/bg-\[\#B87333\]/g, 'bg-accent');
    content = content.replace(/text-\[\#B87333\]/g, 'text-accent');
    content = content.replace(/border-\[\#B87333\]/g, 'border-accent');
    content = content.replace(/hover:bg-\[\#a16329\]/g, 'hover:bg-accent-dark');
    content = content.replace(/hover:text-\[\#a16329\]/g, 'hover:text-accent-dark');
    
    fs.writeFileSync(file, content, 'utf8');
  });
  console.log('Replaced colors successfully.');
}

replaceColors();