const accountModel = require('../models/account')

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
    account = accountModel.create({
      name: name,
      type: type,
      gstin: gstin,
      primarycontact: primarycontact
    })
    address.forEach(el => {
      account.address.push(el)
    });
    account.save();
    return res.json({data: account})
  } catch (error) {
    return res.status(400).send({message: error})
  }
}

moduls.exports = { getAllAccounts, getOneAccount, createAccount };