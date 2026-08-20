import fs from 'fs';

let content = fs.readFileSync('src/i18n.ts', 'utf8');

content = content.replace(
  /edit_post: "แก้ไขบทความ",/,
  'edit_post: "แก้ไขบทความ",\n        create_post: "เขียนบทความใหม่",'
);

content = content.replace(
  /edit_post: "Edit Post",/,
  'edit_post: "Edit Post",\n        create_post: "Create Post",'
);

fs.writeFileSync('src/i18n.ts', content);
