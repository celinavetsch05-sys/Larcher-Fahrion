export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Serverkonfigurationsfehler.' });
  }

  var body = req.body || {};
  var type = body.type;
  var name = (body.name || '').trim();
  var email = (body.email || '').trim();
  var wohnung = body.wohnung || '';
  var anreise = body.anreise || '';
  var abreise = body.abreise || '';
  var telefon = body.telefon || '';
  var standort = (body.standort || '').trim();
  var nachricht = (body.nachricht || '').trim();

  if (type !== 'guest' && type !== 'owner') {
    return res.status(400).json({ error: 'Ungültiger Anfragetyp.' });
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'Name und E-Mail sind erforderlich.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
  }
  if (type === 'guest' && !nachricht) {
    return res.status(400).json({ error: 'Bitte geben Sie eine Nachricht ein.' });
  }
  if (type === 'owner' && !standort) {
    return res.status(400).json({ error: 'Bitte geben Sie den Standort Ihrer Wohnung an.' });
  }

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var isGuest = type === 'guest';
  var safeName = name.replace(/[\r\n\t]/g, ' ');
  var subject = isGuest
    ? 'Neue Gäste-Anfrage von ' + safeName
    : 'Neue Eigentümer-Anfrage von ' + safeName;

  var row = function(label, value) {
    return '<tr><td style="padding:8px 12px;font-weight:600;background:#f5f5f5;width:160px;vertical-align:top">'
      + escHtml(label) + '</td><td style="padding:8px 12px">' + (escHtml(value) || '—') + '</td></tr>';
  };
  var rowHtml = function(label, htmlValue) {
    return '<tr><td style="padding:8px 12px;font-weight:600;background:#f5f5f5;width:160px;vertical-align:top">'
      + escHtml(label) + '</td><td style="padding:8px 12px">' + (htmlValue || '—') + '</td></tr>';
  };

  var emailCell = '<a href="mailto:' + escHtml(email) + '">' + escHtml(email) + '</a>';
  var nachrichtCell = escHtml(nachricht).replace(/\n/g, '<br>');

  var htmlBody = isGuest
    ? '<h2 style="color:#2e4a5e;font-family:sans-serif">Neue Gäste-Anfrage</h2>'
      + '<table style="border-collapse:collapse;width:100%;max-width:560px;font-family:sans-serif;font-size:14px">'
      + row('Name', name)
      + rowHtml('E-Mail', emailCell)
      + row('Wohnung', wohnung)
      + row('Anreise', anreise)
      + row('Abreise', abreise)
      + rowHtml('Nachricht', nachrichtCell)
      + '</table>'
    : '<h2 style="color:#2e4a5e;font-family:sans-serif">Neue Eigentümer-Anfrage</h2>'
      + '<table style="border-collapse:collapse;width:100%;max-width:560px;font-family:sans-serif;font-size:14px">'
      + row('Name', name)
      + rowHtml('E-Mail', emailCell)
      + row('Telefon', telefon)
      + row('Standort', standort)
      + rowHtml('Nachricht', nachrichtCell)
      + '</table>';

  try {
    var response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Larcher & Fahrion <onboarding@resend.dev>',
        to: ['verena.larcher@gmail.com'],
        reply_to: email,
        subject: subject,
        html: htmlBody
      })
    });

    if (!response.ok) {
      var errText = await response.text();
      console.error('Resend error:', errText);
      return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden. Bitte schreiben Sie uns direkt an hallo@larcher-fahrion.de' });
    }

    // Best-effort confirmation to sender — failure must not block the main response
    try {
      var confirmHtml = '<div style="font-family:sans-serif;font-size:15px;color:#333;max-width:560px">'
        + '<h2 style="color:#2e4a5e">Vielen Dank für Ihre Anfrage!</h2>'
        + '<p>Liebe/r ' + escHtml(name) + ',</p>'
        + '<p>wir haben Ihre Anfrage erhalten und melden uns so bald wie möglich bei Ihnen.</p>'
        + '<p style="color:#555">Mit freundlichen Grüßen<br><strong>Verena &amp; Matthias</strong><br>Larcher &amp; Fahrion · Ferienwohnungen Oberammergau</p>'
        + '</div>';
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Larcher & Fahrion <onboarding@resend.dev>',
          to: [email],
          subject: 'Ihre Anfrage ist bei uns eingegangen',
          html: confirmHtml
        })
      });
    } catch (confirmErr) {
      console.warn('Confirmation email failed (non-critical):', confirmErr.message);
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Serverfehler. Bitte versuchen Sie es später erneut.' });
  }
}
