import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft } from 'lucide-react';

export function MembershipForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/packages').then(res => res.json()).then(data => setPackages(data));
  }, []);

  useEffect(() => {
    if (id === 'new') {
      setMember({ name: '', email: '', package: '', status: 'Active', login: 'Just now', joined: new Date().toISOString().split('T')[0] });
    } else if (id) {
      fetch('/api/members')
        .then(res => res.json())
        .then(data => {
          const m = data.find((x: any) => String(x.id) === String(id));
          if (m) setMember(m);
        });
    }
  }, [id]);

  const handleSave = async (e: import('react').FormEvent) => {
    e.preventDefault();
    if (!member) return;
    try {
      if (id === 'new') {
        await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member)
        });
      } else {
        await fetch('/api/members/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(member)
        });
      }
      navigate('/admin/membership');
    } catch (err) {
      console.error(err);
    }
  };

  if (!member) return <div className="p-8">Loading...</div>;

  // Initialize package if it's new and packages are loaded
  if (id === 'new' && !member.package && packages.length > 0) {
    setMember({ ...member, package: packages[0].name });
    return <div className="p-8">Loading...</div>; // wait for re-render
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/membership')} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{id === "new" ? "Add New Member" : `Manage Member: ${member.name}`}</h1>
      </div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input type="text" value={member.name} onChange={e => setMember({...member, name: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" value={member.email} onChange={e => setMember({...member, email: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Package</label>
          <select value={member.package || (packages[0]?.name || '')} onChange={e => setMember({...member, package: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            {packages.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select value={member.status} onChange={e => setMember({...member, status: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-[#0D1B3D] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0a152e]">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
