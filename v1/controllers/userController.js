const userModel = require('../models/user')

async function getAllUsers(req,res){
  try {
    users = await userModel.find().lean();
    return res.json({ data: users });
  } catch (error) {
    return res.status(400).json({message: error});
  }
}

async function createUser(req,res){
  try {
    var {
      firstname,
      lastname,
      auth,
      role,
      contactnumber,
      designation,
      contactaddress,
      divisions,
      territories,
    } = req.body;
    user = new userModel({
      firstname: firstname,
      lastname: lastname,
      auth: auth,
      role: role,
      contactnumber: contactnumber,
      designation: designation,
      contactaddress: contactaddress,
    });
    user.save();
    divisions.forEach(element => {
      user.divisions.push(element);
      user.save();
    });
    territories.forEach((element) => {
      user.divisions.push(element);
      user.save();
    });
    return res.json({ data: user.auth.username });
  } catch (error) {
    return res.status(400).json({message: error});
  }
}

module.exports = {getAllUsers, createUser};