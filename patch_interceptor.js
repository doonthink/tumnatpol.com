import fs from 'fs';

let content = fs.readFileSync('src/lib/apiInterceptor.ts', 'utf-8');
content = content.replace(
  /const excluded = \['videos\/upload', 'logs', 'backups', 'media', 'health', 'business-check'\];/,
  "const excluded = ['videos/upload', 'logs', 'backups', 'media', 'health', 'business-check', 'verify-recaptcha'];"
);

fs.writeFileSync('src/lib/apiInterceptor.ts', content);
