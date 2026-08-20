import fs from 'fs';

let content = fs.readFileSync('src/i18n.ts', 'utf8');

// The TH section has admin under \`th: { ... translation: { ... admin: {\`
// Find the first \`admin: {\` and insert Thai.
// Find the second \`admin: {\` and insert English.

let parts = content.split('admin: {');

if (parts.length === 3) {
  parts[1] = `
        edit_post: "แก้ไขบทความ",
        content_label: "รายละเอียด",
        categorization: "หมวดหมู่",
        media_images: "รูปภาพหน้าปก",
        product_tags: "สินค้าที่เกี่ยวข้อง",` + parts[1];
        
  parts[2] = `
        edit_post: "Edit Post",
        content_label: "Content Details",
        categorization: "Categorization",
        media_images: "Cover Image",
        product_tags: "Related Products",` + parts[2];
        
  content = parts.join('admin: {');
  
  // also change "relationships" in TH
  content = content.replace(/relationships: "ความสัมพันธ์"/g, 'relationships: "บทความที่เกี่ยวข้อง"');
  
  fs.writeFileSync('src/i18n.ts', content);
  console.log("Updated i18n keys successfully.");
} else {
  console.log("Error: Expected 3 parts, got " + parts.length);
}
