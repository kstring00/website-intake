import { NextResponse } from 'next/server';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderValue(value: unknown) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value || '—');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.name || !body?.email || !body?.businessName || !body?.businessDescription) {
      return NextResponse.json({ error: 'Missing required project information.' }, { status: 400 });
    }

    const submissionId = `web-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
    const submittedAt = new Date().toISOString();
    const payload = { submissionId, submittedAt, ...body };

    const resendKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.INTAKE_NOTIFICATION_EMAIL;
    const from = process.env.INTAKE_FROM_EMAIL || 'Website Intake <onboarding@resend.dev>';

    let delivery: 'email' | 'not_configured' = 'not_configured';

    if (resendKey && notificationEmail) {
      const rows = Object.entries(payload)
        .filter(([key]) => key !== 'consent')
        .map(([key, value]) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e6e3dd;font-weight:700;vertical-align:top;width:210px;text-transform:capitalize">${escapeHtml(key.replace(/([A-Z])/g, ' $1'))}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e6e3dd;vertical-align:top;white-space:pre-wrap">${escapeHtml(renderValue(value))}</td>
          </tr>`)
        .join('');

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [notificationEmail],
          reply_to: body.email,
          subject: `New website inquiry — ${body.businessName}`,
          html: `
            <div style="font-family:Arial,sans-serif;color:#111820;max-width:900px;margin:auto">
              <p style="letter-spacing:.15em;font-size:11px;font-weight:800;color:#365b79">NEW WEBSITE PROJECT INQUIRY</p>
              <h1 style="font-family:Georgia,serif;font-weight:500;font-size:34px;margin:8px 0 4px">${escapeHtml(body.businessName)}</h1>
              <p style="color:#6f7882;margin:0 0 24px">${escapeHtml(body.name)} · ${escapeHtml(body.email)} · ${escapeHtml(submissionId)}</p>
              <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e0ddd6;border-radius:12px;border-collapse:collapse;background:#fbfaf7">${rows}</table>
            </div>`,
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error('Resend delivery failed', response.status, detail);
        return NextResponse.json({ error: 'Your brief could not be delivered. Please try again.' }, { status: 502 });
      }
      delivery = 'email';
    } else {
      console.info('Website intake received (email delivery not configured):', payload);
    }

    return NextResponse.json({ ok: true, submissionId, delivery });
  } catch (error) {
    console.error('Intake submission error', error);
    return NextResponse.json({ error: 'Could not submit the project brief.' }, { status: 500 });
  }
}
