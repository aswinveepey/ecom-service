const Permission = require("../models/permission");

async function getPermissions(req, res) {
  try {
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const permissionModel = await db.model("Permission");

    permissions = await permissionModel.find();
    return res.json({ data: permissions });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function createPermission(req, res){
  try {
    const payload = req.body;
    const { tenantId } = req.query;
    const dbConnection = await global.clientConnection;
    const db = await dbConnection.useDb(tenantId);
    const permissionModel = await db.model("Permission");

    permission = new permissionModel(payload);
    await permission.save();
    return res.json({ data:permission, message: "Permission Added" });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getPermissions,
  createPermission,
};