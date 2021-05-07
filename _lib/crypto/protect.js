const Q = require('q');
const jwt = require('jsonwebtoken');
const read = require('../ccrud/read');

/**
 * 
 * @Todo
 * database functions should return a promise
 */


module.exports = req => {
  const deferred = Q.defer();
  const reject = (data = null) => { deferred.reject(data); return deferred.promise; }
  const resolve = (data = null) => { deferred.resolve(data); return deferred.promise; }

  let authorization, tokenArr, validTokenFormat, secretKey, key, tokenKey, query = {}

  const authorizeApiUser = async () => {
    authorization = req.headers['authorization'].split(' ')
    tokenArr = authorization[1].split('_');
    validTokenFormat = tokenArr.length === 3 && tokenArr[0] === 'ksk' && (tokenArr[1].includes('live') || tokenArr[1].includes('test'));
    if (authorization[0] !== 'Bearer') return reject()
    if (!validTokenFormat) return reject();

    secretKey = `${tokenArr[1].toUpperCase()}_JWT_SECRET`;
    key = `${tokenArr[1].toLowerCase()}SecretKey`;
    tokenKey = `encrypted${tokenArr[1].charAt(0).toUpperCase() + tokenArr[1].slice(1)}Token`
    query[key] = authorization[1];

    let apiKeys = await read(req.app.get('db'), null, 'api_keys', query)
    if (!apiKeys.length) return reject();
    req.params.account_id = apiKeys[0].account_id;
    return resolve();
  }

  const authorizeClientApp = () => {
    let token = req.headers['clienttoken']
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.params.account_id = decoded.account_id;
      return resolve();
    } catch (error) {
      return reject('Invalid token provided');
    }
  }


  if (!!req.headers['authorization']) return authorizeApiUser()
  if (!!req.headers['clienttoken']) return authorizeClientApp()
  return reject('No token provided')


}

