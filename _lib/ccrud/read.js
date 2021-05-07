const ObjectId = require('mongodb').ObjectId;
const pluralize = require('pluralize');

module.exports = (db, schema, collection, query = {}, skip = 0, limit = 20, sort, populate) => {
  Object.keys(query).forEach(key => {
    if (key.includes('_ids')) console.trace('TODO...')
    if (key.includes('_id') && !key.includes('_ids')) query[key] = ObjectId(query[key]);
  })
  if (populate) {
    const lookups = [];
    Object.keys(schema.schema).forEach(addLookup(schema.schema, lookups));
    const aggregationPipe = [{ $match: query }, ...lookups];
    return db.collection(collection).aggregate(aggregationPipe).toArray();
  }
  if (sort) return db.collection(collection).find(query).skip(skip).limit(limit).sort(sort).toArray();
  if (!sort) return db.collection(collection).find(query).skip(skip).limit(limit).toArray();
}


function addLookup(schema, lookups) {
  return localField => {
    const newField = localField.split('_id')[0];
    if (!schema[localField].schema) return;
    if (newField) lookups.push({
      $lookup: {
        from: schema[localField].schema,
        localField: localField,
        foreignField: '_id',
        as: pluralize(newField),
      }
    });
    if (schema[localField].type === 'array_of_ids') return;
    if (newField) lookups.push({
      $unwind: {
        path: `\$${newField}`,
        preserveNullAndEmptyArrays: true,
      }
    });
  }
};