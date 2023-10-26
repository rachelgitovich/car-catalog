const express = require('express');
const router = express.Router();
const {
  getCars,
  addCar,
  deleteCar,
  updateCar,
  searchCar,
} = require('../controllers/carController');
const cacheMiddleware = require('../middlewares/cacheMiddleware');

router.route('/').get(cacheMiddleware, getCars).post(addCar);
router.route('/:id').delete(deleteCar).put(updateCar);
router.route('/search').get(cacheMiddleware, searchCar);

module.exports = router;
