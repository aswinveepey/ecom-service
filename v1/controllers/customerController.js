const customerModel = require("../models/customer");
const authModel = require("../models/auth");

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

async function getOneCustomers(req, res) {
  try {
    var {customerId} = req.body;
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
    newauth = await authModel.create({
      username: auth.username,
      mobilenumber: auth.mobilenumber,
      email: auth.email,
      password: auth.password,
      status: auth.status,
    });
    token = await newauth.generateAuthToken();
    user = userModel.create({
      firstname: firstname,
      lastname: lastname,
      type: type,
      gender: gender,
      birthday: birthday,
      contactnumber: contactnumber,
      account: account._id,
      auth: newauth._id
    });
    address.forEach((el) => {
      user.address.push(el);
    });
    user.save();
    return res.json({ data: user });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
}

moduls.exports = { getAllCustomers, getOneCustomers, createCustomer };
