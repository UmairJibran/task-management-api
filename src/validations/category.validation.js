const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required().max(100),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().required().max(100),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
