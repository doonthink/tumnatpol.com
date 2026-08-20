import fs from 'fs';

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace imports
    content = content.replace(/import ReactQuill, { Quill } from 'react-quill-new';\nimport 'react-quill-new\/dist\/quill.snow.css';/g, 
        `import { CKEditor } from '@ckeditor/ckeditor5-react';\nimport ClassicEditor from '@ckeditor/ckeditor5-build-classic';`);
    
    // Remove Quill Font logic
    content = content.replace(/const Font = Quill.import\('formats\/font'\) as any;\nFont.whitelist = \['sans-serif', 'noto-sans-thai', 'prompt', 'anuphan'\];\nQuill.register\(Font, true\);\n/g, '');

    // Remove quillModules definition
    content = content.replace(/const quillModules = {[\s\S]*?};\n/g, '');

    // Replace ReactQuill in JSX (BlogForm)
    content = content.replace(/<ReactQuill modules={quillModules}\s*theme="snow"\s*value={lang === 'en' \? \(formData as any\).content_en \|\| '' : formData.content \|\| ''}\s*onChange={\(content: string\) => setFormData\(prev => \({ \.\.\.prev, \[lang === 'en' \? 'content_en' : 'content'\]: content }\)\)}\s*className="h-96 mb-12"\s*\/>/g, 
        `<div className="mb-12 editor-container">
                    <CKEditor
                        editor={ ClassicEditor }
                        data={lang === 'en' ? (formData as any).content_en || '' : formData.content || ''}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setFormData(prev => ({ ...prev, [lang === 'en' ? 'content_en' : 'content']: data }));
                        } }
                    />
                  </div>`);

    // Replace ReactQuill in JSX (PageForm)
    content = content.replace(/<ReactQuill modules={quillModules}\s*theme="snow"\s*value={lang === 'en' \? \(formData as any\).content_en \|\| '' : formData.content \|\| ''}\s*onChange={\(content: string\) => setFormData\(prev => \({ \.\.\.prev, \[lang === 'en' \? 'content_en' : 'content'\]: content }\)\)}\s*className="h-64 mb-12"\s*\/>/g, 
        `<div className="mb-12 editor-container">
                    <CKEditor
                        editor={ ClassicEditor }
                        data={lang === 'en' ? (formData as any).content_en || '' : formData.content || ''}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setFormData(prev => ({ ...prev, [lang === 'en' ? 'content_en' : 'content']: data }));
                        } }
                    />
                  </div>`);

    fs.writeFileSync(filePath, content);
}

replaceInFile('src/admin/blogs/BlogForm.tsx');
replaceInFile('src/admin/pages/PageForm.tsx');
