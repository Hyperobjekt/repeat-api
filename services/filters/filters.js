const router = require('express').Router();
const data = require('../../_data/repeat_filters.json')
router.get('/', (req, res) => {
  res.status(200).json(data)
});

module.exports = router;