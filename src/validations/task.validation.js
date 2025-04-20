const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().required().max(200),
  description: Joi.string().allow('', null),
  categoryId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().allow(null),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .default('pending'),
  dueDate: Joi.date().allow(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().max(200),
  description: Joi.string().allow('', null),
  categoryId: Joi.string().uuid(),
  userId: Joi.string().uuid().allow(null),
  status: Joi.string().valid('pending', 'in_progress', 'completed'),
  dueDate: Joi.date().allow(null),
}).min(1);

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
