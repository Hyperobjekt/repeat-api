const ObjectID = require('mongodb').ObjectID;
module.exports = (req, res, next) => {
  let create = require('../_lib/ccrud/create');
  let db = req.app.get('db');
  let collection = req.baseUrl.split('/')[2];

  if (Array.isArray(req.body)) req.body = req.body.map(doc => {
    doc.account_id = ObjectID(req.params.account_id)
    return doc;
  })
  if (!req.body.account_id) req.body.account_id = ObjectID(req.params.account_id);

  create(db, req.schemas[collection], collection, {}, req.body)
    .then(response => {
      res.locals[collection] = response.ops;
      next()
    }).catch(err => res.status(403).send({ error: err }))
}