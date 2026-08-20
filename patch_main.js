import fs from 'fs';

let content = fs.readFileSync('src/main.tsx', 'utf-8');

if (!content.includes('GoogleReCaptchaProvider')) {
  content = content.replace(
    "import {StrictMode} from 'react';",
    "import {StrictMode} from 'react';\nimport { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';"
  );
  
  content = content.replace(
    /<App \/>/,
    `<GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}>
      <App />
    </GoogleReCaptchaProvider>`
  );
  
  fs.writeFileSync('src/main.tsx', content);
}
