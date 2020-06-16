const accountModel = require('../models/account')

async function getAllAccounts(req, res){
  try {
    accounts = await accountModel.find().lean().limit(250)
    res.json({data:accounts})
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

moduls.exports = {getAllAccounts}