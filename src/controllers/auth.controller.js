const supabase = require('../config/supabase.client');

const signup = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ user: data.user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  console.log('🚀 ~ login ~ session:', data.session);
  return res.status(200).json({ session: data.session });
};

module.exports = {
  signup,
  login,
};
