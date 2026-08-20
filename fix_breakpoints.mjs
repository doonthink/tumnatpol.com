import fs from 'fs';
import path from 'path';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Specifically target classes with md: and replace with lg:
      // A safe way is to replace " md:" with " lg:" and '"md:' with '"lg:'
      // We must be careful not to replace something else, but in Tailwind classnames it's usually ` md:` or `"md:` or `'md:` or ``md:``
      
      const original = content;
      content = content.replace(/ md:/g, ' lg:');
      content = content.replace(/"md:/g, '"lg:');
      content = content.replace(/'md:/g, "'lg:");
      content = content.replace(/`md:/g, "`lg:");
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir('src/components');
replaceInDir('src/pages');

