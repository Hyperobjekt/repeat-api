module.exports = (req, res, next) => {
  const distinct = require('../_lib/ccrud/distinct');
  let db = req.app.get('db');
  let collection = req.locals.collection || req.baseUrl.split('/')[2];
  let field = req.locals.distinctField;
  let filter = req.locals.distinctFilter || {}
  return distinct(db, collection, { field, filter }).then(response => {
    let filterKeys = Object.keys(filter);
    if (filterKeys.length) {
      return { field, filter, response };//next()
    }
    res.locals[field] = response;
    return next()
  }).catch(err => console.log(err))
}