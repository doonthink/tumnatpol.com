const fs = require('fs');
const content = fs.readFileSync('src/i18n.ts', 'utf8');
const thMatch = content.match(/th: \{([\s\S]*?)en: \{/);
const enMatch = content.match(/en: \{([\s\S]*?)\}\s*};\s*i18n/);
if (thMatch && enMatch) {
  console.log("th length:", thMatch[1].length);
  console.log("en length:", enMatch[1].length);
}
