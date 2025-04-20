const supabase = require('../config/supabase.client');

const getCompletionRate = async (req, res) => {
  try {
    const { timeframe } = req.query;

    let startDate = null;
    const now = new Date();

    if (timeframe === 'day') {
      startDate = new Date(now.setDate(now.getDate() - 1)).toISOString();
    } else if (timeframe === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
    } else if (timeframe === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }

    let query = supabase.from('tasks').select('status');

    if (startDate) {
      query.gte('created_at', startDate);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const total = data.length;
    const completed = data.filter((task) => task.status === 'completed').length;
    const inProgress = data.filter(
      (task) => task.status === 'in_progress',
    ).length;
    const pending = data.filter((task) => task.status === 'pending').length;

    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const inProgressRate = total > 0 ? (inProgress / total) * 100 : 0;
    const pendingRate = total > 0 ? (pending / total) * 100 : 0;

    return res.status(200).json({
      total,
      completed,
      inProgress,
      pending,
      completionRate: parseFloat(completionRate.toFixed(2)),
      inProgressRate: parseFloat(inProgressRate.toFixed(2)),
      pendingRate: parseFloat(pendingRate.toFixed(2)),
      timeframe: timeframe || 'all',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch completion rates' });
  }
};

const getOverdueTasks = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('tasks')
      .select(
        `
        *,
        categories(name)
      `,
      )
      .lt('due_date', today)
      .neq('status', 'completed');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      overdueTasks: data,
      count: data.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch overdue tasks' });
  }
};

module.exports = {
  getCompletionRate,
  getOverdueTasks,
};
