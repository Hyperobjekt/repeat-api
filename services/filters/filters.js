const router = require('express').Router();
const data = require('../../_data/nzap_filters.json')
router.get('/', (req, res) => {
  res.status(200).json(data)
});

module.exports = router;