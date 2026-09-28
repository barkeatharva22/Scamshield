'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ScanDemo() {
  const [phase, setPhase] = useState<'scanning' | 'result'>('scanning');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('result'), 2400);
    const interval = setInterval(() => {
      setPhase('scanning');
      setTimeout(() => setPhase('result'), 2400);
    }, 6000);
    return () => {
      clearTimeout(t1);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative animate-floatSlow">
      <div className="relative bg-panel border border-border rounded-card p-5 overflow-hidden shadow-cardHover">
        {/* fake message bubble */}
        <div className="bg-panelLight border border-border rounded-2xl p-4 text-sm leading-relaxed text-text/90">
          <p className="text-xs text-muted mb-2 font-medium">SMS from: VM-SBIBNK</p>
          <p>
            Dear Customer, your A/C will be BLOCKED today. Update KYC immediately:
            <br />
            <span className="text-brandDeep font-medium">sbi-kyc-update.verify-now.in</span>
            <br />
            Reply with OTP to avoid suspension.
          </p>
        </div>

        {/* scan line */}
        {phase === 'scanning' && (
          <div className="absolute inset-x-5 top-5 bottom-5 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-brand/20 to-transparent animate-scan" />
          </div>
        )}

        {/* verdict */}
        <div
          className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 transition-all duration-500 ${
            phase === 'result'
              ? 'opacity-100 translate-y-0 border-danger/20 bg-dangerDim'
              : 'opacity-0 translate-y-2 border-transparent'
          }`}
        >
          <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-semibold text-danger text-sm mb-1">Likely a scam</p>
            <p className="text-xs text-muted leading-relaxed">
              "sbi-kyc-update.verify-now.in" is not an SBI domain. Real banks never ask for your OTP
              by SMS reply. The urgency ("blocked today") is a classic pressure tactic.
            </p>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted mt-3">Live example — this is what a scan looks like</p>
    </div>
  );
}
