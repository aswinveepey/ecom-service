const Account = require("../models/account");
const mongoose = require("mongoose");

async function getAllAccounts(req, res) {
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const accountModel = await db.model("Account");

    accounts = await accountModel.find().populate("address").lean().limit(250);
    return res.json({ data: accounts });
    
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getOneAccount(req, res) {
  try {
    const { accountId } = req.params;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const accountModel = await db.model("Account");

    if (!accountId) {
      throw new Error("Account ID is Required to carry out the operation");
    }
    account = await accountModel.findById(accountId).populate("address").lean();
    return res.json({ data: account });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function createAccount(req, res) {
  try {
    var { name, type, gstin, primarycontact, address } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const accountModel = await db.model("Account");

    const account = await accountModel.create({
      name: name,
      type: type,
      gstin: gstin,
      primarycontact: primarycontact,
      address: address,
    });
    return res.json({ data: account });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function searchAccount(req, res) {
  try {
    const { searchString } = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const accountModel = await db.model("Account");

    const accounts = await accountModel.aggregate([
      { $match: { $text: { $search: searchString } } },
      { $limit: 3 },
    ]);
    return res.json({ data: accounts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

async function updateAccount(req, res) {
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const accountModel = await db.model("Account");

    var { _id, name, type, primarycontact, address, gstin } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error("Invalid Account ID")
    }
    
    account = await accountModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(_id),
      {
        $set: {
          name: name,
          type: type,
          gstin: gstin,
          primarycontact: primarycontact,
          address: address,
        },
      },
      { new: true }
    );

    return res.json({ data: account });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllAccounts,
  getOneAccount,
  createAccount,
  searchAccount,
  updateAccount,
};
