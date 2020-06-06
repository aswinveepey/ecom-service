const roleModel = require('../models/roles')
// const permissionModel = require('../models/permission')

async function getRoles(req, res){
  const roles = await roleModel.find().populate("permissions");
  console.log(roles)
  res.send(roles)
}

async function createRoles(req, res){
  try {
    const {name, permissions} = req.body;
    role = new roleModel({name: name});
    role.save();
    permissions.forEach(element => {
      // permissionsObj = PermissionModel.findOne({ id: element.id });
      role.permissions.push(element.id);
      role.save();
    });
    res.json({message: 'Role Added Succesfully'})
  } catch (error) {
    res.status(400).json({error: error})
  }
}

module.exports = {getRoles, createRoles}