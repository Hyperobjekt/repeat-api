module.exports = (req, res, next) => {
    let update = require('../_lib/ccrud/update')
    let db = req.app.get('db');
    let action = req.method === 'DELETE' ? 'addToSet' : null;
  
    update(db, req.schemas[collection], collection, req.locals.query, req.body, null, action)
      .then(response => {
        res.locals[collection] = response;
        next()
      }).catch(err => res.status(403).send({ error: err }))
  }
  