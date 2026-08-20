import fs from 'fs';

function addQuillFonts(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('Quill.import(\'formats/font\')')) return;

  const importRegex = /import ReactQuill from 'react-quill-new';\nimport 'react-quill-new\/dist\/quill.snow.css';/;
  
  const replacements = `import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'noto-sans-thai', 'prompt', 'anuphan'];
Quill.register(Font, true);

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': Font.whitelist }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};`;

  content = content.replace(importRegex, replacements);

  content = content.replace(/<ReactQuill[\s\S]*?className="[^"]*"/, (match) => {
    return match.replace('<ReactQuill ', '<ReactQuill modules={quillModules} ');
  });

  fs.writeFileSync(filePath, content);
}

addQuillFonts('src/admin/pages/PageForm.tsx');
addQuillFonts('src/admin/blogs/BlogForm.tsx');
