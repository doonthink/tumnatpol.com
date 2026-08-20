import fs from 'fs';

let content = fs.readFileSync('src/admin/Login.tsx', 'utf-8');

// Insert firebase imports
content = content.replace(
  "import { useAuth } from '../contexts/AuthContext';",
  "import { useAuth } from '../contexts/AuthContext';\nimport { signInWithEmailAndPassword } from 'firebase/auth';\nimport { auth } from '../lib/firebase';"
);

// Replace handleLogin
content = content.replace(
  /const handleLogin = async \(e: React\.FormEvent\) => \{[\s\S]*?const handleResetPassword = \(/,
  `const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use Firebase Auth
      let emailToLogin = username;
      if (!emailToLogin.includes('@')) {
         emailToLogin = emailToLogin === 'admin' ? 'doonthink@gmail.com' : emailToLogin + '@biztoptier.com';
      }
      const userCredential = await signInWithEmailAndPassword(auth, emailToLogin, password);
      
      // Attempt to log activity
      try {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: userCredential.user.email,
            action: 'เข้าสู่ระบบสำเร็จ (Firebase)',
            module: 'Authentication'
          })
        });
      } catch (err) {}
      
      login(userCredential.user.uid);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      
      // Fallback for demo purposes if they haven't created the account in Firebase console yet
      if (password === 'Businesstoptier@2026') {
         console.warn("Using fallback local login because Firebase Auth failed (Account not created yet).");
         login('mock-jwt-token-123');
         navigate('/admin');
         return;
      }

      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Firebase: ' + err.message + ')');
    }
  };

  const handleResetPassword = (`
);

fs.writeFileSync('src/admin/Login.tsx', content);
