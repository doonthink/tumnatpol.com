import fs from 'fs';

let data = fs.readFileSync('data/pages.json', 'utf8');

const oldIframe = '<iframe src="https://www.google.com/maps?q=Major+Property+Service,+Rama+9,+Bangkok&output=embed" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

const newIframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d242.21736205953735!2d100.57681171381367!3d13.750035798106403!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29fcb927b6219%3A0xc78f8cd4748d16f2!2sAlltimage%20Co.%2CLtd%20(Rama9)!5e0!3m2!1sth!2sth!4v1786420399299!5m2!1sth!2sth" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';

if(data.includes(oldIframe)) {
  data = data.split(oldIframe).join(newIframe);
  fs.writeFileSync('data/pages.json', data);
  console.log('Map updated successfully.');
} else {
  console.log('Old iframe not found. Trying regex.');
  const regex = /<iframe src="https:\/\/www\.google\.com\/maps\?q=Major\+Property\+Service,\+Rama\+9,\+Bangkok&output=embed" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"><\/iframe>/g;
  if(regex.test(data)) {
    data = data.replace(regex, newIframe);
    fs.writeFileSync('data/pages.json', data);
    console.log('Map updated via regex.');
  } else {
    console.log('Could not find iframe to replace.');
  }
}
