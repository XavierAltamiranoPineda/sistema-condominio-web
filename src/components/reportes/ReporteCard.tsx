import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  action: ReactNode;
}

export const ReporteCard = ({ title, description, icon, action }: Props) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow transition-shadow flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-slate-50 text-slate-700 rounded-xl mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-6 flex-grow">{description}</p>
      <div className="mt-auto">
        {action}
      </div>
    </div>
  );
};
