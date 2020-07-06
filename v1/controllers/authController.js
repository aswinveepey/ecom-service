const authModel = require("../models/auth");
/**
 * Create auth
 * @param {username} req
 * @param {password} req
 * @param {token} res
 */

async function verifyAuth(req, res){
  try {
    const { username, password } = req.body;
    auth = await authModel.usernameAuth(username, password);
    const token = await auth.generateAuthToken();
    return res.json({ token: token });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}
async function createAuth(req, res) {
  try {
    const payload = req.body;
    auth = new authModel(payload);
    await auth.save();
    token = await auth.generateAuthToken();
    return res.json({ token: token });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: err.message });
  }
}

module.exports = {
  verifyAuth,
  createAuth,
};