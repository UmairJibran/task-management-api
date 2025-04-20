const supabase = require('../config/supabase.client');

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (error) {
    console.error('🚀 ~ auth ~ error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = auth;
