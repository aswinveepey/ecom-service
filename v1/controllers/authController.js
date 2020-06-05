const authModel = require("../models/auth");
/**
 * Create auth
 * @param {username} req
 * @param {password} req
 * @param {token} res
 */

async function createAuth(req, res){
  try {
    const { username, password } = req.body;
    auth = await authModel.usernameAuth(username, password);
    return res.send({auth});
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

module.exports = {
  createAuth
};