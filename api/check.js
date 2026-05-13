const crypto = require('crypto');

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx < 0) return;
    cookies[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
  });
  return cookies;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const cookieValue = cookies['cs_auth'];

  if (!cookieValue) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const dotIdx = cookieValue.lastIndexOf('.');
  if (dotIdx < 0) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const payload = cookieValue.slice(0, dotIdx);
  const sig = cookieValue.slice(dotIdx + 1);
  const expectedSig = sign(payload, secret);

  let sigOk = false;
  try {
    sigOk = crypto.timingSafeEqual(
      Buffer.from(sig, 'hex'),
      Buffer.from(expectedSig, 'hex')
    );
  } catch (e) {
    sigOk = false;
  }

  if (!sigOk || payload !== 'cs_unlocked') {
    return res.status(401).json({ error: 'unauthorized' });
  }

  return res.status(200).json({ ok: true });
};
