const Auth = require("../models/auth");
/**
 * Create auth
 * @param {username} req
 * @param {password} req
 * @param {token} res
 */

async function createAuth(req, res) {
  try {
    const payload = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const authModel = await db.model("Auth");
    auth = new authModel(payload);
    await auth.save();
    token = await auth.generateAuthToken();
    return res.json({ data: token, message: "Authentication Created" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}
async function usernameAuth(req, res) {
  try {
    const { username, password } = req.body;
    const { tenantId } = req.query;

    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const authModel = await db.model("Auth");

    auth = await authModel.usernameAuth(username, password, authModel);
    const token = await auth.generateAuthToken();
    return res.json({ data: token, message:"Authentication Succesful" });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}
async function generateOtp(req, res){
  try {
    const { mobilenumber } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const authModel = await db.model("Auth");

    auth = await authModel.findOne({ mobilenumber: mobilenumber });
    if (!auth){
      auth = await authModel.create({
        mobilenumber: mobilenumber,
        username: mobilenumber
      })
    }
    const otp = await auth.generateOtp();
    //Dangerous - This should be handled via SMS only - Retain for testing purposes
    return res.json({ otp: otp, message: "OTP generated" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
async function otpAuth(req, res){
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const authModel = await db.model("Auth");
    
    const { mobilenumber, otp } = req.body;
    auth = await authModel.otpAuth(mobilenumber, otp, authModel);
    const token = await auth.generateAuthToken();
    return res.json({ token: token, message: "OTP Verified" });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

module.exports = {
  usernameAuth,
  createAuth,
  generateOtp,
  otpAuth,
};