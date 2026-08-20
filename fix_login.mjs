import fs from 'fs';

let content = fs.readFileSync('src/admin/Login.tsx', 'utf8');

content = content.replace(
  /import \{ Lock, Mail, User, AlertCircle, ArrowLeft \} from 'lucide-react';/,
  "import { Lock, Mail, User, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';"
);

content = content.replace(
  /const \[password, setPassword\] = useState\(''\);/,
  "const [password, setPassword] = useState('');\n  const [showPassword, setShowPassword] = useState(false);\n  const [rememberMe, setRememberMe] = useState(false);"
);

const passwordField = `
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
`;

content = content.replace(
  /<div className="relative">\s*<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">\s*<Lock className="h-5 w-5 text-slate-400" \/>\s*<\/div>\s*<input\s*type="password"[\s\S]*?required\s*\/>\s*<\/div>\s*<\/div>/,
  passwordField.trim()
);

fs.writeFileSync('src/admin/Login.tsx', content);
console.log("Login updated");
