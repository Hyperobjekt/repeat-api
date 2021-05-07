const Q = require('q');
const moment = require('moment-timezone');
const read = require('./read');
const validateSchema = require('../schemas/validators/_schema');

module.exports = (db, schema, collection, query, data, many = false, action = null) => {
  const deferred = Q.defer();
  const reject = (data = null) => { deferred.reject(data); return deferred.promise; }
  const resolve = (data = null) => { deferred.resolve(data); return deferred.promise; }

  if (typeof data === 'string') return reject();
  if (typeof data === 'number') return reject();
  if (Array.isArray(data)) return reject();

  let operatorExpression;
  let savableData = validateSchema(schema, data);
  switch (action) {
    case 'addToSet':
      Object.keys(savableData).forEach(key => {
        if (Array.isArray(savableData[key])) savableData[key] = savableData[key][0] // Make sure the data being saved is NOT an array
      })
      operatorExpression = { $addToSet: savableData };
      break;
    case 'pull':
      operatorExpression = { $pull: savableData };
      break;
    default:
      operatorExpression = { $set: savableData };
      break;
  };
  if (!Object.keys(savableData).length) return reject('Unsavable data')
  if (!savableData) return reject('Unsavable data')
  if (many) return resolve(db.collection(collection).updateMany(query, operatorExpression));
  if (!many) return resolve(db.collection(collection).updateOne(query, operatorExpression));

}
