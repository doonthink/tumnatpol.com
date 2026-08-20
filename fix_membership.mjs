import fs from 'fs';

let content = fs.readFileSync('src/admin/membership/MembershipList.tsx', 'utf8');

// Replace initial members with empty array
content = content.replace(/const initialMembers = \[[\s\S]*?\];/, 'const initialMembers: any[] = [];');

// Add "No members" UI
const emptyState = `
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    ยังไม่มีข้อมูลสมาชิก
                  </td>
                </tr>
              )}
`;
content = content.replace(/<tbody className="divide-y divide-slate-100">/, '<tbody className="divide-y divide-slate-100">' + emptyState);

// Update stats to count actual members
content = content.replace(/<h3 className="text-2xl font-bold text-slate-900">14,295<\/h3>/, '<h3 className="text-2xl font-bold text-slate-900">{members.length}</h3>');
content = content.replace(/<h3 className="text-2xl font-bold text-slate-900">1,240<\/h3>/, '<h3 className="text-2xl font-bold text-slate-900">{members.filter(m => m.status === "Active").length}</h3>');
content = content.replace(/<h3 className="text-2xl font-bold text-slate-900">45<\/h3>/, '<h3 className="text-2xl font-bold text-slate-900">{members.filter(m => m.status === "Pending").length}</h3>');
content = content.replace(/<h3 className="text-2xl font-bold text-slate-900">12<\/h3>/, '<h3 className="text-2xl font-bold text-slate-900">{members.filter(m => m.status === "Suspended").length}</h3>');
content = content.replace(/14,295<\/span> members/, '{members.length}</span> members');
content = content.replace(/<span className="font-medium text-slate-900">1<\/span> to <span className="font-medium text-slate-900">5<\/span>/, '<span className="font-medium text-slate-900">{members.length > 0 ? 1 : 0}</span> to <span className="font-medium text-slate-900">{members.length}</span>');


// Update addMember function
const newAddMember = `
  const addMember = () => {
    const name = prompt("Enter member name:");
    if (!name) return;
    const email = name.toLowerCase().replace(/\\s+/g, '') + "@example.com";
    const newMember = {
      id: Date.now().toString(),
      name,
      email,
      package: 'Free',
      status: 'Active',
      login: 'Just now',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setMembers([newMember, ...members]);
  };
`;
content = content.replace(/const addMember = \(\) => \{[\s\S]*?\};/, newAddMember.trim());

// Remove alerts
content = content.replace(/onClick=\{\(\) => alert\("[^"]+"\)\}/g, 'onClick={() => {}}');

fs.writeFileSync('src/admin/membership/MembershipList.tsx', content);
console.log("Updated MembershipList.tsx");
