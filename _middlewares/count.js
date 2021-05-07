module.exports = (req, res, next) => {
  const count = require('../_lib/ccrud/count');
  let db = req.app.get('db');
  let collection = req.baseUrl.split('/')[2];
  count(db, req.schemas[collection], collection, req.locals.query)
    .then(response => {
      if (res.locals[collection].length) {
        let data = [...res.locals[collection]]
        res.locals[collection] = { data, count: response }
      }
      if (res.locals[collection].length)
        res.locals[collection] = { count: response };
      next()
    }).catch(err => console.log(err))
}