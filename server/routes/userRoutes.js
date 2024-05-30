const express = require('express');
const { signUp, signIn, validateToken } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/validate-token', auth, validateToken);

module.exports = router;
