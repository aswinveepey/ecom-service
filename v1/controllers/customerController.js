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
    var newAuth;
    var token;
    var customer;
    //create
    await authModel.create({
      username: auth.username,
      mobilenumber: auth.mobilenumber,
      email: auth.email,
      password: auth.password,
      status: true,
    }).then(data=>{
      newAuth = data;
    }).catch(err=>{
      // console.log(err);
      return res.status(400).send({'error': err})
    });
    //generate token
    await newAuth
      .generateAuthToken()
      .then((data) => {
        token = data;
      })
      .catch((err) => {
        // console.log(err);
        return res.status(400).send({ error: err });
      });
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
        auth: newAuth._id,
      })
      .then((data) => {
        customer = data;
      })
      .catch((err) => {
        // console.log(err);
        return res.status(400).send({ error: err })
      });

    await address.forEach((el) => {
      customer.address.push(el);
    });
    await customer.save();
    return res.json({ data: customer });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err });
  }
}

module.exports = { getAllCustomers, getOneCustomers, createCustomer };
