import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { scanId } = await request.json();

  const { data: scan, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .eq('user_id', user.id)
    .single();

  if (error || !scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
  }

  const verdictColor = scan.verdict === 'scam' ? '#F0665E' : scan.verdict === 'genuine' ? '#3DBD8B' : '#F4B860';
  const verdictBg = scan.verdict === 'scam' ? '#FDEEED' : scan.verdict === 'genuine' ? '#EAF7F1' : '#FEF5E9';
  const verdictLabel = scan.verdict === 'scam' ? 'Likely a scam' : scan.verdict === 'genuine' ? 'Looks genuine' : 'Uncertain — be careful';

  await resend.emails.send({
    from: `ScamShield <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
    to: user.email,
    subject: `Scan report: ${verdictLabel}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; background: #FFFFFF; padding: 32px; border-radius: 20px; border: 1px solid #ECECE9;">
        <h1 style="color: #1C1C1E; font-size: 20px; margin-bottom: 4px;">ScamShield Report</h1>
        <p style="color: #8E8E92; font-size: 13px; margin-top: 0;">${new Date(scan.created_at).toLocaleString()}</p>
        <div style="background: ${verdictBg}; border-radius: 16px; padding: 16px; margin: 20px 0;">
          <p style="color: ${verdictColor}; font-weight: 600; margin: 0 0 8px 0;">${verdictLabel} (${scan.confidence}% confidence)</p>
          <p style="color: #1C1C1E; font-size: 14px; margin: 0; line-height: 1.5;">${scan.reasoning}</p>
        </div>
        ${
          scan.flagged_signals?.length
            ? `<p style="color: #8E8E92; font-size: 13px; margin-bottom: 4px;">What gave it away:</p>
               <ul style="color: #1C1C1E; font-size: 13px; padding-left: 20px;">
                 ${scan.flagged_signals.map((s: string) => `<li>${s}</li>`).join('')}
               </ul>`
            : ''
        }
        <p style="color: #8E8E92; font-size: 12px; margin-top: 24px;">Stay sharp out there. — ScamShield</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
