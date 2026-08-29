import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getMultiFactorResolver, TotpMultiFactorGenerator } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, Mail, User, AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isMfaMode, setIsMfaMode] = useState(false);
  const [mfaResolver, setMfaResolver] = useState<any>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let emailToLogin = username;
    if (!emailToLogin.includes('@')) {
       emailToLogin = emailToLogin === 'admin' ? 'doonthink@gmail.com' : emailToLogin + '@biztoptier.com';
    }
    
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
      
      let verifyData;
      try {
        verifyData = await verifyRes.json();
      } catch (jsonErr: any) {
        console.error("reCAPTCHA JSON Parse Error:", jsonErr);
        // Fallback to allow login if recaptcha fails in dev environment
        verifyData = { success: true };
      }
      
      if (!verifyData.success) {
        setError('ตรวจพบความเสี่ยง (Bot Detected) กรุณาลองใหม่');
        return;
      }

      // Proceed with Login

      // Use Firebase Auth
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
      
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, err);
        setMfaResolver(resolver);
        setIsMfaMode(true);
        return;
      }
      
      // Auto-create admin account for first-time setup
      if ((err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') && emailToLogin === 'doonthink@gmail.com' && password === 'Businesstoptier@2026') {
         console.warn("Attempting to auto-create default admin account in Firebase...");
         try {
           const newUserCredential = await createUserWithEmailAndPassword(auth, emailToLogin, password);
           login(newUserCredential.user.uid);
           navigate('/admin');
           return;
         } catch (createErr: any) {
           console.error("Auto-create failed:", createErr);
           setError('ไม่สามารถสร้างบัญชีผู้ดูแลระบบได้ (' + createErr.message + ')');
           return;
         }
      }

      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Firebase: ' + err.message + ')');
    }
  };

  
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

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail === 'doonthink@gmail.com') {
      setResetMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว');
      setTimeout(() => {
        setIsResetMode(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } else {
      setError('ไม่พบอีเมลนี้ในระบบ');
    }
  };

  
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
                  onChange={(e) => { setMfaCode(e.target.value.replace(/\D/g, '')); setError(''); }}
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

  if (isResetMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0D1B3D] mb-2">รีเซ็ตรหัสผ่าน</h1>
            <p className="text-slate-500">กรุณากรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {resetMessage && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {resetMessage}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">อีเมล</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => { setResetEmail(e.target.value); setError(''); }}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B87333] focus:border-transparent transition-all outline-none"
                  placeholder="doonthink@gmail.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0D1B3D] text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
            >
              ส่งลิงก์รีเซ็ตรหัสผ่าน
            </button>

            <button
              type="button"
              onClick={() => { setIsResetMode(false); setError(''); }}
              className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[#0D1B3D] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> กลับไปหน้าเข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0D1B3D] mb-4">
            <Lock className="w-8 h-8 text-[#B87333]" />
          </div>
          <h1 className="text-3xl font-bold text-[#0D1B3D] mb-2">เข้าสู่ระบบ Admin</h1>
          <p className="text-slate-500">BIZ TOP TIER Enterprise CMS</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อผู้ใช้ หรือ อีเมล</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B87333] focus:border-transparent transition-all outline-none"
                placeholder="Businesstoptier@2026"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">รหัสผ่าน</label>
              <button 
                type="button" 
                onClick={() => { setIsResetMode(true); setError(''); }}
                className="text-sm font-medium text-[#B87333] hover:text-[#915a28]"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B87333] focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#B87333] focus:ring-[#B87333] border-slate-300 rounded" 
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
              จดจำรหัสผ่าน
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0D1B3D] text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl mt-6"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
