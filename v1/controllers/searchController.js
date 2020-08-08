// const User = require("../models/user");


async function search(req, res) {
  try {
    const { searchString } = req.body;
    const db = req.db;
    const userModel = await db.model("User");

    // var searchReqArr = [];
    const query = [
      { $match: { $text: { $search: searchString } } },
      { $limit: 2 },
    ];
    // const searchresult = await Promise.all(
    //   searchReqArr.push(userModel.aggregate(query))
    // );
    const searchresult = await userModel.aggregate(query);

    console.log(searchresult)
    return res.json({ data: searchresult });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { search };