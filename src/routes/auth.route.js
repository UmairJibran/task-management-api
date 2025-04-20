const express = require('express');
const router = express.Router();

const { signupSchema, loginSchema } = require('../validations/user.validation');
const validate = require('../middlewares/validate');

const { signup, login } = require('../controllers/auth.controller');

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

module.exports = router;
