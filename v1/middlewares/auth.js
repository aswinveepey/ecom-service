const jwt = require("jsonwebtoken");
const Auth = require("../models/auth");

const auth = async(req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);
    const auth = await Auth.findOne({ _id: data._id, "token": token });
    if (!auth) {
      throw new Error();
    }
    if(!auth.status){
      throw new Error();
    }
    req.auth = auth;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
}

module.exports = { auth };
