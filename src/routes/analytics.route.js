const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getCompletionRate,
  getOverdueTasks,
} = require('../controllers/analytics.controller');

const { getCompletionRateS } = require('../validations/analytics.validation');
const validate = require('../middlewares/validate');

router.use(auth);

router.get('/completion-rate', validate(getCompletionRateS), getCompletionRate);
router.get('/overdue-tasks', getOverdueTasks);

module.exports = router;
