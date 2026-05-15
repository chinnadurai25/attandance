const mongoose = require('mongoose');

const nodes = [
  'ac-fnz8nyv-shard-00-00.nwtust8.mongodb.net',
  'ac-fnz8nyv-shard-00-01.nwtust8.mongodb.net',
  'ac-fnz8nyv-shard-00-02.nwtust8.mongodb.net'
];

async function checkNodes() {
  for (const node of nodes) {
    const uri = `mongodb://attandance:attandance@${node}:27017/attandance?ssl=true&authSource=admin&directConnection=true`;
    console.log(`Checking ${node}...`);
    try {
      const conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 5000 }).asPromise();
      const admin = conn.db.admin();
      const status = await admin.command({ isMaster: 1 });
      console.log(`Node ${node}: ismaster=${status.ismaster}, primary=${status.primary}`);
      await conn.close();
      if (status.ismaster) {
        console.log(`FOUND PRIMARY: ${node}`);
        process.exit(0);
      }
    } catch (err) {
      console.error(`Node ${node} failed: ${err.message}`);
    }
  }
  process.exit(1);
}

checkNodes();
