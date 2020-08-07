const User = require('../models/user')
const Auth = require('../models/auth')
const mongoose = require("mongoose");

async function getAllUsers(req,res){
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const userModel = await db.model("User");
    users = await userModel
      .find()
      .populate({ path: "role", select: "name" })
      .populate({ path: "territories", select: "name" })
      .populate({ path: "divisions", select: "name" })
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .lean()
      .limit(250);
    return res.json({ data: users });
  } catch (error) {
    return res.status(400).json({message: error?.message});
  }
}

async function getOneUser(req,res){
  try {
    const { userId } = req.params;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const userModel = await db.model("User");

    user = await userModel
      .findById(userId)
      .populate({ path: "role", select: "name" })
      .populate({ path: "territories", select: "name" })
      .populate({ path: "divisions", select: "name" })
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .lean();
    return res.json({ data: user });
  } catch (error) {
    return res.status(400).json({message: error?.message});
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);

    const userModel = await db.model("User");
    const authModel = await db.model("Auth");

    newauth =  await authModel.create({
      username: auth.username,
      mobilenumber: auth.mobilenumber,
      email: auth.email,
      password: auth.password,
      status: true
    })
    token = await newauth.generateAuthToken();
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
      user.territories.push(element);
    });
    user.save()
    return res.json({ data: user.auth.username });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error?.message });
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
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const userModel = await db.model("User");
    const authModel = await db.model("Auth");

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
    return res.status(400).json({message: error?.message});
  }
}

async function searchUser(req, res){
  try {
    const { searchString } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const userModel = await db.model("User");

    const users = await userModel.aggregate([
      { $match: { $text: { $search: searchString } } },
      { $limit: 5 },
    ]);

    return res.json({ data: users });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error?.message });
  }
}

async function getUserNav(req, res) {
  const data = [
    { nav: "/home", label: "Home", name: "home" },
    { nav: "/catalog", label: "Catalog", name: "catalog" },
    { nav: "/customer", label: "Customers", name: "customers" },
    { nav: "/order", label: "Orders", name: "orders" },
    { nav: "/merchandizing", label: "Merchandizing", name: "merchandizing" },
    { nav: "/bulkoperations", label: "Bulk Operations", name: "bulkoperations" },
    { nav: "/admin", label: "Admin", name: "admin" },
  ];
  return res.json({ data : data});
}

async function getSelf(req, res){
  try {
    //fetch user details from request middleware
    const user = req.user
    //throw error if not user
    if(!user) throw new Error("Invalid Credentials")
    //return data
    return res.json({data:user, message:"Succesfully fetched user details"})

  } catch (error) {
    //catch log & return error
    console.log(error)
    res.status(400).json({message:error?.message})

  }
}

module.exports = {
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  searchUser,
  getUserNav,
  getSelf,
};