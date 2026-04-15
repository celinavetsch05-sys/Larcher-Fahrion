export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};
  var type = body.type;
  var name = (body.name || '').trim();
  var email = (body.email || '').trim();
  var wohnung = body.wohnung || '';
  var datum = body.datum || '';
  var telefon = body.telefon || '';
  var standort = (body.standort || '').trim();
  var nachricht = (body.nachricht || '').trim();

  // Validate
  if (!name || !email) {
    return res.status(400).json({ error: 'Name und E-Mail sind erforderlich.' });
  }
  if (type === 'guest' && !nachricht) {
    return res.status(400).json({ error: 'Bitte geben Sie eine Nachricht ein.' });
  }
  if (type === 'owner' && !standort) {
    return res.status(400).json({ error: 'Bitte geben Sie den Standort Ihrer Wohnung an.' });
  }

  var isGuest = type === 'guest';
  var subject = isGuest
    ? 'Neue G\u00e4ste-Anfrage von ' + name
    : 'Neue Eigent\u00fcmer-Anfrage von ' + name;

  var row = function(label, value) {
    return '<tr><td style="padding:8px 12px;font-weight:600;background:#f5f5f5;width:160px;vertical-align:top">'
      + label + '</td><td style="padding:8px 12px">' + (value || '\u2014') + '</td></tr>';
  };

  var htmlBody = isGuest
    ? '<h2 style="color:#2e4a5e;font-family:sans-serif">Neue G\u00e4ste-Anfrage</h2>'
      + '<table style="border-collapse:collapse;width:100%;max-width:560px;font-family:sans-serif;font-size:14px">'
      + row('Name', name)
      + row('E-Mail', '<a href="mailto:' + email + '">' + email + '</a>')
      + row('Wohnung', wohnung)
      + row('Wunschdatum', datum)
      + row('Nachricht', nachricht.replace(/\n/g, '<br>'))
      + '</table>'
    : '<h2 style="color:#2e4a5e;font-family:sans-serif">Neue Eigent\u00fcmer-Anfrage</h2>'
      + '<table style="border-collapse:collapse;width:100%;max-width:560px;font-family:sans-serif;font-size:14px">'
      + row('Name', name)
      + row('E-Mail', '<a href="mailto:' + email + '">' + email + '</a>')
      + row('Telefon', telefon)
      + row('Standort', standort)
      + row('Nachricht', nachricht.replace(/\n/g, '<br>'))
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
      return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden.' });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Serverfehler.' });
  }
}
