import { renderToString } from 'react-dom/server';
import React from 'react';
import * as Lucide from 'lucide-react';

const icons = ['Activity', 'Globe', 'Smartphone', 'Megaphone', 'Laptop', 'CheckCircle2'];
icons.forEach(name => {
  const Icon = Lucide[name];
  const svg = renderToString(React.createElement(Icon, { className: "PLACEHOLDER_CLASS" }));
  console.log(`--- ${name} ---`);
  console.log(svg);
});
