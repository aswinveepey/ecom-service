// const Role = require('../models/roles')
// const permissionModel = require('../models/permission')

async function getRoles(req, res){
  try {
    
    const db = req.db;
    const roleModel = await db.model("Role");

    const roles = await roleModel.find().populate("permissions").lean();
    return res.json({ data: roles });

  } catch (error) {
    return res.status(400).json({error:error.message})
  }
}

async function createRoles(req, res){
  try {
    const {name, permissions} = req.body;
    const db = req.db;
    const roleModel = await db.model("Role");
    
    role = new roleModel({name: name});
    role.save();
    permissions.forEach(element => {
      role.permissions.push(element.id);
      role.save();
    });
    return res.json({message: 'Role Added Succesfully'})
  } catch (error) {Cookies.get("token");
    return res.status(400).json({error: error})
  }
}

module.exports = {getRoles, createRoles}