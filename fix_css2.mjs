import fs from 'fs';
let content = fs.readFileSync('src/index.css', 'utf-8');

const dropdownCss = `
/* Quill Font Dropdown Labels */
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="noto-sans-thai"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="noto-sans-thai"]::before {
  content: 'Noto Sans Thai' !important;
  font-family: 'Noto Sans Thai', sans-serif !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="prompt"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="prompt"]::before {
  content: 'Prompt' !important;
  font-family: 'Prompt', sans-serif !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="anuphan"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="anuphan"]::before {
  content: 'Anuphan' !important;
  font-family: 'Anuphan', sans-serif !important;
}

/* Fix blank default if sans-serif is default */
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
  content: 'Sans Serif' !important;
}
`;

content += dropdownCss;
fs.writeFileSync('src/index.css', content);
