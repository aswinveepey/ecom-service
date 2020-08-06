const jwt = require("jsonwebtoken");
const Auth = require("../models/auth");

const auth = async(req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const authModel = await db.model("Auth");
    const auth = await authModel.findOne({
      _id: data._id,
      token: token,
      status: true,
    });
    if (!auth) {
      throw new Error("Invalid Token");
    }
    if (!auth.status) {
      throw new Error("User Access Revoked");
    }
    req.auth = auth;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = { auth };
