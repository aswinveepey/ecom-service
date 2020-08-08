// const Customer = require("../models/customer");
// const Auth = require("../models/auth");
const mongoose = require("mongoose");

async function getAllCustomers(req, res) {
  try {
    const db = req.db;
    const customerModel = await db.model("Customer");

    customers = await customerModel
      .find()
      .populate("account")
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .populate("address")
      .lean()
      .limit(250);
    return res.json({ data: customers });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getOneCustomer(req, res) {
  try {
    var {customerId} = req.params;
    const db = req.db;
    const customerModel = await db.model("Customer");

    !customerId && res.status(400).json({message: "Customer ID is Required to carry out the operation"})
    customer = await customerModel
      .findById(customerId)
      .populate("account")
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .populate("address")
      .lean();
    return res.json({ data: customer });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getSelf(req, res) {
  try {
    const auth = req.auth;
    const db = req.db;
    const customerModel = await db.model("Customer");

    customer = await customerModel
      .findOne({"auth":auth._id})
      .populate("account")
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .populate("address")
      .lean();
    if(!customer) throw new Error("Customer Not Found")

    return res.json({ data: customer });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function registerCustomer(req, res) {
  try {
    var {
      firstname,
      lastname,
      gender,
      birthday,
      contactnumber,
      address,
    } = req.body;
    const db = req.db;
    const customerModel = await db.model("Customer");

    var customer;
    auth = req.auth
    if(!auth) {throw new Error("Issue verifying auth token")}
    //create customer
    await customerModel
      .create({
        firstname: firstname,
        lastname: lastname,
        type: "Regular",
        gender: gender,
        birthday: birthday,
        contactnumber: contactnumber,
        address: address,
        auth: auth,
      })
      .then((data) => {
        customer = data;
      })
    return res.json({ data: customer });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function selfUpdateCustomer(req, res) {
  try {
    var {
      firstname,
      lastname,
      gender,
      birthday,
      contactnumber,
      address,
      currentaddressindex,
    } = req.body;

    const db = req.db;
    const customerModel = await db.model("Customer");

    const customer = req.customer
    currentaddressindex = currentaddressindex || 0;

    if(!customer) res.status(401).json({message: "Invalid Customer"})

    //create customer
    await customerModel
      .findByIdAndUpdate(mongoose.Types.ObjectId(customer._id), {
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        birthday: birthday,
        contactnumber: contactnumber,
        address: address,
        currentaddressindex: currentaddressindex,
      }, { new: true })
      .then((data) => {
        customer = data;
      })
    return res.json({ data: customer, message: "Customer Successfully Updated" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function createCustomer(req, res) {
  try {
    var {
      firstname,
      lastname,
      type,
      gender,
      birthday,
      contactnumber,
      address,
      auth,
      account
    } = req.body;
    const db = req.db;
    const customerModel = await db.model("Customer");
    const authModel = await db.model("Auth");

    var customer;
    //create
    newAuth = await authModel.create({
      username: auth.username,
      mobilenumber: auth.mobilenumber,
      email: auth.email,
      password: auth.password,
      status: true,
    })
    await newAuth.generateAuthToken();
    //create customer
    await customerModel
      .create({
        firstname: firstname,
        lastname: lastname,
        type: type,
        gender: gender,
        birthday: birthday,
        contactnumber: contactnumber,
        account: account?._id,
        address: address,
        auth: newAuth._id,
      })
      .then((data) => {
        customer = data;
      })
    return res.json({ data: customer, message: "Customer Successfully Created" });

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function updateCustomer(req, res) {
  try {
    var {
      _id,
      type,
      firstname,
      lastname,
      account,
      gender,
      birthday,
      contactnumber,
      address,
      currentaddressindex,
      auth
    } = req.body;
    const db = req.db;
    const customerModel = await db.model("Customer");
    const authModel = await db.model("Auth");

    currentaddressindex = currentaddressindex || 0;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error("Invalid Customer ID");
    }

    if (account && !mongoose.Types.ObjectId.isValid(account._id)) {
      throw new Error("Invalid Account ID");
    }

    customer = await customerModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          firstname: firstname,
          lastname: lastname,
          type: type,
          contactnumber: contactnumber,
          account: account?._id,
          gender: gender,
          birthday: birthday,
          address: address,
          currentaddressindex: currentaddressindex,
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
    return res.json({ data: customer, message: "Customer Successfully Updated" });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function searchCustomer(req, res) {

  try {
    const { searchString } = req.body;
    const db = req.db;
    const customerModel = await db.model("Customer");

    const customers = await customerModel.aggregate([
      { $match: { $text: { $search: searchString } } },
      { $limit: 5 },
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "account",
        },
      },
      { $unwind: { path: "$account", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "auths",
          localField: "auth",
          foreignField: "_id",
          as: "auth",
        },
      },
      { $unwind: { path: "$auth", preserveNullAndEmptyArrays: true } },
    ]);
    return res.json({ data: customers })

  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getAllCustomers,
  getOneCustomer,
  createCustomer,
  updateCustomer,
  searchCustomer,
  getSelf,
  registerCustomer,
  selfUpdateCustomer,
};
