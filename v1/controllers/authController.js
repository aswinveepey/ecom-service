// const Auth = require("../models/auth");
/**
 * Create auth
 * @param {username} req
 * @param {password} req
 * @param {token} res
 */

async function createAuth(req, res) {
  try {
    const payload = req.body;
    const db = req.db;
    const authModel = await db.model("Auth");

    auth = new authModel(payload);
    await auth.save();
    token = await auth.generateAuthToken();
    return res.json({ data: token, message: "Authentication Created" });

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}
async function usernameAuth(req, res) {
  try {
    const { username, password } = req.body;
    const db = req.db;
    const authModel = await db.model("Auth");

    auth = await authModel.usernameAuth(username, password, authModel);
    const token = await auth.generateAuthToken();
    
    return res.json({ data: token, message:"Authentication Succesful" });

  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}
async function generateOtp(req, res){
  try {
    const { mobilenumber } = req.body;
    const db = req.db;
    const authModel = await db.model("Auth");

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioclient = require("twilio")(accountSid, authToken);

    auth = await authModel.findOne({ mobilenumber: mobilenumber });
    if (!auth){
      auth = await authModel.create({
        mobilenumber: mobilenumber,
        username: mobilenumber
      })
    }
    const otp = await auth.generateOtp();

    await twilioclient.messages.create({
      body: `Use OTP ${otp} to login`,
      from: "+12163036659",
      to: `+91${mobilenumber}`,
    });

    return res.json({message: "OTP generated" });

  } catch (err) {

    return res.status(400).json({ error: err.message });
  }
}
async function otpAuth(req, res){
  try {
    const { mobilenumber, otp } = req.body;
    const db = req.db;
    const authModel = await db.model("Auth");
    
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