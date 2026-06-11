const crypto = require('crypto');

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const expectedPassword = process.env.CASE_STUDY_PASSWORD;
  const secret = process.env.COOKIE_SECRET;

  if (!expectedPassword || !secret) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  let passwordOk = false;
  try {
    const pwdBuf = Buffer.from(password || '');
    const expBuf = Buffer.from(expectedPassword);
    if (pwdBuf.length === expBuf.length) {
      passwordOk = crypto.timingSafeEqual(pwdBuf, expBuf);
    }
  } catch (e) {
    passwordOk = false;
  }

  if (!passwordOk) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const payload = 'cs_unlocked';
  const sig = sign(payload, secret);
  const cookieValue = `${payload}.${sig}`;
  const maxAge = 60 * 60 * 24 * 30; // 30 days

  res.setHeader('Set-Cookie',
    `cs_auth=${cookieValue}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
  );

  return res.status(200).json({ ok: true });
};
