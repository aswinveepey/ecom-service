const User = require("../models/user");

const user = async (req, res, next) => {
  try {
    const auth_id = req.auth?._id;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const userModel = await db.model("User");
    const user = await userModel
      .findOne({ auth: auth_id })
      .populate({ path: "role", select: "name" });
    if (!user) {
      throw new Error("Invalid User");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { user };