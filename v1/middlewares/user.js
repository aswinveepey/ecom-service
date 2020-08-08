// const User = require("../models/user");

const user = async (req, res, next) => {
  try {
    const auth_id = req.auth?._id;
    
    //get db object and model
    const db = req.db;
    const userModel = await db.model("User");
    
    //get user and append to req object
    const user = await userModel
      .findOne({ auth: auth_id })
      .populate({ path: "role", select: "name" });
    
      //throw error if invalid user
      if (!user) {
      throw new Error("Invalid User");
    }
    req.user = user;
    next();
  
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { user };