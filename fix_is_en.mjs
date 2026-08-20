import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('i18n.language === "en"')) {
    content = content.replace(/i18n\.language === "en"/g, "i18n.language?.startsWith('en')");
    fs.writeFileSync(file, content);
  }
  if (content.includes("i18n.language === 'en'")) {
    content = content.replace(/i18n\.language === 'en'/g, "i18n.language?.startsWith('en')");
    fs.writeFileSync(file, content);
  }
});
console.log("Fixed isEn language checks");
