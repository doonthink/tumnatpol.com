import fs from 'fs';
let content = fs.readFileSync('src/admin/membership/MembershipForm.tsx', 'utf8');

content = content.replace(
  "const [member, setMember] = useState<any>(null);",
  "const [member, setMember] = useState<any>(null);\n  const [packages, setPackages] = useState<any[]>([]);"
);

content = content.replace(
  "useEffect(() => {",
  `useEffect(() => {
    fetch('/api/packages').then(res => res.json()).then(data => setPackages(data));
  }, []);

  useEffect(() => {`
);

content = content.replace(
  "setMember({ name: '', email: '', package: 'Basic', status: 'Active', login: 'Just now', joined: new Date().toISOString().split('T')[0] });",
  "setMember({ name: '', email: '', package: '', status: 'Active', login: 'Just now', joined: new Date().toISOString().split('T')[0] });"
);

content = content.replace(
  /<select value=\{member\.package\} onChange=\{e => setMember\(\{\.\.\.member, package: e\.target\.value\}\)\} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">\s*<option value="Basic">Basic<\/option>\s*<option value="Premium">Premium<\/option>\s*<option value="Enterprise">Enterprise<\/option>\s*<\/select>/,
  `<select value={member.package || (packages[0]?.name || '')} onChange={e => setMember({...member, package: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            {packages.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>`
);

// We need to fix the default package value so it's not empty string if packages are loaded after.
content = content.replace(
  "if (!member) return <div className=\"p-8\">Loading...</div>;",
  `if (!member) return <div className="p-8">Loading...</div>;

  // Initialize package if it's new and packages are loaded
  if (id === 'new' && !member.package && packages.length > 0) {
    setMember({ ...member, package: packages[0].name });
    return <div className="p-8">Loading...</div>; // wait for re-render
  }`
);

fs.writeFileSync('src/admin/membership/MembershipForm.tsx', content);
