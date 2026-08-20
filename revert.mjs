import fs from 'fs';

let pagesData = JSON.parse(fs.readFileSync('data/pages.json', 'utf-8'));
let home = pagesData.find(p => p.slug === 'home');
if (home && home.content === '<h1></h1>') {
  home.content = `
<div class="bg-white py-24 sm:py-32 relative overflow-hidden">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10 text-center">
    <h1 class="text-4xl font-bold tracking-tight text-[#0D1B3D] sm:text-6xl mb-6">
      Welcome to BIZ Toptier
    </h1>
    <p class="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
      แพลตฟอร์มธุรกิจเพื่อเพิ่มยอดขายและเพิ่มประสิทธิภาพให้องค์กร
    </p>
  </div>
</div>
`;
  fs.writeFileSync('data/pages.json', JSON.stringify(pagesData, null, 2));
}
