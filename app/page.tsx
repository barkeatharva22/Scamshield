import Link from 'next/link';
import { ShieldCheck, ScanLine, Mail, BarChart3, ArrowRight, ArrowUpRight } from 'lucide-react';
import ScanDemo from '@/components/ScanDemo';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-text flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">ScamShield</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-muted hover:text-text transition-colors focus-ring rounded-pill px-3 py-2">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-text text-white font-medium px-5 py-2.5 rounded-pill hover:bg-text/90 transition-colors focus-ring"
          >
            Scan a message — free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-danger bg-dangerDim rounded-pill px-3.5 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulseSoft" />
            2,847 scams caught this week
          </div>
          <h1 className="font-display text-5xl md:text-[3.4rem] font-semibold leading-[1.08] tracking-tight text-text">
            Before you click,
            <br />
            know if it's a <span className="text-brandDeep">trick</span>.
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-md">
            Screenshot the suspicious SMS, WhatsApp message, or email. ScamShield reads it like a
            detective and tells you exactly why it's fake — or confirms it's real.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-text text-white font-medium px-6 py-3.5 rounded-pill hover:bg-text/90 transition-colors focus-ring shadow-card"
            >
              Check a message now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">No card. No signup wall to try it once.</p>
        </div>

        {/* Signature element: live scanning demo */}
        <ScanDemo />
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
        <p className="text-xs font-medium uppercase tracking-wider text-muted mb-3">How it works</p>
        <h2 className="font-display text-3xl font-semibold mb-12 max-w-lg text-text">
          Three steps. Under ten seconds.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Step
            icon={<ScanLine className="w-5 h-5 text-brandDeep" />}
            iconBg="bg-brandDim"
            title="Screenshot it"
            body="The SMS, WhatsApp forward, or email that made you pause. Upload it as-is — no retyping."
          />
          <Step
            icon={<ShieldCheck className="w-5 h-5 text-danger" />}
            iconBg="bg-dangerDim"
            title="Get a verdict, with proof"
            body="Real or fake, plus the exact details that gave it away — a wrong domain, an urgent-payment tactic, a fake OTP request."
          />
          <Step
            icon={<Mail className="w-5 h-5 text-safe" />}
            iconBg="bg-safeDim"
            title="Keep the report"
            body="It lands in your inbox, so you have it later — or can send it to whoever forwarded you the message."
          />
        </div>
      </section>

      {/* Dashboard teaser */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted mb-3">Your history</p>
            <h2 className="font-display text-3xl font-semibold mb-4 text-text">
              See the patterns targeting you.
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              Every scan is saved to your private dashboard — which scam types keep showing up,
              how many you've dodged, and what's trending in your city right now.
            </p>
            <Link href="/signup" className="text-brandDeep text-sm font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
              Start your scan history <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-panel border border-border rounded-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brandDeep" />
                <span className="text-sm font-medium">This month</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted" />
            </div>
            <div className="space-y-5">
              <MiniStat label="KYC / bank alert scams" value={62} color="bg-danger" />
              <MiniStat label="Parcel / delivery scams" value={41} color="bg-warn" />
              <MiniStat label="Lottery / prize scams" value={23} color="bg-lavender" />
              <MiniStat label="Genuine messages" value={18} color="bg-safe" />
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted">
          <ShieldCheck className="w-4 h-4" />
          ScamShield
        </div>
        <p className="text-xs text-muted">Built to keep people's money in their own pockets.</p>
      </footer>
    </main>
  );
}

function Step({ icon, iconBg, title, body }: { icon: React.ReactNode; iconBg: string; title: string; body: string }) {
  return (
    <div className="bg-panel border border-border rounded-card p-6 shadow-card hover:shadow-cardHover transition-shadow">
      <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg mb-2 text-text">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-text">{value}</span>
      </div>
      <div className="h-2 rounded-pill bg-panelLight overflow-hidden">
        <div className={`h-full rounded-pill ${color}`} style={{ width: `${(value / 62) * 100}%` }} />
      </div>
    </div>
  );
}
