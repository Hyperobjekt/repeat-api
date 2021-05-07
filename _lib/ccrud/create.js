const Q = require('q');
const moment = require('moment-timezone');
const read = require('./read');
const validateSchema = require('../schemas/validators/_schema');

module.exports = (db, schema, collection, query, data) => {
  const deferred = Q.defer();
  const reject = (data = null) => { deferred.reject(data); return deferred.promise; }
  const resolve = (data = null) => { deferred.resolve(data); return deferred.promise; }

  if (typeof data === 'string') return reject();
  if (typeof data === 'number') return reject();
  if (!Array.isArray(data) && Object.keys(data).length) data = [data];

  if (data.length === 0) return reject();
  if (data.length > 1000) return reject();
  if (data.length === 1) data[0].created = moment().tz(process.env.TZ).format();
  if (data.length > 1) data = data.map(e => { e.created = moment().tz(process.env.TZ).format(); return e; });


  let savableData = validateSchema(schema, data);

  if (savableData.length !== data.length) { return reject('Invalid data') }
  read(db, schema, collection, {}).then(response => {
    // @todo If found dont save & reject otherwise resolve
    return resolve(db.collection(collection).insertMany(savableData, { ordered: false }))
  })

  return deferred.promise;


}
