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
      return res.status(200).json({ message: "Authentication Succesful" });
    } else {
      return res.status(401).json({ message: "Password Error" });
    }
  } else {
    return res.status(401).json({ message: "Username Error" });
  }

}

module.exports = {
  createAuth
};