import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ScamVerdict {
  verdict: 'scam' | 'suspicious' | 'genuine';
  confidence: number; // 0-100
  category: string | null;
  extracted_text: string;
  sender_info: string | null;
  reasoning: string;
  flagged_signals: string[];
}

/**
 * Step 1 — Groq Vision reads the screenshot: the message text, sender name/number,
 * and any visible branding/logos.
 *
 * Step 2 — Groq's text model reasons over that extracted content against known
 * scam patterns and produces a verdict with specific, cited evidence.
 *
 * Both steps are combined into one call using a vision-capable Groq model,
 * with the model instructed to return strict JSON.
 */
export async function analyzeScreenshot(base64Image: string): Promise<ScamVerdict> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.2-90b-vision-preview',
    messages: [
      {
        role: 'system',
        content: `You are a fraud-detection analyst. You will be shown a screenshot of an SMS,
WhatsApp message, or email. Read the message text, sender info, and any visible branding.
Then decide if it is a SCAM, SUSPICIOUS (unclear), or GENUINE, using these common Indian
scam patterns as reference: fake KYC update requests, parcel/delivery release-fee scams,
lottery/prize scams, fake bank account-block alerts, job-offer scams requiring upfront payment.

Look for specific evidence: mismatched or suspicious domains, urgency/pressure language,
requests for OTP/PIN/payment, brand names spelled unusually, generic greetings instead of
using the recipient's real name, and unofficial-looking sender IDs.

Respond ONLY with valid JSON in this exact shape, no other text:
{
  "verdict": "scam" | "suspicious" | "genuine",
  "confidence": <number 0-100>,
  "category": "<one of: kyc_update, parcel_delivery, lottery_prize, bank_alert, job_scam, null>",
  "extracted_text": "<the message text you read>",
  "sender_info": "<sender name/number if visible, else null>",
  "reasoning": "<2-3 sentence plain-language explanation>",
  "flagged_signals": ["<specific signal 1>", "<specific signal 2>", "..."]
}`,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this message screenshot and return the JSON verdict.' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
        ] as any,
      },
    ],
    temperature: 0.2,
    max_tokens: 1000,
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned) as ScamVerdict;
  } catch {
    return {
      verdict: 'suspicious',
      confidence: 50,
      category: null,
      extracted_text: '',
      sender_info: null,
      reasoning: 'Could not fully analyze this image. Please try a clearer screenshot.',
      flagged_signals: [],
    };
  }
}
