const pluralize = require('pluralize');
module.exports = (db, options, cb) => {
  const { collection, schema, query, skip, limit, sort } = options;

  const processResponse = (err, result) => {
    if (err) return cb({ status: 403, query: query, err: err });
    if (!result.length) return cb({ status: 404, query: query, data: 'No Docs Found' });
    return cb({ status: 200, data: result });
  };

  const lookups = [];
  Object.keys(schema).forEach(addLookup(schema, lookups));
  const aggregationPipe = [{ $match: query }, ...lookups];

  if (skip) aggregationPipe.push({ $skip: skip });
  if (limit) aggregationPipe.push({ $limit: limit });

  return db
    .collection(collection)
    .aggregate(aggregationPipe)
    .toArray(processResponse);
};

function addLookup(schema, lookups) {
  return localField => {
    const newField = localField.split('_id')[0];
    if (!schema[localField].schema) return;

    lookups.push({
      $lookup: {
        from: schema[localField].schema,
        localField: localField,
        foreignField: '_id',
        as: pluralize(newField),
      }
    });
    lookups.push({
      $unwind: {
        path: `\$${newField}`,
        preserveNullAndEmptyArrays: true,
      }
    });
  }
};
