async function bulkUploadInventory(req, res){
  try {
    console.log(req.body)
    return res.json({data:null})
  } catch (error) {
    return res.status(400).json({error:error.message})
  }
}

module.exports = {
  bulkUploadInventory,
};
