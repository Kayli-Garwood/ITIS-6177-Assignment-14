const express = require('express');
const router = express.Router();
const {
  createMonkey,
  deleteMonkey,
  getMonkey,
  getOneMonkey,
  updateMonkey
} = require('../controller/monkey');

router.get('/monkey/:id', getOneMonkey);
router.get('/monkeys', getMonkey);
router.post('/monkey', createMonkey);
router.put('/monkey/:id', updateMonkey);
router.delete('/monkey/:id', deleteMonkey);

module.exports = router;