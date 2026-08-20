import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye, Download, Calendar, ArrowUpRight, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BusinessCheckList() {
  const { t } = useTranslation();
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedCheck, setSelectedCheck] = useState<any>(null);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [invoiceSentMessage, setInvoiceSentMessage] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleUpdateStatus = async (status: string) => {
    setIsUpdatingStatus(true);
    try {
      // Remove member from updated object to avoid saving it back to businessChecks.json
      const { member, ...checkDataToSave } = selectedCheck;
      const updatedCheckData = { ...checkDataToSave, paymentStatus: status };
      
      const response = await fetch(`/api/businessChecks/${selectedCheck.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCheckData)
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      const updatedCheckWithMember = { ...updatedCheckData, member: selectedCheck.member };
      setSelectedCheck(updatedCheckWithMember);
      setChecks(prev => prev.map(c => c.id === selectedCheck.id ? updatedCheckWithMember : c));
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!selectedCheck?.member?.email) {
      alert('ไม่พบอีเมลของสมาชิกรายนี้');
      return;
    }
    
    setIsSendingInvoice(true);
    setInvoiceSentMessage('');
    
    try {
      // Simulate API call to send invoice
      await new Promise(resolve => setTimeout(resolve, 1500));
      setInvoiceSentMessage('ส่งใบแจ้งหนี้ไปยังอีเมลสำเร็จแล้ว');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการส่งใบแจ้งหนี้');
    } finally {
      setIsSendingInvoice(false);
      setTimeout(() => setInvoiceSentMessage(''), 3000);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/businessChecks').then(res => res.json()),
      fetch('/api/members').then(res => res.json())
    ])
      .then(([checksData, membersData]) => {
        const checksArray = Array.isArray(checksData) ? checksData : [];
        const membersArray = Array.isArray(membersData) ? membersData : [];
        
        // Enrich checks with member data
        const enrichedChecks = checksArray.map(check => {
          const member = membersArray.find(m => m.id === check.member_id);
          return { ...check, member };
        });
        
        setChecks(enrichedChecks);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const filteredChecks = checks.filter(check => {
    const term = searchTerm.toLowerCase();
    const memberName = (check.memberName || check.member?.name || '').toLowerCase();
    const memberEmail = (check.memberEmail || check.member?.email || '').toLowerCase();
    const memberPhone = (check.memberPhone || check.member?.phone || '').toLowerCase();
    
    return (
      check.companyName?.toLowerCase().includes(term) ||
      check.industry?.toLowerCase().includes(term) ||
      memberName.includes(term) ||
      memberEmail.includes(term) ||
      memberPhone.includes(term)
    );
  });

  const sortedChecks = [...filteredChecks].sort((a, b) => {
    if (sortBy === 'date_desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'date_asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'company_asc') {
      return (a.companyName || '').localeCompare(b.companyName || '');
    } else if (sortBy === 'company_desc') {
      return (b.companyName || '').localeCompare(a.companyName || '');
    }
    return 0;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">รายการประเมินธุรกิจ (Business Check)</h1>
          <p className="text-sm text-slate-500 mt-1">ข้อมูลที่ลูกค้าส่งมาประเมินปัญหาธุรกิจ</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อบริษัท..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-500 whitespace-nowrap">จัดเรียง:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-sm bg-white"
            >
              <option value="date_desc">วันที่ส่ง (ใหม่ล่าสุด)</option>
              <option value="date_asc">วันที่ส่ง (เก่าที่สุด)</option>
              <option value="company_asc">ชื่อบริษัท (A-Z)</option>
              <option value="company_desc">ชื่อบริษัท (Z-A)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">บริษัท</th>
                <th className="px-6 py-4">อุตสาหกรรม</th>
                <th className="px-6 py-4">ปัญหาที่พบ</th>
                <th className="px-6 py-4">สถานะชำระเงิน</th>
                <th className="px-6 py-4">วันที่ส่ง</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : sortedChecks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                sortedChecks.map((check) => (
                  <tr key={check.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{check.companyName}</div>
                      <div className="text-slate-500 text-xs mt-1">
                        {check.memberName || check.member?.name || check.member_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {check.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={check.issues}>
                      {check.issues}
                    </td>
                    <td className="px-6 py-4">
                      {check.paymentStatus === 'Paid' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">ชำระแล้ว</span>
                      ) : check.paymentStatus === 'Cancelled' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">ยกเลิก</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">ยังไม่ชำระ</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(check.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedCheck(check)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">รายละเอียดข้อมูลธุรกิจ</h2>
              <button 
                onClick={() => setSelectedCheck(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">ชื่อบริษัท / องค์กร</h3>
                  <p className="text-slate-900 font-medium">{selectedCheck.companyName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">ประเภทธุรกิจ / อุตสาหกรรม</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedCheck.industry}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">ชื่อผู้ส่งข้อมูล</h3>
                  <p className="text-slate-900">
                    {selectedCheck.memberName || selectedCheck.member?.name || selectedCheck.member_id}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">เบอร์โทรศัพท์</h3>
                  <p className="text-slate-900">{selectedCheck.memberPhone || selectedCheck.member?.phone || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">อีเมล</h3>
                  <p className="text-slate-900">{selectedCheck.memberEmail || selectedCheck.member?.email || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">วันที่ส่งข้อมูล</h3>
                  <p className="text-slate-900">{new Date(selectedCheck.createdAt).toLocaleString('th-TH')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">สถานะการชำระเงิน</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedCheck.paymentStatus || 'Pending'}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      disabled={isUpdatingStatus}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="Paid">ชำระแล้ว (Paid)</option>
                      <option value="Pending">ยังไม่ชำระ (Pending)</option>
                      <option value="Cancelled">ยกเลิก (Cancel)</option>
                    </select>
                    {isUpdatingStatus && <span className="text-xs text-slate-400">กำลังอัปเดต...</span>}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-medium text-slate-500 mb-2">ปัญหาที่พบในปัจจุบัน หรือสิ่งที่ต้องการให้ช่วยเหลือ</h3>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap text-sm leading-relaxed border border-slate-100">
                  {selectedCheck.issues}
                </div>
              </div>

            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSendInvoice}
                  disabled={isSendingInvoice || !selectedCheck.member?.email}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isSendingInvoice ? 'กำลังส่ง...' : 'แจ้งหนี้ค่าใช้จ่าย'}
                </button>
                {invoiceSentMessage && (
                  <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {invoiceSentMessage}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedCheck(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
