module.exports = (req, res, next) => {
  const read = require("../_lib/ccrud/read");
  let db = req.app.get("db");
  let collection = req.baseUrl.split("/")[2];
  read(
    db,
    req.schemas[collection],
    collection,
    req.locals.query,
    req.locals.skip || 0,
    req.locals.limit || 200,
    req.locals.sort,
    req.body.expand
  )
    .then((response) => {
      let paramKeys = Object.keys(req.params);
      paramKeys.length === 1 && paramKeys[0] === "_id"
        ? (res.locals[collection] = response[0])
        : (res.locals[collection] = response);
      next();
    })
    .catch((err) => console.log(err));
};
