/**
 * Create auth
 * @param {username} req
 * @param {password} req
 * @param {token} res
 */

function createAuth(req, res){
  const {username, password} = req.body;
  if (username === "admin@littech.in") {
    if (password === "secret") {
      return res.status(200).json("Authentication Succesful");
    } else {
      return res.status(401).json("Password Error");
    }
  } else {
    return res.status(401).json("Username Error");
  }

}

module.exports = {
  createAuth
};