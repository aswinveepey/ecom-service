const permissionModel = require("../models/permissions");

async function getPermissions(req, res) {
  return res.json({ message: "All Permissions will be populated here" });
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