const Q = require('q');
module.exports = (db, collection, query) => {
   const deferred = Q.defer();
   const reject = (data = null) => { deferred.reject(data); return deferred.promise; }
   const resolve = (data = null) => { deferred.resolve(data); return deferred.promise; }
   if (!query) return reject({ error: 'no query' });
   resolve(db.collection(collection).distinct(query.field, query.filter));
   return deferred.promise;
}
