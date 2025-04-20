const supabase = require('../config/supabase.client');

const createTask = async (req, res) => {
  try {
    const { title, description, categoryId, status, dueDate } = req.body;
    const creatorId = req.user.id;

    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (categoryError || !categoryData) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const taskData = {
      title,
      description,
      category_id: categoryId,
      user_id: creatorId,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      status: status || 'pending',
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await supabase.from('task_status_logs').insert({
      task_id: data.id,
      status: data.status,
      changed_by: creatorId,
    });

    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
};

const getTasks = async (req, res) => {
  try {
    const query = supabase.from('tasks').select(`
        *,
        categories(name)
      `);

    if (req.query.status) {
      query.eq('status', req.query.status);
    }

    if (req.query.category) {
      query.eq('category_id', req.query.category);
    }

    if (req.user.id) {
      query.eq('user_id', req.user.id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .select(
        `
          *,
          categories(name),
          status_logs:task_status_logs(*)
        `
      )
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, userId, status, dueDate } =
      req.body;
    const currentUserId = req.user.id;

    const { data: existingTask, error: existingTaskError } = await supabase
      .from('tasks')
      .select('status')
      .eq('id', id)
      .single();

    if (existingTaskError || !existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (categoryId) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', categoryId)
        .single();

      if (categoryError || !categoryData) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }
    }

    if (userId) {
      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(userId);

      if (userError || !userData?.user) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
    }

    const taskData = {};
    if (title) taskData.title = title;
    if (description !== undefined) taskData.description = description;
    if (categoryId) taskData.category_id = categoryId;
    if (userId) taskData.user_id = userId;
    if (status) taskData.status = status;
    if (dueDate !== undefined) taskData.due_date = dueDate;

    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (status && status !== existingTask.status) {
      await supabase.from('task_status_logs').insert({
        task_id: id,
        status,
        changed_by: currentUserId,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await supabase.from('task_status_logs').delete().eq('task_id', id);

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
