import { createClient } from '@/lib/supabase/server';
import HistoryList from '@/components/HistoryList';

export default async function HistoryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: scans } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="font-display text-2xl font-semibold mb-1 text-text">Scan history</h1>
      <p className="text-sm text-muted mb-8">Every message you've checked, saved privately to your account.</p>

      <HistoryList initialScans={scans ?? []} />
    </div>
  );
}
