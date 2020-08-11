const mongoose = require("mongoose");
require("../models/account");
require("../models/auth");
require("../models/brand");
require("../models/cart");
require("../models/category");
require("../models/collection");
require("../models/customer");
require("../models/division");
require("../models/order");
require("../models/permission");
require("../models/product");
require("../models/role");
require("../models/sku");
require("../models/territory");
require("../models/user");

const clientOption = {
  useUnifiedTopology: true,
  // socketTimeoutMS: 30000,
  keepAlive: true,
  // reconnectTries: 30000,
  autoIndex: true,
  poolSize: 50,
  useNewUrlParser: true,
  useCreateIndex: true,
};

const initClientDbConnection = () => {
  const db = mongoose.createConnection(process.env.MONGODB_URL, clientOption);

  db.on("error", console.error.bind(console, "DB Connection Error : "));
  db.once("open", function () {
    console.log("MongoDB Connection ok");
  });
  return db;
};

module.exports = {
  initClientDbConnection,
};
