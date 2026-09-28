'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-xs text-muted hover:text-danger transition-colors px-3 py-2 rounded-xl focus-ring w-full"
    >
      <LogOut className="w-3.5 h-3.5" />
      Log out
    </button>
  );
}
