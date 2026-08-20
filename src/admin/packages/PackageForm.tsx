import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft } from 'lucide-react';

export function PackageForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    if (id === 'new') {
      setPkg({
        name: '',
        description: '',
        price: 1000,
        duration: '1 Month',
        status: 'Active',
        isFeatured: false,
        users: 0
      });
    } else if (id) {
      fetch('/api/packages')
        .then(res => res.json())
        .then(data => {
          const found = data.find((x: any) => String(x.id) === String(id));
          if (found) setPkg(found);
        });
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    try {
      if (id === 'new') {
        await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pkg)
        });
      } else {
        await fetch('/api/packages/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pkg)
        });
      }
      navigate('/admin/packages');
    } catch (err) {
      console.error(err);
    }
  };

  if (!pkg) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/packages')} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{id === 'new' ? 'Add New Package' : `Manage Package: ${pkg.name}`}</h1>
      </div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Package Name</label>
          <input 
            type="text" 
            value={pkg.name} 
            onChange={e => setPkg({...pkg, name: e.target.value})} 
            required
            className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            value={pkg.description} 
            onChange={e => setPkg({...pkg, description: e.target.value})} 
            rows={3}
            className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price (THB)</label>
            <input 
              type="number" 
              value={pkg.price} 
              onChange={e => setPkg({...pkg, price: Number(e.target.value)})} 
              required
              className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
            <input 
              type="text" 
              value={pkg.duration} 
              onChange={e => setPkg({...pkg, duration: e.target.value})} 
              placeholder="e.g., 1 Month, 1 Year"
              required
              className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select 
              value={pkg.status} 
              onChange={e => setPkg({...pkg, status: e.target.value})} 
              className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={pkg.isFeatured} 
                onChange={e => setPkg({...pkg, isFeatured: e.target.checked})} 
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Featured Package</span>
            </label>
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-[#0D1B3D] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0a152e]">
            <Save className="w-4 h-4" /> Save Package
          </button>
        </div>
      </form>
    </div>
  );
}
