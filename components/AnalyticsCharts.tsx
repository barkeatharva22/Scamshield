'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface VerdictDatum {
  name: string;
  value: number;
  color: string;
}

interface CategoryDatum {
  name: string;
  value: number;
}

export default function AnalyticsCharts({
  verdictData,
  categoryData,
  total,
}: {
  verdictData: VerdictDatum[];
  categoryData: CategoryDatum[];
  total: number;
}) {
  const hasData = verdictData.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <div className="bg-panel border border-dashed border-border rounded-card py-16 text-center shadow-card">
        <p className="text-sm text-muted">Scan a few messages to see your analytics here.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Donut ring chart — matches the reference's central-number ring style */}
      <div className="bg-panel border border-border rounded-card p-6 shadow-card">
        <p className="text-sm font-medium text-text mb-1">Verdict breakdown</p>
        <p className="text-xs text-muted mb-4">All scans, by outcome</p>
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={verdictData}
                dataKey="value"
                nameKey="name"
                innerRadius={68}
                outerRadius={92}
                paddingAngle={4}
                cornerRadius={8}
                startAngle={90}
                endAngle={-270}
              >
                {verdictData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #ECECE9',
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="font-display text-3xl font-semibold text-text">{total}</p>
            <p className="text-xs text-muted">Total scans</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-3">
          {verdictData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              {d.name} · {d.value}
            </div>
          ))}
        </div>
      </div>

      {/* Category bar chart */}
      <div className="bg-panel border border-border rounded-card p-6 shadow-card">
        <p className="text-sm font-medium text-text mb-1">Scam categories caught</p>
        <p className="text-xs text-muted mb-4">Which tricks show up most</p>
        {categoryData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center">
            <p className="text-xs text-muted">No scams flagged yet — good sign.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: '#8E8E92', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fill: '#8E8E92', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#FAFAF9' }}
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #ECECE9',
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="value" fill="#F0665E" radius={[0, 8, 8, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
