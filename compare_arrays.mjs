import fs from 'fs';
const data = JSON.parse(fs.readFileSync('temp.json', 'utf8'));

const checkArrays = (thObj, enObj, path) => {
  for (let k in thObj) {
    if (Array.isArray(thObj[k])) {
      if (!Array.isArray(enObj[k]) || thObj[k].length !== enObj[k].length) {
        console.log(`Mismatch at ${path}.${k}: TH length ${thObj[k].length}, EN length ${enObj[k] ? enObj[k].length : 'undefined'}`);
      } else {
        console.log(`Match at ${path}.${k}: length ${thObj[k].length}`);
      }
    } else if (typeof thObj[k] === 'object' && thObj[k] !== null) {
      if (enObj[k]) checkArrays(thObj[k], enObj[k], path + '.' + k);
    }
  }
};

checkArrays(data.th.translation, data.en.translation, 'root');
