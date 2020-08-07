const mongoose = require("mongoose");

const clientOption = {
  useUnifiedTopology: true,
  // socketTimeoutMS: 30000,
  keepAlive: true,
  // reconnectTries: 30000,
  poolSize: 50,
  useNewUrlParser: true,
  useCreateIndex: true,
};

const initClientDbConnection = () => {
  const db = mongoose.createConnection(process.env.MONGODB_URL, clientOption);

  db.on("error", console.error.bind(console, "DB Connection Error>> : "));
  db.once("open", function () {
    console.log("client MongoDB Connection ok!");
  });
  return db;
};

module.exports = {
  initClientDbConnection,
};
