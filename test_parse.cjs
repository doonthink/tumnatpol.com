const fs = require('fs');
const content = fs.readFileSync('src/admin/banners/BannerList.tsx', 'utf8');
const { parse } = require('@babel/parser');

try {
  parse(content, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });
  console.log('Parsed successfully');
} catch (e) {
  console.log('Parse error:', e.message, 'at line:', e.loc.line, 'col:', e.loc.column);
}
