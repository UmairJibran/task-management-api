const supabase = require('../config/supabase.client');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('🚀 ~ createCategory ~ error:', error);
    return res.status(500).json({ error: 'Failed to create category' });
  }
};

const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('🚀 ~ getCategories ~ error:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('🚀 ~ getCategoryById ~ error:', error);
    return res.status(500).json({ error: 'Failed to fetch category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('🚀 ~ updateCategory ~ error:', error);
    return res.status(500).json({ error: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id')
      .eq('category_id', id);

    if (tasksError) {
      return res.status(500).json({ error: 'Failed to check related tasks' });
    }

    if (tasksData && tasksData.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with associated tasks',
      });
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('🚀 ~ deleteCategory ~ error:', error);
    return res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
