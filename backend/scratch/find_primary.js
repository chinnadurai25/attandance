const mongoose = require('mongoose');

const uri = 'mongodb://attandance:attandance@ac-fnz8nyv-shard-00-00.nwtust8.mongodb.net:27017,ac-fnz8nyv-shard-00-01.nwtust8.mongodb.net:27017,ac-fnz8nyv-shard-00-02.nwtust8.mongodb.net:27017/attandance?ssl=true&replicaSet=atlas-fnz8nyv-shard-0&authSource=admin';

async function findPrimary() {
  try {
    console.log('Connecting...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected!');
    const admin = mongoose.connection.db.admin();
    const status = await admin.command({ isMaster: 1 });
    console.log('Primary Node:', status.primary);
    console.log('Is Master:', status.ismaster);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

findPrimary();
