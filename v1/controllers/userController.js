const userModel = require('../models/user')
const authModel = require('../models/auth')
const mongoose = require("mongoose");

async function getAllUsers(req,res){
  try {
    users = await userModel
      .find()
      .populate({ path: "role", select: "name" })
      .populate({ path: "territories", select: "name" })
      .populate({ path: "divisions", select: "name" })
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .lean();
    return res.json({ data: users });
  } catch (error) {
    return res.status(400).json({message: error});
  }
}

async function getOneUser(req,res){
  try {
    const { userId } = req.params;
    user = await userModel
      .findById(userId)
      .populate({ path: "role", select: "name" })
      .populate({ path: "territories", select: "name" })
      .populate({ path: "divisions", select: "name" })
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .lean();
    return res.json({ data: user });
  } catch (error) {
    return res.status(400).json({message: error});
  }
}

async function createUser(req, res) {
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
    newauth =  await authModel.create({
      username: auth.username,
      mobilenumber: auth.mobilenumber,
      email: auth.email,
      password: auth.password,
      status: auth.status
    })
    user = await userModel.create({
      firstname: firstname,
      lastname: lastname,
      role: role._id,
      contactnumber: contactnumber,
      designation: designation,
      contactaddress: contactaddress,
      auth: newauth._id
    });
    divisions.forEach((element) => {
      user.divisions.push(element);
    });
    territories.forEach((element) => {
      user.divisions.push(element);
    });
    user.save()
    return res.json({ data: user.auth.username });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function updateUser(req,res){
  try {
    var {
      _id,
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
    if ( !mongoose.Types.ObjectId.isValid(_id) ) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }
    if ( !mongoose.Types.ObjectId.isValid(role._id)) {
      return res.status(400).json({ message: "Invalid Role ID" });
    }
    if ( !mongoose.Types.ObjectId.isValid(auth._id)) {
      return res.status(400).json({ message: "Invalid Auth ID" });
    }
    user = await userModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          firstname: firstname,
          lastname: lastname,
          contactnumber: contactnumber,
          designation: designation,
          contactaddress: contactaddress,
          role: role._id,
          divisions: divisions.map((data) => data._id),
          territories: territories.map((data) => data._id),
        },
      },
      { new: true }
    );
    await authModel.findByIdAndUpdate(mongoose.Types.ObjectId(auth._id), {
      $set: {
        username: auth.username,
        mobilenumber: auth.mobilenumber,
        email: auth.email,
        status: auth.status,
      },
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({message: error});
  }
}

module.exports = { getAllUsers, createUser, getOneUser, updateUser };