const accountModel = require('../models/account')
const mongoose = require("mongoose");

async function getAllAccounts(req, res){
  try {
    accounts = await accountModel
      .find()
      .populate("address")
      .lean()
      .limit(250);
    res.json({data:accounts})
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function getOneAccount(req, res) {
  try {
    const { accountId } = req.params;
    !accountId && res.status(400).json({message: "Account ID is Required to carry out the operation"})
    account = await accountModel.findById(accountId).populate("address").lean();
    return res.json({ data: account });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

async function createAccount(req, res){
  try {
    var {name, type, gstin, primarycontact, address} = req.body;
    var account;
    await accountModel
      .create({
        name: name,
        type: type,
        gstin: gstin,
        primarycontact: primarycontact,
      })
      .then((data) => {
        account = data;
      })
      .catch((err) => res.status(400).send({ error: err }));
    await address.forEach(el => {
      account.address.push(el)
    });
    await account.save();
    return res.json({data: account})
  } catch (error) {
    return res.status(400).send({message: error})
  }
}

async function searchAccount(req, res) {
  const { searchString } = req.body;
  try {
    accountModel
      // .aggregate([{ $match: { $text: { $search: searchString } } }])
      .find({ $text: { $search: searchString } })
      .select("name _id")
      .limit(3)
      .exec(function (err, docs) {
        if (err) {
          return res.status(400).json({ message: err });
        }
        return res.send(docs);
      });
    // return res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

async function updateAccount(req, res) {
  try {
    var { _id, name, type, primarycontact, address } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Account ID" });
    }
    account = await accountModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          type: type,
          primarycontact: primarycontact
        },
      },
      { new: true }
    );
    await address.forEach((element) => {
      account.address.push(element);
    });
    await account.save();
    return res.json(account);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

module.exports = {
  getAllAccounts,
  getOneAccount,
  createAccount,
  searchAccount,
  updateAccount,
};