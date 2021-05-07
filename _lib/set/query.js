const Q = require('q');
const ObjectID = require('mongodb').ObjectID;

/**
 It should extract the values from the req.body, req.params or req.query object
 It should build a query object and attach it to the req.local object
 It should return a promise when done.
 */

const isEmpty = obj => { return !Object.keys(obj).length }

const addSearchQuery = (schema, q) => {
  const quariables = ['string', 'array_of_strings', 'email', 'title'];
  const filteredQ = Object.keys(schema).filter(e => quariables.indexOf(schema[e].type) > -1);
  let qArray = filteredQ.map(e => {
    const obj = {};
    obj[e] = { $regex: q.toLowerCase(), $options: 'i' };
    return obj;
  });
  if (q.split(' ').length > 1) {
    let queryStringArray = q.split(' ');
    queryStringArray.forEach(e => {
      let queryLayer = filteredQ.map(ee => {
        const obj = {};
        obj[ee] = { $regex: e.toLowerCase(), $options: 'i' };
        return obj;
      });
      qArray = [...qArray, ...queryLayer]
    });

  }
  return { $or: qArray }
};

const formatObjectIds = query => {
  Object.keys(query).forEach(key => {
    if (key.includes('_ids')) return query[key] = query[key].map(id => ObjectID(id))
    if (key.includes('_id')) return query[key] = ObjectID(query[key])
  })
  return query;
}

const typeCastQuery = (schema, query) => {
  Object.keys(query).forEach(key => {
    if (schema.schema[key] && schema.schema[key].type === 'boolean') query[key] = query[key] === "!!" || query[key] === "true"
    if (schema.schema[key] && schema.schema[key].type === 'number') query[key] = Number(query[key])
  })
  return query;
}

module.exports = req => {
  const deferred = Q.defer();
  const reject = (data = null) => { deferred.reject(data); return deferred.promise; }
  const resolve = (data = null) => { deferred.resolve(data); return deferred.promise; }

  let hasBody = !isEmpty(req.body);
  let hasParams = !isEmpty(req.params);
  let hasQuery = !isEmpty(req.query);

  let schema = req.schemas[req.baseUrl.split('/')[2]];
  // let requestFilter = hasParams || hasQuery ? { ...req.params, ...req.query } : { ...req.params, ...req.query, ...req.body };
  let requestFilter = { ...req.params, ...req.query, ...req.body }
  // console.log(requestFilter)
  let query = typeCastQuery(schema, Object.assign({}, requestFilter))

  if (!req.locals) req.locals = {}
  if (requestFilter.$and) requestFilter.$and = requestFilter.$and.map(e => formatObjectIds(e))
  if (requestFilter.$or) requestFilter.$or = requestFilter.$or.map(e => formatObjectIds(e))
  delete query.q;
  delete query.limit;
  delete query.skip;
  delete query.sort;
  delete query.populate;

  Object.keys(query).forEach(key => {
    if (query[key] === '!!') return query[key] = { $exists: true, $ne: "", $ne: null };
    if (query[key] === '!') return query[key] = null;
    // ---
    if (!schema.schema[key]) return;
    if (key === '_id') return query[key] = new ObjectID(query[key])
    if (query[key] === null) return;
    if (key.includes('_id') && Object.keys(query[key]).includes('$exists')) return;
    if (!!schema.schema[key].schema && key.includes('_ids')) return query[key] = query[key].map(e => new ObjectID(e))
    if (!!schema.schema[key].schema && key.includes('_id') && !key.includes('_ids')) return query[key] = new ObjectID(query[key])
  });

  requestFilter.q
    ? req.locals.query = { $and: [addSearchQuery(schema.schema, requestFilter.q), query] }
    : req.locals.query = query;

  if (req.method === 'DELETE') {
    req.body = { tags: ['READY_TO_DELETE'] }
    return resolve();
  }

  return resolve();
}

