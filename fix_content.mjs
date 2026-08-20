import fs from 'fs';

const pagesData = JSON.parse(fs.readFileSync('data/pages.json', 'utf-8'));

// Fix Home page
const homePage = pagesData.find(p => p.slug === 'home');
if (homePage) {
  homePage.content = ''; // Empty string for home page to remove the welcome banner
}

// Fix Header page
const headerPage = pagesData.find(p => p.slug === 'header');
if (headerPage) {
  headerPage.content = `
<div class="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
  <div class="flex items-center gap-3">
    <a href="/" class="flex items-center gap-3">
      <div class="font-bold text-2xl text-[#0D1B3D]">BIZ Toptier</div>
    </a>
  </div>
  <nav class="hidden md:flex items-center gap-8">
    <a href="/" class="text-sm font-medium text-[#0D1B3D] border-b-2 border-[#B87333] pb-1">Home</a>
    <a href="/about" class="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">About</a>
    <a href="/service" class="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">Service</a>
    <a href="/blog" class="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">Blog</a>
    <a href="/contact" class="text-sm font-medium text-slate-500 hover:text-[#0D1B3D] transition-colors">Contact</a>
    <div class="h-6 w-px bg-slate-200 mx-2"></div>
    <button class="text-sm font-semibold text-[#0D1B3D] px-4 py-2 hover:opacity-80 transition-opacity">
      Login
    </button>
    <button class="rounded-full bg-[#0D1B3D] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#081025]">
      Register
    </button>
  </nav>
  <button class="md:hidden p-2 text-slate-500">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  </button>
</div>
`;
}

fs.writeFileSync('data/pages.json', JSON.stringify(pagesData, null, 2));
console.log("Pages content fixed.");
