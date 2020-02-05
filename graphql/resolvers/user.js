const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');



module.exports = {
    CreateUser: args => {
      return User.findOne({ email: args.userInput.email }).then(user => {
        if (user) {
          throw new Error("User Already Exists");
        }
        return bcrypt
          .hash(args.userInput.password, 12)
          .then(hashedPass => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPass,
              firstName: args.userInput.firstName,
              lastName: args.userInput.lastName
            });
            return user.save().then(result => {
              return { ...result._doc, password: null, _id: result.id };
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
        const token = jwt.sign({userId: user.id, email: user.email}, "TestToken1234!", {
            expiresIn : "1h"
        });
        return  { userId: user.id, token, tokenExpiration: 1}


    }
  }