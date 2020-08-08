const jwt = require("jsonwebtoken");
// const Auth = require("../models/auth");

const auth = async(req, res, next) => {
  try {
    
    //get token and verify
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);

    //get db connection from req object and get auth model
    const db = req.db;
    const authModel = await db.model("Auth");

    //verify auth and throw error if not found
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

    //append auth to req object
    req.auth = auth;
    next();

  } catch (error) {

    res.status(401).json({ error: error.message });
  }
}

module.exports = { auth };
