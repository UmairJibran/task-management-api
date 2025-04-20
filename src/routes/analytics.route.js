const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getCompletionRate,
  getOverdueTasks,
} = require('../controllers/analytics.controller');

const { getCompletionRateS } = require('../validations/analytics.validation');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Task analytics and reporting
 */

router.use(auth);

/**
 * @swagger
 * /api/analytics/completion-rate:
 *   get:
 *     summary: Get task completion rates
 *     description: Retrieves statistics on task completion rates with optional timeframe filtering
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: timeframe
 *         in: query
 *         schema:
 *           type: string
 *           enum: [day, week, month, all]
 *           default: all
 *         description: Time period to analyze
 *     responses:
 *       200:
 *         description: Task completion statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of tasks
 *                 completed:
 *                   type: integer
 *                   description: Number of completed tasks
 *                 inProgress:
 *                   type: integer
 *                   description: Number of tasks in progress
 *                 pending:
 *                   type: integer
 *                   description: Number of pending tasks
 *                 completionRate:
 *                   type: number
 *                   format: float
 *                   description: Percentage of completed tasks
 *                 inProgressRate:
 *                   type: number
 *                   format: float
 *                   description: Percentage of tasks in progress
 *                 pendingRate:
 *                   type: number
 *                   format: float
 *                   description: Percentage of pending tasks
 *                 timeframe:
 *                   type: string
 *                   description: Time period analyzed
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/completion-rate', validate(getCompletionRateS), getCompletionRate);

/**
 * @swagger
 * /api/analytics/overdue-tasks:
 *   get:
 *     summary: Get overdue tasks
 *     description: Retrieves all tasks past their due date that are not completed
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of overdue tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overdueTasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category_id:
 *                         type: string
 *                         format: uuid
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                       status:
 *                         type: string
 *                       due_date:
 *                         type: string
 *                         format: date
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       categories:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                 count:
 *                   type: integer
 *                   description: Total number of overdue tasks
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/overdue-tasks', getOverdueTasks);

module.exports = router;
