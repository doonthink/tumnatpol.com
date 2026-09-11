fetch('http://localhost:3000/api/pages').then(r => r.json()).then(pages => {
  const home = pages.find(p => p.slug === 'home');
  console.log(home);
});
