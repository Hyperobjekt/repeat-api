module.exports = (req, res) => {
  const { Parser } = require('json2csv');
  let collection = req.baseUrl.split('/')[2];
  if (!req.body) req.body = {};
  if (!req.locals) req.locals = {};

  const downloadResource = (res, fileName, fields, data) => {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);
  }
  const cleanAndConvert = json => {
    // console.log(`${json.data.length}/${json.count}`)
    let keys = Object.keys(json.data[0]).filter(e => e.charAt(0) !== '_');
    // return json
    // let scenarios = [...json.data].map(scenario => {
    //   let obj = {}
    //   keys.forEach(key => obj[key] = scenario[key])
    //   return obj;
    // })

    // const opts = { keys };

    // try {
    //   const parser = new Parser(opts);
    //   const csv = parser.parse(scenarios);
    //   return csv;
    // } catch (err) {
    //   console.error(err);
    // }
    return downloadResource(res, 'scenarios.csv', keys, json.data);

  }


  if (res.locals[collection].count || res.locals[collection].length) {
    return cleanAndConvert(res.locals[collection])
  }
  // ? res.status(200).send(cleanAndConvert(res.locals[collection]))
  return res.status(404).send({ message: `no ${collection} found`, query: req.locals.query })


}