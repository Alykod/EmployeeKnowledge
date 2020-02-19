const Skill = require("../../models/skill");
const User = require("../../models/user");
const Role = require("../../models/role")

   module.exports = {
    skills: async () => {
      return await Skill.find();
    },
    roles: async() => {
      return await Role.find();
      // let users = await User.find();
      // let roles = [];
      // users.forEach(user => {
      //   !roles.includes(user.role) && roles.push(user.role)
      // })
      // return roles
    },
    locations: async () => {
      let users = await User.find();
      let locations = {cities: [], countries: [], states: []};
      users.forEach(user => {
        !locations.cities.includes(user.city.toLowerCase()) && locations.cities.push(user.city.toLowerCase());
        !locations.countries.includes(user.country.toLowerCase()) && locations.countries.push(user.country.toLowerCase());
        !locations.states.includes(user.state.toLowerCase()) && locations.states.push(user.state.toLowerCase());
      })
      return locations
    },
    CreateSkill: (args, req) => {
        if(!req.isAuth) {
            throw new Error("unauthorized")
        }
      let skill = Skill.find({name: args.skillInput.name.toLowerCase()});
      if(!skill){
        skill = new Skill({
          name: args.skillInput.name.toLowerCase()
        });
        skill.save();
      }
      return User.findById(args.skillInput.user)
        .then(user => {
          if (user) {
            const skills = {
              skill: skill,
              level: args.skillInput.level,
              interest: args.skillInput.interest
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