const mongoose = require('mongoose');

const URI = 'mongodb://dfdirectorydb:6YdP5QzQXFMmn0uUUfgoiyfP3lUpCQJFQymHBQ31ybNwwMHof1ghU5YeRKbC6g6VHYadLPPQF1mxG4GUWchKeQ==@dfdirectorydb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@dfdirectorydb@'         

const connectDB = async () => {
  try {
    const conn = await mongoose.connect( URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`Cosmos DB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
