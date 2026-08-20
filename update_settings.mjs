import fs from 'fs';
let content = fs.readFileSync('src/admin/settings/SettingsPage.tsx', 'utf8');

const placeholderBlock = `{['email', 'api', 'backup', 'logs'].includes(activeTab) && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  This module is available in the enterprise edition and can be configured as per specific requirements.
                </p>
              </div>
            )}`;

const newTabsCode = `            {activeTab === 'email' && (
              <div className="p-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">ตั้งค่า Email (SMTP)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host</label>
                      <input type="text" defaultValue="smtp.gmail.com" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Port</label>
                      <input type="text" defaultValue="587" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Username</label>
                      <input type="text" defaultValue="doonthink@gmail.com" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Password</label>
                      <input type="password" defaultValue="********" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sender Email</label>
                      <input type="email" defaultValue="noreply@biztoptier.com" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sender Name</label>
                      <input type="text" defaultValue="BIZ TOP TIER System" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Test Connection</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'api' && (
              <div className="p-6 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">ตั้งค่าการเชื่อมต่อ API ภายนอก</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Analytics Measurement ID</label>
                      <input type="text" defaultValue="G-ABC123XYZ0" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                      <p className="text-xs text-slate-500 mt-1">ตัวอย่าง: G-XXXXXXX</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Facebook Pixel ID</label>
                      <input type="text" defaultValue="123456789012345" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">LINE Messaging API Channel Access Token</label>
                      <input type="password" defaultValue="************************" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stripe Public Key</label>
                      <input type="text" defaultValue="pk_test_51NxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stripe Secret Key</label>
                      <input type="password" defaultValue="sk_test_51NxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'backup' && (
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                  <h2 className="text-lg font-bold text-slate-900">สำรองและกู้คืนข้อมูล (Backup & Restore)</h2>
                  <button className="px-4 py-2 bg-[#B87333] text-white rounded-lg text-sm font-medium hover:bg-[#9e632c] transition-colors shadow-sm flex items-center gap-2">
                    <Database className="w-4 h-4" /> สร้างไฟล์สำรองข้อมูลเดี๋ยวนี้
                  </button>
                </div>
                
                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">วันที่ / เวลา</th>
                        <th className="px-6 py-4">ชื่อไฟล์</th>
                        <th className="px-6 py-4">ขนาดไฟล์</th>
                        <th className="px-6 py-4">สถานะ</th>
                        <th className="px-6 py-4 text-right">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">2026-08-09 02:00:00</td>
                        <td className="px-6 py-4 font-medium text-[#0D1B3D]">backup_20260809.zip</td>
                        <td className="px-6 py-4">42.5 MB</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">สำเร็จ</span></td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[#B87333] hover:text-[#8f5927] font-medium text-sm mr-4">ดาวน์โหลด</button>
                          <button className="text-rose-600 hover:text-rose-800 font-medium text-sm">ลบ</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">2026-08-08 02:00:00</td>
                        <td className="px-6 py-4 font-medium text-[#0D1B3D]">backup_20260808.zip</td>
                        <td className="px-6 py-4">42.1 MB</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">สำเร็จ</span></td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[#B87333] hover:text-[#8f5927] font-medium text-sm mr-4">ดาวน์โหลด</button>
                          <button className="text-rose-600 hover:text-rose-800 font-medium text-sm">ลบ</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">2026-08-07 02:00:00</td>
                        <td className="px-6 py-4 font-medium text-[#0D1B3D]">backup_20260807.zip</td>
                        <td className="px-6 py-4">41.8 MB</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">สำเร็จ</span></td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[#B87333] hover:text-[#8f5927] font-medium text-sm mr-4">ดาวน์โหลด</button>
                          <button className="text-rose-600 hover:text-rose-800 font-medium text-sm">ลบ</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'logs' && (
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                  <h2 className="text-lg font-bold text-slate-900">บันทึกกิจกรรม (Activity Logs)</h2>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
                     ดาวน์โหลดบันทึก (CSV)
                  </button>
                </div>
                
                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">วันที่ / เวลา</th>
                        <th className="px-6 py-4">ผู้ใช้</th>
                        <th className="px-6 py-4">การกระทำ (Action)</th>
                        <th className="px-6 py-4">โมดูล</th>
                        <th className="px-6 py-4">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">วันนี้ 09:30 น.</td>
                        <td className="px-6 py-4 font-medium text-[#0D1B3D]">Super Admin (admin)</td>
                        <td className="px-6 py-4 text-emerald-600">เข้าสู่ระบบสำเร็จ</td>
                        <td className="px-6 py-4">Authentication</td>
                        <td className="px-6 py-4 font-mono text-xs">171.97.102.45</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">เมื่อวาน 15:45 น.</td>
                        <td className="px-6 py-4 font-medium text-[#0D1B3D]">Marketing Team (mkt01)</td>
                        <td className="px-6 py-4">แก้ไขแบนเนอร์ "โปรโมชั่นสิงหาคม"</td>
                        <td className="px-6 py-4">Banners</td>
                        <td className="px-6 py-4 font-mono text-xs">171.97.102.45</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">เมื่อวาน 14:20 น.</td>
                        <td className="px-6 py-4 font-medium text-[#0D1B3D]">Content Creator (content02)</td>
                        <td className="px-6 py-4">เพิ่มบทความใหม่ "เทรนด์ธุรกิจ 2026"</td>
                        <td className="px-6 py-4">Blogs</td>
                        <td className="px-6 py-4 font-mono text-xs">118.174.120.8</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">เมื่อวาน 10:15 น.</td>
                        <td className="px-6 py-4 font-medium text-[#0D1B3D]">Super Admin (admin)</td>
                        <td className="px-6 py-4">อัพเดตการตั้งค่าระบบ (General)</td>
                        <td className="px-6 py-4">Settings</td>
                        <td className="px-6 py-4 font-mono text-xs">171.97.102.45</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}`;

content = content.replace(placeholderBlock, newTabsCode);

fs.writeFileSync('src/admin/settings/SettingsPage.tsx', content);
