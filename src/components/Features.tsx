import { BarChart3, Handshake, Network, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const features = [
  {
    name: 'Seamless Network',
    description: 'Connect businesses across industries, quickly find partners that match your goals.',
    icon: Network,
  },
  {
    name: 'Reliable Data',
    description: 'Clear identity verification and business profiles, building confidence in negotiations and transactions.',
    icon: ShieldCheck,
  },
  {
    name: 'Direct Business Negotiation',
    description: 'Reduce middlemen, increase profit with direct B2B communication channels.',
    icon: Handshake,
  },
  {
    name: 'Growth Analysis',
    description: 'Access insights, market overview, and business trends for accurate decision making.',
    icon: BarChart3,
  },
];

export function Features() {
  const { t } = useTranslation();
  return (
    <div className="bg-white pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#B87333]">{t('features.our_services')}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#0D1B3D] sm:text-4xl font-display">
            {t('features.why')}
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-500">
             
            
          </p>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl border-t border-slate-100">
        <dl className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 border-b border-slate-100">
          {features.map((feature, index) => (
            <div key={t(`features.list.${index}.name`, { defaultValue: feature.name })} className={`p-10 flex flex-col justify-start ${index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}>
              <dt className="flex flex-col items-start text-lg font-bold text-slate-800 mb-2">
                <feature.icon className={`h-8 w-8 mb-4 ${index % 2 === 0 ? 'text-[#B87333]' : 'text-[#0D1B3D]'}`} aria-hidden="true" />
                {t(`features.list.${index}.name`, { defaultValue: feature.name })}
              </dt>
              <dd className="text-slate-500 text-sm leading-relaxed">
                {t(`features.list.${index}.desc`, { defaultValue: feature.description })}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
