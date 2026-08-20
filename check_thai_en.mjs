import fs from 'fs';
const pages = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));

pages.forEach(p => {
  const thaiRegex = /[ก-๙]+/g;
  if (p.content_en && p.content_en.match(thaiRegex)) {
    console.log(`Found Thai in content_en for slug: ${p.slug}`);
    console.log(p.content_en.match(thaiRegex));
  }
  if (p.title_en && p.title_en.match(thaiRegex)) {
    console.log(`Found Thai in title_en for slug: ${p.slug}`);
  }
});
