'use client';

import { useState, useRef } from 'react';
import { Upload, AlertTriangle, ShieldCheck, HelpCircle, Mail, Loader2 } from 'lucide-react';

interface ScanResult {
  id: string;
  verdict: 'scam' | 'suspicious' | 'genuine';
  confidence: number;
  category: string | null;
  reasoning: string;
  flagged_signals: string[];
}

export default function ScanPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setResult(null);
    setError(null);
    setPreview(URL.createObjectURL(f));
  }

  async function handleScan() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/scan', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.scan);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailReport() {
    if (!result) return;
    await fetch('/api/send-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scanId: result.id }),
    });
    setEmailSent(true);
  }

  const verdictStyles = {
    scam: { color: 'text-danger', bg: 'bg-dangerDim', icon: AlertTriangle, label: 'Likely a scam' },
    suspicious: { color: 'text-warn', bg: 'bg-warnDim', icon: HelpCircle, label: 'Uncertain — be careful' },
    genuine: { color: 'text-safe', bg: 'bg-safeDim', icon: ShieldCheck, label: 'Looks genuine' },
  };

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="font-display text-2xl font-semibold mb-1 text-text">New scan</h1>
      <p className="text-sm text-muted mb-8">Upload a screenshot of the message you're unsure about.</p>

      {!preview ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full bg-panel border-2 border-dashed border-border rounded-card py-16 flex flex-col items-center gap-3 hover:border-brand/40 hover:bg-brandDim/30 transition-colors focus-ring shadow-card"
        >
          <div className="w-12 h-12 rounded-2xl bg-brandDim flex items-center justify-center">
            <Upload className="w-5 h-5 text-brandDeep" />
          </div>
          <p className="text-sm text-muted">Click to upload a screenshot</p>
          <p className="text-xs text-muted/70">PNG, JPG up to 10MB</p>
        </button>
      ) : (
        <div className="bg-panel border border-border rounded-card shadow-card p-5">
          <img src={preview} alt="Uploaded screenshot" className="rounded-2xl max-h-80 mx-auto object-contain" />

          {!result && (
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleScan}
                disabled={loading}
                className="flex-1 bg-text text-white font-medium py-3 rounded-pill hover:bg-text/90 transition-colors focus-ring disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  'Check this message'
                )}
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                }}
                className="px-5 py-3 rounded-pill text-sm text-muted hover:text-text border border-border transition-colors focus-ring"
              >
                Change
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-danger bg-dangerDim rounded-xl px-4 py-3">{error}</p>
          )}

          {result &&
            (() => {
              const s = verdictStyles[result.verdict];
              const Icon = s.icon;
              return (
                <div className={`mt-5 rounded-2xl ${s.bg} p-5`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${s.color} shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <p className={`font-display font-semibold ${s.color}`}>
                        {s.label} <span className="text-xs font-normal text-muted">({result.confidence}% confidence)</span>
                      </p>
                      <p className="text-sm text-text/80 mt-2 leading-relaxed">{result.reasoning}</p>
                      {result.flagged_signals?.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {result.flagged_signals.map((sig, i) => (
                            <li key={i} className="text-xs text-muted flex items-start gap-2">
                              <span className="text-muted/50 mt-0.5">—</span> {sig}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleEmailReport}
                      disabled={emailSent}
                      className="flex items-center gap-2 text-xs font-medium text-brandDeep hover:underline disabled:text-safe disabled:no-underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {emailSent ? 'Report sent to your email' : 'Email me this report'}
                    </button>
                    <button
                      onClick={() => {
                        setPreview(null);
                        setFile(null);
                        setResult(null);
                        setEmailSent(false);
                      }}
                      className="text-xs text-muted hover:text-text ml-auto"
                    >
                      Scan another
                    </button>
                  </div>
                </div>
              );
            })()}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
