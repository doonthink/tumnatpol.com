import fs from 'fs';

let content = fs.readFileSync('src/i18n.ts', 'utf-8');

// The user wants:
// admin.member -> TH: "สมาชิก", EN: "Member"
// Wait, the key in AdminLayout is admin.membership. I will replace admin.membership.
// Let's replace both admin.member and admin.membership just to be safe if both exist.

// admin.media -> TH: "ไฟล์ที่อัปโหลด", EN: "Upload"
// admin.package -> TH: "แพ็กเกจ", EN: "Package" (key might be admin.packages)
// admin.financial -> TH: "รายได้", EN: "Financial"
// admin.analytics -> TH: "สถิติการใช้งาน", EN: "Analytics"
// admin.settings -> TH: "ตั้งค่า", EN: "Settings"

const replacements = [
  // TH
  { search: /membership:\s*".*?"/, replace: 'membership: "สมาชิก"' },
  { search: /media:\s*".*?"/, replace: 'media: "ไฟล์ที่อัปโหลด"' },
  { search: /packages:\s*".*?"/, replace: 'packages: "แพ็กเกจ"' },
  { search: /package:\s*".*?"/, replace: 'package: "แพ็กเกจ"' },
  { search: /financial:\s*".*?"/, replace: 'financial: "รายได้"' },
  { search: /analytics:\s*".*?"/, replace: 'analytics: "สถิติการใช้งาน"' },
  { search: /settings:\s*".*?"/, replace: 'settings: "ตั้งค่า"' },
];

let isEnSection = false;
let lines = content.split('\n');
let newLines = [];

for (let line of lines) {
  if (line.includes('en: {')) {
    isEnSection = true;
  }
  
  if (!isEnSection && line.includes('admin: {')) {
     // TH admin section
  }
  
  if (!isEnSection) {
    if (line.match(/\bmembership:\s*".*?"/)) line = line.replace(/membership:\s*".*?"/, 'membership: "สมาชิก"');
    if (line.match(/\bmember:\s*".*?"/)) line = line.replace(/member:\s*".*?"/, 'member: "สมาชิก"');
    if (line.match(/\bmedia:\s*".*?"/)) line = line.replace(/media:\s*".*?"/, 'media: "ไฟล์ที่อัปโหลด"');
    if (line.match(/\bpackages:\s*".*?"/)) line = line.replace(/packages:\s*".*?"/, 'packages: "แพ็กเกจ"');
    if (line.match(/\bpackage:\s*".*?"/)) line = line.replace(/package:\s*".*?"/, 'package: "แพ็กเกจ"');
    if (line.match(/\bfinancial:\s*".*?"/)) line = line.replace(/financial:\s*".*?"/, 'financial: "รายได้"');
    if (line.match(/\banalytics:\s*".*?"/)) line = line.replace(/analytics:\s*".*?"/, 'analytics: "สถิติการใช้งาน"');
    if (line.match(/\bsettings:\s*".*?"/)) line = line.replace(/settings:\s*".*?"/, 'settings: "ตั้งค่า"');
  } else {
    if (line.match(/\bmembership:\s*".*?"/)) line = line.replace(/membership:\s*".*?"/, 'membership: "Member"');
    if (line.match(/\bmember:\s*".*?"/)) line = line.replace(/member:\s*".*?"/, 'member: "Member"');
    if (line.match(/\bmedia:\s*".*?"/)) line = line.replace(/media:\s*".*?"/, 'media: "Upload"');
    if (line.match(/\bpackages:\s*".*?"/)) line = line.replace(/packages:\s*".*?"/, 'packages: "Package"');
    if (line.match(/\bpackage:\s*".*?"/)) line = line.replace(/package:\s*".*?"/, 'package: "Package"');
    if (line.match(/\bfinancial:\s*".*?"/)) line = line.replace(/financial:\s*".*?"/, 'financial: "Financial"');
    if (line.match(/\banalytics:\s*".*?"/)) line = line.replace(/analytics:\s*".*?"/, 'analytics: "Analytics"');
    if (line.match(/\bsettings:\s*".*?"/)) line = line.replace(/settings:\s*".*?"/, 'settings: "Settings"');
  }
  
  newLines.push(line);
}

// ensure keys exist in both if not present
function addKeysIfNeeded(sectionName, newLinesArr, sectionStartStr) {
   let startIdx = newLinesArr.findIndex(l => l.includes(sectionStartStr));
   if (startIdx === -1) return newLinesArr;
   let adminStart = newLinesArr.findIndex((l, i) => i > startIdx && l.includes('admin: {'));
   if (adminStart !== -1) {
      const keysToAdd = [];
      const th = sectionStartStr.includes('th:');
      const membership = th ? 'membership: "สมาชิก",' : 'membership: "Member",';
      const media = th ? 'media: "ไฟล์ที่อัปโหลด",' : 'media: "Upload",';
      const packages = th ? 'packages: "แพ็กเกจ",' : 'packages: "Package",';
      const financial = th ? 'financial: "รายได้",' : 'financial: "Financial",';
      const analytics = th ? 'analytics: "สถิติการใช้งาน",' : 'analytics: "Analytics",';
      const settings = th ? 'settings: "ตั้งค่า",' : 'settings: "Settings",';

      // check if they exist
      let hasMembership = false, hasMedia = false, hasPackages = false, hasFinancial = false, hasAnalytics = false, hasSettings = false;
      let blockEnd = -1;
      let braceCount = 0;
      for (let i = adminStart; i < newLinesArr.length; i++) {
        if (newLinesArr[i].includes('{')) braceCount++;
        if (newLinesArr[i].includes('}')) braceCount--;
        if (newLinesArr[i].match(/\bmembership:/)) hasMembership = true;
        if (newLinesArr[i].match(/\bmedia:/)) hasMedia = true;
        if (newLinesArr[i].match(/\bpackages:/)) hasPackages = true;
        if (newLinesArr[i].match(/\bfinancial:/)) hasFinancial = true;
        if (newLinesArr[i].match(/\banalytics:/)) hasAnalytics = true;
        if (newLinesArr[i].match(/\bsettings:/)) hasSettings = true;

        if (braceCount === 0) {
          blockEnd = i;
          break;
        }
      }

      if (!hasMembership) keysToAdd.push('        ' + membership);
      if (!hasMedia) keysToAdd.push('        ' + media);
      if (!hasPackages) keysToAdd.push('        ' + packages);
      if (!hasFinancial) keysToAdd.push('        ' + financial);
      if (!hasAnalytics) keysToAdd.push('        ' + analytics);
      if (!hasSettings) keysToAdd.push('        ' + settings);

      if (keysToAdd.length > 0) {
         newLinesArr.splice(adminStart + 1, 0, ...keysToAdd);
      }
   }
   return newLinesArr;
}

newLines = addKeysIfNeeded('th: {', newLines);
newLines = addKeysIfNeeded('en: {', newLines);

fs.writeFileSync('src/i18n.ts', newLines.join('\n'));
