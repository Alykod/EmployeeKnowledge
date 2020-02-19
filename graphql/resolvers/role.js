const Role = require("../../models/role");

const role = async roleId => {
  try {
    const role = await Role.findById(roleId);
    return { ...role._doc, _id: role.id };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  CreateRole: async (args, req) => {
    if(!req.isAuth && !req.role !== "Admin") {
        throw new Error("unauthorized")
    }
    try {
      let roleExists = await Role.findOne({ name: args.role });

      if (roleExists) {
        return { ...roleExists._doc };
      }
      const newRole = new Role({
        name: args.role
      });
      newRole.save();
      return { ...newRole._doc };
    } catch (err) {
      throw err;
    }
  }
};
