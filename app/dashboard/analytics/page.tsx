import { createClient } from '@/lib/supabase/server';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { ShieldAlert, ShieldCheck, ScanLine } from 'lucide-react';

export default async function AnalyticsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: scans } = await supabase
    .from('scans')
    .select('verdict, category, confidence, created_at')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: true });

  const total = scans?.length ?? 0;
  const scamCount = scans?.filter((s) => s.verdict === 'scam').length ?? 0;
  const genuineCount = scans?.filter((s) => s.verdict === 'genuine').length ?? 0;
  const suspiciousCount = scans?.filter((s) => s.verdict === 'suspicious').length ?? 0;

  const categoryCounts: Record<string, number> = {};
  scans
    ?.filter((s) => s.verdict === 'scam' && s.category)
    .forEach((s) => {
      categoryCounts[s.category!] = (categoryCounts[s.category!] || 0) + 1;
    });

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
  }));

  const verdictData = [
    { name: 'Scam', value: scamCount, color: '#F0665E' },
    { name: 'Uncertain', value: suspiciousCount, color: '#F4B860' },
    { name: 'Genuine', value: genuineCount, color: '#3DBD8B' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <h1 className="font-display text-2xl font-semibold mb-1 text-text">Analytics</h1>
      <p className="text-sm text-muted mb-8">Your scam-detection track record.</p>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <StatCard label="Total scans" value={total} icon={<ScanLine className="w-4 h-4 text-brandDeep" />} iconBg="bg-brandDim" />
        <StatCard label="Scams caught" value={scamCount} icon={<ShieldAlert className="w-4 h-4 text-danger" />} iconBg="bg-dangerDim" />
        <StatCard label="Confirmed genuine" value={genuineCount} icon={<ShieldCheck className="w-4 h-4 text-safe" />} iconBg="bg-safeDim" />
      </div>

      <AnalyticsCharts verdictData={verdictData} categoryData={categoryData} total={total} />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="bg-panel border border-border rounded-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-muted">{label}</p>
        <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
      </div>
      <p className="font-display text-3xl font-semibold text-text">{value}</p>
    </div>
  );
}
