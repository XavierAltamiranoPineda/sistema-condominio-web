import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const KpiCard = ({ title, value, icon, trend, trendUp }: Props) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};
