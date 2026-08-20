import fs from 'fs';

let content = fs.readFileSync('src/admin/Login.tsx', 'utf-8');

// Add imports for MFA
if (!content.includes('TotpMultiFactorGenerator')) {
  content = content.replace(
    "import { signInWithEmailAndPassword } from 'firebase/auth';",
    "import { signInWithEmailAndPassword, getMultiFactorResolver, TotpMultiFactorGenerator } from 'firebase/auth';"
  );
}

// Add ShieldCheck icon
if (!content.includes('ShieldCheck')) {
  content = content.replace(
    "import { User, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Mail } from 'lucide-react';",
    "import { User, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';"
  );
}

// Add MFA state variables
content = content.replace(
  "const [error, setError] = useState('');",
  `const [error, setError] = useState('');
  const [isMfaMode, setIsMfaMode] = useState(false);
  const [mfaResolver, setMfaResolver] = useState<any>(null);
  const [mfaCode, setMfaCode] = useState('');`
);

// Update catch block in handleLogin
content = content.replace(
  /\} catch \(err: any\) \{\n      console\.error\(err\);/,
  `} catch (err: any) {
      console.error(err);
      
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, err);
        setMfaResolver(resolver);
        setIsMfaMode(true);
        return;
      }`
);

// Add handleMfaVerify function
const handleMfaVerifyCode = `
  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const hint = mfaResolver.hints[0];
      let assertion;
      
      if (hint.factorId === TotpMultiFactorGenerator.FACTOR_ID) {
        assertion = TotpMultiFactorGenerator.assertionForSignIn(hint.uid, mfaCode);
      } else {
        throw new Error('ระบบรองรับเฉพาะ Authenticator App (TOTP) ในขณะนี้');
      }

      const userCredential = await mfaResolver.resolveSignIn(assertion);
      
      // Log success
      try {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: userCredential.user.email,
            action: 'เข้าสู่ระบบสำเร็จ (MFA)',
            module: 'Authentication'
          })
        });
      } catch (err) {}
      
      login(userCredential.user.uid);
      navigate('/admin');
    } catch (err: any) {
      setError('รหัส 2FA ไม่ถูกต้อง กรุณาลองใหม่');
    }
  };
`;

content = content.replace(
  "const handleResetPassword = (e: React.FormEvent) => {",
  `${handleMfaVerifyCode}\n  const handleResetPassword = (e: React.FormEvent) => {`
);

// Add MFA UI
const mfaUiCode = `
  if (isMfaMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0D1B3D] mb-2">การยืนยันตัวตนแบบสองขั้นตอน</h1>
            <p className="text-slate-500">กรุณากรอกรหัส 6 หลักจากแอปพลิเคชัน Authenticator ของคุณ (เช่น Google Authenticator)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleMfaVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">รหัสยืนยัน (Authenticator Code)</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => { setMfaCode(e.target.value.replace(/\\D/g, '')); setError(''); }}
                  className="block w-full text-center tracking-widest text-2xl py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B87333] focus:border-transparent transition-all outline-none"
                  placeholder="000000"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0D1B3D] text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
            >
              ยืนยันรหัส
            </button>
            
            <button
              type="button"
              onClick={() => { setIsMfaMode(false); setMfaResolver(null); setMfaCode(''); setError(''); }}
              className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[#0D1B3D] transition-colors mt-4"
            >
              <ArrowLeft className="w-4 h-4" /> กลับไปหน้าล็อกอิน
            </button>
          </form>
        </div>
      </div>
    );
  }
`;

content = content.replace(
  "if (isResetMode) {",
  `${mfaUiCode}\n  if (isResetMode) {`
);

fs.writeFileSync('src/admin/Login.tsx', content);
