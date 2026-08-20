import fs from 'fs';

const pagesPath = 'data/pages.json';
const pagesStr = fs.readFileSync(pagesPath, 'utf8');
const pages = JSON.parse(pagesStr);

const servicePage = pages.find(p => p.id === 'service' || p.slug === 'service');
if (servicePage) {
  if (!servicePage.content.includes('not-prose')) {
     servicePage.content = `<div class="not-prose">\n${servicePage.content}\n</div>`;
     fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
     console.log("Added not-prose");
  }
}

// Let's do the same for 'home' page just in case?
const homePage = pages.find(p => p.id === 'home' || p.slug === 'home');
if (homePage) {
  if (!homePage.content.includes('not-prose') && homePage.content.includes('grid-cols')) {
     homePage.content = `<div class="not-prose">\n${homePage.content}\n</div>`;
     fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
     console.log("Added not-prose to home");
  }
}
