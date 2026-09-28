import Link from 'next/link';
import { ShieldCheck, ScanLine, History, BarChart3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex bg-ink">
      <aside className="w-64 shrink-0 p-5">
        <div className="bg-panel border border-border rounded-card shadow-card h-full flex flex-col p-5">
          <Link href="/" className="flex items-center gap-2.5 mb-8 px-1">
            <div className="w-8 h-8 rounded-xl bg-text flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold">ScamShield</span>
          </Link>

          <nav className="flex-1 space-y-1.5">
            <NavLink href="/dashboard/scan" icon={<ScanLine className="w-4 h-4" />} label="New scan" />
            <NavLink href="/dashboard/history" icon={<History className="w-4 h-4" />} label="History" />
            <NavLink href="/dashboard/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
          </nav>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted truncate mb-3 px-3">{user?.email}</p>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-text hover:bg-panelLight transition-colors focus-ring"
    >
      {icon}
      {label}
    </Link>
  );
}
