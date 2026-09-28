'use client';

import { useState } from 'react';
import { AlertTriangle, ShieldCheck, HelpCircle, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Scan {
  id: string;
  verdict: 'scam' | 'suspicious' | 'genuine';
  confidence: number;
  category: string | null;
  reasoning: string;
  created_at: string;
}

const verdictMeta = {
  scam: { color: 'text-danger', bg: 'bg-dangerDim', icon: AlertTriangle, label: 'Scam' },
  suspicious: { color: 'text-warn', bg: 'bg-warnDim', icon: HelpCircle, label: 'Uncertain' },
  genuine: { color: 'text-safe', bg: 'bg-safeDim', icon: ShieldCheck, label: 'Genuine' },
};

export default function HistoryList({ initialScans }: { initialScans: Scan[] }) {
  const [scans, setScans] = useState(initialScans);
  const supabase = createClient();

  async function handleDelete(id: string) {
    setScans((prev) => prev.filter((s) => s.id !== id));
    await supabase.from('scans').delete().eq('id', id);
  }

  if (scans.length === 0) {
    return (
      <div className="bg-panel border border-dashed border-border rounded-card py-16 text-center shadow-card">
        <p className="text-sm text-muted">No scans yet. Your first one will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scans.map((scan) => {
        const meta = verdictMeta[scan.verdict];
        const Icon = meta.icon;
        return (
          <div key={scan.id} className="bg-panel border border-border rounded-2xl p-4 flex items-start gap-4 shadow-card">
            <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${meta.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
                <span className="text-xs text-muted">{scan.confidence}%</span>
                {scan.category && (
                  <span className="text-xs text-muted bg-panelLight px-2.5 py-0.5 rounded-pill">
                    {scan.category.replace('_', ' ')}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted line-clamp-2">{scan.reasoning}</p>
              <p className="text-xs text-muted/60 mt-1.5">
                {new Date(scan.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(scan.id)}
              className="text-muted hover:text-danger transition-colors p-2 rounded-xl hover:bg-dangerDim focus-ring shrink-0"
              aria-label="Delete scan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
