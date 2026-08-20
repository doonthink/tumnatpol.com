import fs from 'fs';
const data = JSON.parse(fs.readFileSync('temp.json', 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], prefix + k + '.'));
    } else {
      keys.push(prefix + k);
    }
  }
  return keys;
}

const thKeys = getKeys(data.th.translation);
const enKeys = getKeys(data.en.translation);

const missingInEn = thKeys.filter(k => !enKeys.includes(k));
const missingInTh = enKeys.filter(k => !thKeys.includes(k));

console.log("Missing in EN:", missingInEn);
console.log("Missing in TH:", missingInTh);
