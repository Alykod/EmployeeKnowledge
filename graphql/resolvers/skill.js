const Skill = require("../../models/skill");
const User = require("../../models/user");


   module.exports = {
    skills: async () => {
      return await Skill.find();
    },
    CreateSkill: (args, req) => {
        if(!req.isAuth) {
            throw new Error("unauthorized")
        }
      const skill = new Skill({
        name: args.skillInput.name
      });
      return User.findById(args.skillInput.user)
        .then(user => {
          if (user) {
            const skills = {
              skill: skill,
              level: args.skillInput.level
            };
            user.skills.push(skills);
            return user.save().then((saved)=> {
              return skill.save().then(result => {
                  return { ...result._doc };
              }); 
            }).catch((err)=> {
              throw err
            })
          }
          
        })
        .catch(err => {
          throw err;
        });
    }
  }