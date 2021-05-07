const Q = require('q');

const createSortQuery = sort => {
  let query = {}
  sort.split(',').forEach(e => query[e] = 1);
  return query;
}

module.exports = (req) => {
  const deferred = Q.defer();
  const reject = (data = null) => { deferred.reject(data); return deferred.promise; }
  const resolve = (data = null) => { deferred.resolve(data); return deferred.promise; }
  if (!req.locals) req.locals = {};
  if (req.query.skip !== null) req.locals.skip = Number(req.query.skip);
  if (req.query.limit !== null) req.locals.limit = Number(req.query.limit);
  if (req.query.sort) req.locals.sort = createSortQuery(req.query.sort)
  return resolve();
}