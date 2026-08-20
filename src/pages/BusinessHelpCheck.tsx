import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Building2, User, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// Define types based on our backend models
interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  isFeatured: boolean;
}

export default function BusinessHelpCheck() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    issues: '',
    contactName: '',
    email: '',
    phone: '',
    packageId: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch packages on load
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        // Filter only active packages
        setPackages(data.filter((p: Package) => p.status === 'Active'));
      } catch (err) {
        console.error('Failed to fetch packages:', err);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePackageSelect = (id: string) => {
    setFormData(prev => ({ ...prev, packageId: id }));
    if (errors.packageId) {
      setErrors(prev => ({ ...prev, packageId: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'กรุณาระบุชื่อบริษัท';
    if (!formData.industry.trim()) newErrors.industry = 'กรุณาระบุประเภทธุรกิจ';
    if (!formData.issues.trim() || formData.issues.trim().length < 10) newErrors.issues = 'กรุณาระบุปัญหาที่พบ (อย่างน้อย 10 ตัวอักษร)';
    if (!formData.contactName.trim()) newErrors.contactName = 'กรุณาระบุชื่อผู้ติดต่อ';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    if (!formData.phone.trim() || formData.phone.trim().length < 9) newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    if (!formData.packageId) newErrors.packageId = 'กรุณาเลือกแพ็กเกจ';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/business-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
      }

      setIsSuccess(true);
      // Wait for a short moment to show success message, then redirect
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      alert(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
      setIsSubmitting(false);
    }
  };

  const selectedPackage = packages.find(p => p.id === formData.packageId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-[#0D1B3D] text-white py-20 md:py-32 relative overflow-hidden mt-16">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[20px] border-[#D4AF37]"></div>
          <div className="absolute bottom-10 -left-10 w-48 h-48 rounded-full border-[10px] border-white"></div>
        </div>

        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] font-semibold tracking-wider uppercase text-sm mb-4 block"
          >
            BIZ TOP TIER Enterprise
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
          >
            Business Help Check
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
          >
            วิเคราะห์ปัญหาเชิงลึกและยกระดับศักยภาพธุรกิจของคุณสู่มาตรฐานระดับ Top Tier
            ด้วยทีมงานผู้เชี่ยวชาญและแพลตฟอร์มบริหารจัดการครบวงจร
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 -mt-12 relative z-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-12 text-center shadow-xl border border-emerald-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-4xl font-bold text-[#0D1B3D] mb-4">บันทึกข้อมูลแล้ว</h2>
              <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
                ขอบคุณที่ไว้วางใจ BIZ TOP TIER Enterprise ทีมงานจะรีบติดต่อกลับเพื่อดำเนินการในขั้นตอนต่อไป
              </p>
              <p className="text-sm text-slate-500 animate-pulse">กำลังกลับสู่หน้าหลัก...</p>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Business Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                    <div className="p-3 bg-[#D4AF37]/10 rounded-2xl">
                      <Building2 className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0D1B3D]">1. ข้อมูลธุรกิจ</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">ชื่อบริษัท / องค์กร <span className="text-red-500">*</span></label>
                      <input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-xl border ${errors.companyName ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all bg-slate-50 focus:bg-white`}
                        placeholder="บริษัท เอบีซี จำกัด"
                      />
                      {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">ประเภทธุรกิจ / อุตสาหกรรม <span className="text-red-500">*</span></label>
                      <input
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-xl border ${errors.industry ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all bg-slate-50 focus:bg-white`}
                        placeholder="เช่น การผลิต, ไอที, ค้าปลีก"
                      />
                      {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700">ปัญหาที่พบในปัจจุบัน หรือสิ่งที่ต้องการให้ช่วยเหลือ <span className="text-red-500">*</span></label>
                      <textarea
                        name="issues"
                        value={formData.issues}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full p-4 rounded-xl border ${errors.issues ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all resize-none bg-slate-50 focus:bg-white`}
                        placeholder="อธิบายปัญหาที่คุณกำลังเผชิญอยู่ เพื่อให้เราช่วยวิเคราะห์..."
                      />
                      {errors.issues && <p className="text-sm text-red-500">{errors.issues}</p>}
                    </div>
                  </div>
                </motion.div>

                {/* Section 2: Contact Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                    <div className="p-3 bg-[#D4AF37]/10 rounded-2xl">
                      <User className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0D1B3D]">2. ข้อมูลผู้ติดต่อ</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                      <input
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-xl border ${errors.contactName ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all bg-slate-50 focus:bg-white`}
                        placeholder="สมชาย ใจดี"
                      />
                      {errors.contactName && <p className="text-sm text-red-500">{errors.contactName}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">อีเมล <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all bg-slate-50 focus:bg-white`}
                        placeholder="contact@company.com"
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all bg-slate-50 focus:bg-white md:w-1/2`}
                        placeholder="0812345678"
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>
                  </div>
                </motion.div>

                {/* Section 3: Package Selection */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                    <div className="p-3 bg-[#D4AF37]/10 rounded-2xl">
                      <CreditCard className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0D1B3D]">3. เลือกแพ็กเกจการวิเคราะห์</h2>
                  </div>
                  
                  {isLoadingPackages ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                      {packages.map((pkg) => (
                        <div 
                          key={pkg.id} 
                          onClick={() => handlePackageSelect(pkg.id)}
                          className={`relative flex flex-col p-8 cursor-pointer rounded-2xl border-2 transition-all duration-300 ${
                            formData.packageId === pkg.id 
                              ? 'border-[#D4AF37] bg-white shadow-xl shadow-[#D4AF37]/10 scale-[1.02] z-10' 
                              : 'border-slate-100 bg-slate-50 hover:border-[#D4AF37]/50 hover:bg-white'
                          }`}
                        >
                          {formData.packageId === pkg.id && (
                            <div className="absolute top-4 right-4 text-[#D4AF37]">
                              <CheckCircle2 className="w-6 h-6 fill-current text-white" />
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-4 pr-8">
                            <h3 className="text-xl font-bold text-[#0D1B3D]">{pkg.name}</h3>
                            {pkg.isFeatured && (
                              <span className="bg-[#D4AF37] text-white text-xs px-3 py-1.5 rounded-full font-bold tracking-wide uppercase shadow-sm">
                                แนะนำ
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm mb-8 flex-grow leading-relaxed">{pkg.description}</p>
                          <div className="mt-auto pt-6 border-t border-slate-100 flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-[#0D1B3D]">
                              {pkg.price.toLocaleString()}
                            </span>
                            <span className="text-slate-500 font-semibold">THB</span>
                            <span className="text-slate-400 text-sm ml-auto font-medium">/ {pkg.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.packageId && <p className="text-sm text-red-500 mt-4 font-medium">{errors.packageId}</p>}
                </motion.div>

                {/* Summary & Submit */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-[#0D1B3D] text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-[#1E3A8A] overflow-hidden relative"
                >
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3 relative z-10">
                    สรุปรายการ (Order Summary)
                  </h3>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-white/10 gap-6 relative z-10">
                    <div>
                      <p className="text-slate-400 text-sm font-semibold mb-2 tracking-wide uppercase">แพ็กเกจที่เลือก</p>
                      <p className="font-bold text-2xl">{selectedPackage ? selectedPackage.name : '-'}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-slate-400 text-sm font-semibold mb-2 tracking-wide uppercase">ยอดสุทธิ (รอชำระเงิน)</p>
                      <p className="font-black text-4xl text-[#D4AF37]">
                        {selectedPackage ? selectedPackage.price.toLocaleString() : '0'} THB
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative z-10 bg-[#D4AF37] hover:bg-white text-[#0D1B3D] font-bold py-5 px-8 rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg shadow-[0_0_40px_-10px_rgba(212,175,55,0.5)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        กำลังบันทึกข้อมูล...
                      </>
                    ) : (
                      'ยืนยันข้อมูลและดำเนินการต่อ'
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
