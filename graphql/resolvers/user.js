const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const Role = require("../../models/role")


const userRole = async roleId => {
  try {
      const role = await Role.findById(roleId)
      return {...role._doc, _id: role.id}
  } catch (err) {
      throw err
  }
}


module.exports = {
    CreateUser: args => {
      return User.findOne({ email: args.userInput.email }).then(user => {
        if (user) {
          throw new Error("User Already Exists");
        }
        return bcrypt
          .hash(args.userInput.password, 12)
          .then(async(hashedPass) => {
            let role = await Role.findOne({name: "unassigned"})
            if(!role) {
              role =   new Role({
                name: "unassigned"
              })
              role.save();
            }
            
            const user = new User({
              email: args.userInput.email,
              password: hashedPass,
              firstName: args.userInput.firstName,
              lastName: args.userInput.lastName,
              fullTimeEmployee: args.userInput.fullTimeEmployee,
              country: args.userInput.country,
              state: args.userInput.state,
              city: args.userInput.city,
              role: role,
              skills: []
            });
            return user.save().then(result => {
              const token = jwt.sign({userId: user.id, email: user.email, role: user.role.name}, "Test1234@0!!", {
                expiresIn : "1h"
            });
              return { tokenExpiration: 1, token, userId: result.id };
            });
          })
          .catch(err => {
            throw err;
          });
      });
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email});
        if(!user) {
            throw new Error("User Doesn't exist")
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            throw new Error("Incorrect Password");
        }
        let role = await userRole(user.role)
        const token = await jwt.sign({userId: user.id, email: user.email, role: role.name}, "Test1234@0!!", {
            expiresIn : "1h"
        });
        return  { userId: user.id, token, tokenExpiration: 1}


    }
  }