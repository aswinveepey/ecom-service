const permissionModel = require("../models/permission");

async function getPermissions(req, res) {
  permissions = await permissionModel.find();
  return res.json({ data: permissions });
}

async function createPermission(req, res){
  try {
    const payload = req.body;
    permission = new permissionModel(payload);
    permission.save();
    return res.json({ message: "Permission Added" });
  } catch (error) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getPermissions,
  createPermission,
};