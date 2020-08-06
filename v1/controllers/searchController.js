const User = require("../models/user");


async function globalSearch(req, res){
  try {
  const { searchString } = req.body;
  const { tenantId } = req.query;
  
  const dbConnection = await global.clientConnection;
  const db = await dbConnection.useDb(tenantId);
  const userModel = await db.model("User");

  var searchReqArr = []
  const searchresult = await Promise.all(
    searchReqArr.push(
      userModel
        .find({ $text: { $search: searchString } })
        .select("firstname lastname _id")
        .limit(3)
    )
  );
  return res.json({ data: searchresult }); 
  } catch (error) {
    return res.status(400).json({ error: error.message }); 
  }
}

module.exports = {globalSearch}