const { MongoClient } = require('mongodb');
const options = {
  // autoReconnect: true,
  poolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}



module.exports = async () => {
  const client = new MongoClient(process.env.MONGO_URL, options);
  try {
    await client.connect();
    const db = client.db();
    console.log('\n> DB connection established');
    return db;
  } catch (err) {
    throw new Error('Error on DB connection', err)
  };
}
