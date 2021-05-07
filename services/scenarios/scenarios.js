const router = require('express').Router();
const _m = require('../../_middlewares');

router.get('/', _m.setQuery, _m.setPagination, _m.read, _m.count, _m.done);
router.post('/', _m.setQuery, _m.setPagination, _m.read, _m.count, _m.done);
router.get('/csv', _m.setQuery, _m.setPagination, _m.read, _m.count, _m.doneCsv);
router.get('/count', _m.setQuery, _m.count, _m.done);
router.get('/:_id', _m.setQuery, _m.read, _m.done);
router.post('/create', _m.protect, _m.create, _m.done);
router.put('/:_id', _m.protect, _m.setQuery, _m.update, _m.done);
router.delete('/:_id', _m.protect, _m.setQuery, _m.update, _m.delete, _m.create, _m.done);

module.exports = router;