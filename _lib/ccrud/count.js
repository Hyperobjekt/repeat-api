module.exports = (db, schema, collection, query = {}) => {
   return db.collection(collection).countDocuments(query);
}
