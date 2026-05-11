export async function onRequestPost(context) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  try {
    const { name, email, business, type, message, source } = await context.request.json();
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email required' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }
    const html = `
      <div style="font-family:Inter,sans-serif;max-width:580px;padding:32px;background:#0A0B0D;color:#E8ECEF;border-radius:12px">
        <h2 style="color:#C6FF3D;margin:0 0 24px">New AXIS·OS lead</h2>
        <table style="width:100%;border-collapse:collapse;color:#E8ECEF">
          <tr><td style="padding:7px 0;color:#7A8189;font-size:13px;width:140px">Name</td><td style="padding:7px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:7px 0;color:#7A8189;font-size:13px">Email</td><td style="padding:7px 0"><a href="mailto:${email}" style="color:#C6FF3D">${email}</a></td></tr>
          ${business ? `<tr><td style="padding:7px 0;color:#7A8189;font-size:13px">Company</td><td style="padding:7px 0">${business}</td></tr>` : ''}
          ${type ? `<tr><td style="padding:7px 0;color:#7A8189;font-size:13px">Team size</td><td style="padding:7px 0">${type}</td></tr>` : ''}
        </table>
        ${message ? `<div style="margin-top:20px;padding:18px;background:#111316;border-left:3px solid #C6FF3D;border-radius:6px"><p style="margin:0;font-size:13.5px;line-height:1.7">${message.replace(/\n/g, '<br>')}</p></div>` : ''}
        <p style="margin-top:18px;color:#4A4F57;font-size:11px">Sent via ${source || 'axis-os.org'}</p>
      </div>`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${context.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'AXIS·OS <hello@vidatech.org>',
        to: ['vidaholdingsgroup@gmail.com'],
        reply_to: email,
        subject: `[AXIS·OS] New lead — ${name}${business ? ' · ' + business : ''}`,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
}
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
