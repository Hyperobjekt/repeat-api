/**
 * 
 * @param {*} schema is an object o
 * @param {*} data is an array of data to be validated
 * @return: A new, mapped  data array ... mapped to thema with all the data validated and type casted
 */

// const removeInvalidKey = (schema, data) => {
//   Object.keys(data).forEach(e => !schema.schema[e] ? delete data[e] : null)
//   if (Object.keys(data).length > 0) return data
// }
// const validateKey = (schema, data) => {
//   let newData = {}
//   let docKeys = Object.keys(data);
//   docKeys.forEach(key => {
//     let v = require(`./${schema.schema[key].type}`);
//     if (v.validate(data[key])) newData[key] = data[key];
//   });
//   return newData;
// }


const removeBlankKeys = (schema, data) => {
  return data.map(doc => {
    Object.keys(doc).forEach(e => !schema.schema[e] ? delete doc[e] : null)
    return doc
  }).filter(doc => Object.keys(doc).length > 1)
}

const validateKeys = (schema, doc) => {
  let isValid;
  for (const key in doc) {
    let validator = require(`./${schema.schema[key].type}`);
    if (schema.schema[key].type === 'match') isValid = validator.validate(doc[key], schema.schema[key].matches)
    if (schema.schema[key].type !== 'match') isValid = validator.validate(doc[key]);
    if (!isValid) break
  }
  return isValid;
}

const formatValues = (schema, doc) => {
  for (const key in doc) {
    let validator = require(`./${schema.schema[key].type}`);
    doc[key] = validator.format(doc[key])
  }
  return doc;
}

module.exports = (schema, data) => {
  if (!Array.isArray(data) && typeof data === 'object') data = [data]
  let validatedData = [];
  let preprocessed = removeBlankKeys(schema, data);
  for (let i = 0; i < preprocessed.length; i++) {
    let validated = validateKeys(schema, preprocessed[i]);
    if (validated) {
      let saveable = formatValues(schema, preprocessed[i])
      validatedData.push(saveable);
    }
  }
  return validatedData;
}