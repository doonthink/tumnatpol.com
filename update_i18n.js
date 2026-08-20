const fs = require('fs');

let code = fs.readFileSync('src/i18n.ts', 'utf8');

// Function to add or replace keys in a block
function updateBlock(blockStartStr, newKeysObj, codeStr) {
    let startIndex = codeStr.indexOf(blockStartStr);
    if (startIndex === -1) return codeStr;
    
    let adminIndex = codeStr.indexOf('admin: {', startIndex);
    if (adminIndex === -1) return codeStr;
    
    // Find the end of admin: { block
    let openBraces = 0;
    let i = adminIndex + 7; // after admin:
    let blockStart = -1;
    let blockEnd = -1;
    
    while(i < codeStr.length) {
        if (codeStr[i] === '{') {
            if (openBraces === 0) blockStart = i;
            openBraces++;
        } else if (codeStr[i] === '}') {
            openBraces--;
            if (openBraces === 0) {
                blockEnd = i;
                break;
            }
        }
        i++;
    }
    
    if (blockStart !== -1 && blockEnd !== -1) {
        let blockContent = codeStr.substring(blockStart + 1, blockEnd);
        
        for (const [key, value] of Object.entries(newKeysObj)) {
            // Check if key exists
            const regex = new RegExp(`\\b${key}:\\s*".*?"`);
            if (regex.test(blockContent)) {
                blockContent = blockContent.replace(regex, `${key}: "${value}"`);
            } else {
                // Add key
                blockContent = `\n        ${key}: "${value}",` + blockContent;
            }
        }
        
        codeStr = codeStr.substring(0, blockStart + 1) + blockContent + codeStr.substring(blockEnd);
    }
    
    return codeStr;
}

const thKeys = {
    membership: "สมาชิก",
    media: "ไฟล์ที่อัปโหลด",
    packages: "แพ็กเกจ",
    financial: "รายได้",
    analytics: "สถิติการใช้งาน",
    settings: "ตั้งค่า"
};

const enKeys = {
    membership: "Member",
    media: "Upload",
    packages: "Package",
    financial: "Financial",
    analytics: "Analytics",
    settings: "Settings"
};

code = updateBlock('th: {', thKeys, code);
code = updateBlock('en: {', enKeys, code);

fs.writeFileSync('src/i18n.ts', code);
