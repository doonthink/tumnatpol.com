import fs from 'fs';

let content = fs.readFileSync('src/lib/apiInterceptor.ts', 'utf-8');

content = content.replace(
  /window\.fetch = async \(input: RequestInfo \| URL, init\?: RequestInit\) => \{/,
  `Object.defineProperty(window, 'fetch', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: async (input: RequestInfo | URL, init?: RequestInit) => {`
);

content = content.replace(
  /  return originalFetch\(input, init\);\n\};\n\nconsole\.log\("🔥 Firebase API Interceptor registered!"\);/,
  `  return originalFetch(input, init);
  }
});

console.log("🔥 Firebase API Interceptor registered!");`
);

fs.writeFileSync('src/lib/apiInterceptor.ts', content);
