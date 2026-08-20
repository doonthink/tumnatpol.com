import { Search, Filter, Plus, Edit, Trash2, CheckCircle, XCircle, DollarSign, Clock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function PackageList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [packages, setPackages] = useState<any[]>([]);

  const [packageToDelete, setPackageToDelete] = useState<any>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!packageToDelete) return;
    try {
      const res = await fetch(`/api/packages/${packageToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPackages(prev => prev.filter(p => String(p.id) !== String(packageToDelete.id)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPackageToDelete(null);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const term = searchTerm.toLowerCase();
    const nameMatch = pkg.name?.toLowerCase().includes(term);
    const priceMatch = String(pkg.price).toLowerCase().includes(term);
    const durationMatch = pkg.duration?.toLowerCase().includes(term);
    return nameMatch || priceMatch || durationMatch;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("admin.package_management")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("admin.package_desc")}</p>
        </div>
        <button onClick={() => navigate('/admin/packages/new')} className="px-4 py-2 bg-[#0D1B3D] text-white rounded-lg text-sm font-medium hover:bg-[#0a152e] transition-colors shadow-md flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, price, or duration..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => alert("Filter functionality coming soon")} className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">{t("admin.package_details")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.pricing")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.duration")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.status")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.active_users")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${pkg.isFeatured ? 'bg-[#B87333]/10 text-[#B87333]' : 'bg-slate-100 text-slate-500'}`}>
                        {pkg.isFeatured ? <Star className="w-5 h-5 fill-current" /> : <Star className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {pkg.name}
                          {pkg.isFeatured && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#B87333] text-white uppercase tracking-wider">{t("admin.featured")}</span>}
                        </div>
                        <div className="text-xs text-slate-500 max-w-xs mt-0.5">{pkg.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-900 font-bold">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      {pkg.price === 0 ? 'Free' : pkg.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                      {pkg.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      pkg.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {pkg.status === 'Active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {pkg.users.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/admin/packages/${pkg.id}`)} className="p-1.5 text-slate-400 hover:text-[#0D1B3D] transition-colors rounded-lg hover:bg-slate-100" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setPackageToDelete(pkg)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">ยืนยันการลบแพ็กเกจ</h3>
            <p className="text-sm text-slate-600 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบแพ็กเกจ <span className="font-semibold text-slate-900">"{packageToDelete.name}"</span> ออกจากระบบ? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPackageToDelete(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
