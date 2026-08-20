import fs from 'fs';

function replaceEditor(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace CKEditor imports
    content = content.replace(/import { CKEditor } from '@ckeditor\/ckeditor5-react';\nimport ClassicEditor from '@ckeditor\/ckeditor5-build-classic';/g, 
        `import { Editor } from '@tinymce/tinymce-react';`);

    // Replace CKEditor jsx
    const tinyMceJSX = `<div className="mb-12 editor-container">
                    <Editor
                        apiKey="no-api-key"
                        value={lang === 'en' ? (formData as any).content_en || '' : formData.content || ''}
                        onEditorChange={(content) => {
                            setFormData(prev => ({ ...prev, [lang === 'en' ? 'content_en' : 'content']: content }));
                        }}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | fontfamily fontsize | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code | help',
                            font_family_formats: 'Anuphan=Anuphan, sans-serif; Noto Sans Thai=Noto Sans Thai, sans-serif; UID Awakat=UID Awakat, sans-serif; Prompt=Prompt, sans-serif; Arial=arial,helvetica,sans-serif; Courier New=courier new,courier; Verdana=verdana,geneva;',
                            content_style: 'body { font-family: "Noto Sans Thai", sans-serif; font-size:14px }',
                            extended_valid_elements: '*[*]'
                        }}
                    />
                  </div>`;

    content = content.replace(/<div className="mb-12 editor-container">\s*<CKEditor[\s\S]*?<\/div>/g, tinyMceJSX);

    fs.writeFileSync(filePath, content);
}

replaceEditor('src/admin/blogs/BlogForm.tsx');
replaceEditor('src/admin/pages/PageForm.tsx');
