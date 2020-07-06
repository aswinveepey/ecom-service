const User = require("../models/user");

const user = async (req, res, next) => {
  try {
    const auth_id = req.auth?._id;
    const user = await User.findOne({ auth: auth_id });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "User only resource. Ensure valid user" });
  }
};

module.exports = { user };