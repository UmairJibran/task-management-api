const Joi = require('joi');

const getCompletionRateS = Joi.object({
  timeframe: Joi.string().valid('day', 'week', 'month', 'all').default('all'),
});

module.exports = {
  getCompletionRateS,
};
