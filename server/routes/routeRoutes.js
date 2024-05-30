const express = require('express');
const { getRoutes, getUserRoutes, getLastRoutes} = require('../controllers/routeController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/get-routes', auth, getRoutes);
router.post('/get-last-routes', auth, getLastRoutes);
router.get('/user-routes', auth, getUserRoutes);

module.exports = router;
