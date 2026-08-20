import fs from 'fs';

let data = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));

const newIframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d242.21736205953735!2d100.57681171381367!3d13.750035798106403!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29fcb927b6219%3A0xc78f8cd4748d16f2!2sAlltimage%20Co.%2CLtd%20(Rama9)!5e0!3m2!1sth!2sth!4v1786420399299!5m2!1sth!2sth" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';

let updated = false;
data.forEach(page => {
  if (page.content && page.content.includes('<iframe src="https://www.google.com/maps')) {
    page.content = page.content.replace(/<iframe src="https:\/\/www\.google\.com\/maps[^>]+><\/iframe>/g, newIframe);
    updated = true;
  }
  if (page.content_en && page.content_en.includes('<iframe src="https://www.google.com/maps')) {
    page.content_en = page.content_en.replace(/<iframe src="https:\/\/www\.google\.com\/maps[^>]+><\/iframe>/g, newIframe);
    updated = true;
  }
});

if (updated) {
  fs.writeFileSync('data/pages.json', JSON.stringify(data, null, 2));
  console.log('Map updated successfully via JSON.');
} else {
  console.log('Could not find iframe to replace in JSON properties.');
}
