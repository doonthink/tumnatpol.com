import fs from 'fs';

let content = fs.readFileSync('src/admin/Login.tsx', 'utf-8');

// Add import
content = content.replace(
  "import { useAuth } from '../contexts/AuthContext';",
  "import { useAuth } from '../contexts/AuthContext';\nimport { useGoogleReCaptcha } from 'react-google-recaptcha-v3';"
);

// Add hook
content = content.replace(
  /const { login } = useAuth\(\);/,
  `const { login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();`
);

// Inject logic into handleLogin
content = content.replace(
  /const handleLogin = async \(e: React\.FormEvent\) => \{\n    e\.preventDefault\(\);\n    try \{/,
  `const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!executeRecaptcha) {
      setError('ระบบป้องกันบอทยังไม่พร้อมทำงาน กรุณารอสักครู่');
      return;
    }

    try {
      // 1. Get reCAPTCHA Token
      const token = await executeRecaptcha('login_admin');
      
      // 2. Verify Token with Backend
      const verifyRes = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        setError('ตรวจพบความเสี่ยง (Bot Detected) กรุณาลองใหม่');
        return;
      }

      // Proceed with Login
`
);

fs.writeFileSync('src/admin/Login.tsx', content);
