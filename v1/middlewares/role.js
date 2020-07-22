const admin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!(user.role.name.toLowerCase()==="admin")) {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).send({ message: "Admin only resource. Ensure valid permissions" });
  }
};

module.exports = { admin };
