import fs from 'fs';

// 1. DynamicPage tags
let dp = fs.readFileSync('src/pages/DynamicPage.tsx', 'utf-8');
let tagIndex = dp.indexOf('{page.tags && (');
if (tagIndex !== -1) {
  let end = dp.indexOf(')}', tagIndex);
  let end2 = dp.indexOf(')}', end + 2); // to cover the closing of && ()
  let nextDiv = dp.indexOf('</div>', tagIndex); // actually we can just slice from {page.tags to the end of that block
  dp = dp.substring(0, tagIndex) + dp.substring(dp.indexOf(')}', dp.indexOf(')}', dp.indexOf(')}', tagIndex) + 1) + 1) + 2);
  // Just use regex carefully
}
// It's safer to use manual replacement:
dp = fs.readFileSync('src/pages/DynamicPage.tsx', 'utf-8');
const tagBlock = `{page.tags && (
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-500 mr-2">แท็ก:</span>
              {page.tags.split(',').map((tag: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}`;
dp = dp.replace(tagBlock, '');
fs.writeFileSync('src/pages/DynamicPage.tsx', dp);

