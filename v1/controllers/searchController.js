const userModel = require("../models/user");


async function globalSearch(req, res){
  const { searchString } = req.body;
  var searchReqArr = []
  searchReqArr.push(
    userModel
      .find({ $text: { $search: searchString } })
      .select("firstname lastname _id")
      .limit(3)
  );
  Promise.all(searchReqArr).then(response=>res.send(response)).catch(err=>res.status(400).json(err));
}

module.exports = {globalSearch}