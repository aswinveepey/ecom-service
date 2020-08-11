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
// require("../models/sku");
require("../models/territory");
require("../models/user");

const processTenantDb = async (req, res, next) => {
  try {

    //get tenant id from request and throw error if tenant id not passed
    const { tenantId } = req.query;
    if(!tenantId) throw new Error("Invalid Tenant ID")
    
    //create connection for tenantId - base client connection can be obtained from globals
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);

    //append db connection to request and process the request
    req.db = db;
    next();

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { processTenantDb };
