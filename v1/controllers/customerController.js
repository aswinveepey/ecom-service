const customerModel = require("../models/customer");
const authModel = require("../models/auth");
const mongoose = require("mongoose");

async function getAllCustomers(req, res) {
  try {
    customers = await customerModel
      .find()
      .populate("account")
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .populate("address")
      .lean()
      .limit(250);
    res.json({ data: customers });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function getOneCustomer(req, res) {
  try {
    var {customerId} = req.params;
    !customerId && res.status(400).json({message: "Customer ID is Required to carry out the operation"})
    customer = await customerModel
      .findById(customerId)
      .populate("account")
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .populate("address")
      .lean();
    res.json({ data: customer });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function getSelf(req, res) {
  try {
    let auth = req.auth;
    customer = await customerModel
      .findOne({"auth":auth._id})
      .populate("account")
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .populate("address")
      .lean();
    !customer && res.status(400).json({message: "Customer Not Found"})
    res.json({ data: customer });
  } catch (error) {
    return res.status(400).json({ message: error });
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

    var customer;
    auth = req.auth
    if(!auth) res.status(401).json({message: "Issue verifying auth token"})
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
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({ error: err });
      });
    return res.json({ data: customer });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
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
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({ error: err });
      });
    return res.json({ data: customer, message: "Customer Successfully Updated" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
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
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({ error: err })
      });
    return res.json({ data: customer, message: "Customer Successfully Created" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
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
    } = req.body;

    currentaddressindex = currentaddressindex || 0;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Customer ID" });
    }

    if (account && !mongoose.Types.ObjectId.isValid(account._id)) {
      return res.status(400).json({ message: "Invalid Account ID" });
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
    return res.status(400).json({ message: error });
  }
}

async function searchCustomer(req, res) {
  const { searchString } = req.body;
  try {
    customerModel
      .find(
        { $text: { $search: searchString } },
        { score: { $meta: "textScore" } }
      )
      .populate("account")
      .populate({ path: "auth", select: "username email mobilenumber status" })
      .populate("address")
      .sort({ score: { $meta: "textScore" } })
      .lean()
      .limit(3)
      .exec(function (err, docs) {
        if (err) {
          return res.status(400).json({ message: err });
        }
        return res.json({ data: docs });
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
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
