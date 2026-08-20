import fs from 'fs';

// 1. Remove LinkedIn from Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(
  /<a href="[^"]*" className="w-10 h-10 rounded-full border border-white\/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white\/10 transition-colors">\s*<Linkedin className="w-4 h-4" \/>\s*<\/a>/,
  ''
);

// 2. Change Resources top links from 'a' to 'Link'
footer = footer.replace(/<a href="#" className="text-slate-300 hover:text-white transition-colors">\{t\("privacy"\)\}<\/a>/, '<Link to="/privacy" className="text-slate-300 hover:text-white transition-colors">{t("privacy")}</Link>');
footer = footer.replace(/<a href="#" className="text-slate-300 hover:text-white transition-colors">\{t\("terms"\)\}<\/a>/, '<Link to="/terms" className="text-slate-300 hover:text-white transition-colors">{t("terms")}</Link>');
footer = footer.replace(/<a href="#" className="text-slate-300 hover:text-white transition-colors">\{t\("cookies"\)\}<\/a>/, '<Link to="/cookies" className="text-slate-300 hover:text-white transition-colors">{t("cookies")}</Link>');

// 3. Change bottom links from 'a' to 'Link'
footer = footer.replace(/<a href="#" className="hover:text-white transition-colors">Privacy Policy<\/a>/, '<Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>');
footer = footer.replace(/<a href="#" className="hover:text-white transition-colors">Terms of Service<\/a>/, '<Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>');
footer = footer.replace(/<a href="#" className="hover:text-white transition-colors">Cookie Policy<\/a>/, '<Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>');
footer = footer.replace(/<a href="#" className="hover:text-white transition-colors">PDPA<\/a>/, '<Link to="/pdpa" className="hover:text-white transition-colors">PDPA</Link>');
footer = footer.replace(/<a href="#" className="hover:text-white transition-colors">Disclaimer<\/a>/, '<Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>');

fs.writeFileSync('src/components/Footer.tsx', footer);
console.log("Updated Footer.tsx");

