import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeScreenshot } from '@/lib/groq';

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('image') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  // Convert the uploaded image to base64 for Groq Vision
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');

  // Upload the original screenshot to Supabase Storage (bucket: scan-images)
  const filePath = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('scan-images')
    .upload(filePath, bytes, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('scan-images').getPublicUrl(filePath);

  // Groq Vision + Groq AI reasoning
  const verdict = await analyzeScreenshot(base64);

  // Save the scan record
  const { data: scan, error: insertError } = await supabase
    .from('scans')
    .insert({
      user_id: user.id,
      image_url: publicUrl,
      extracted_text: verdict.extracted_text,
      sender_info: verdict.sender_info,
      verdict: verdict.verdict,
      confidence: verdict.confidence,
      category: verdict.category,
      reasoning: verdict.reasoning,
      flagged_signals: verdict.flagged_signals,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ scan });
}
