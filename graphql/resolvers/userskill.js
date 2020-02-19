const Skill = require("../../models/skill");
const User = require("../../models/user");
const Role = require("../../models/role");

const user = async userId => {
    return User.findById(userId).then(user => {
        return {...user._doc, _id: user.id}
    }).catch(err => {
        throw err})
}

const singleSkill = async skillId => {
    try {
        const skill = await Skill.findById(skillId);
        return {...skill._doc, _id: skill.id}
   
    }catch (err) {
        throw err
    }
   }

const userRole = async roleId => {
    try {
        const role = await Role.findById(roleId)
        return {...role._doc, _id: role.id}
    } catch (err) {
        throw err
    }
}


module.exports = {
    CreateUserSkill: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("unauthorized")
        }
        let skill = await Skill.findOne({name: args.skillName.toLowerCase()});
        if(!skill) {
            const newSkill = new Skill({
                name: args.skillName.toLowerCase()
            })
            newSkill.save();
            skill = newSkill;
        }
        const user = await User.findOne({_id: args.userId});
            const newUserSkill = {
                level: args.level,
                skill: skill,
                interest: args.interest
            }
            user.skills.push(newUserSkill);
            const saveUSer = await user.save();
            console.log(saveUSer)
        // }
        return {...skill._doc, _id: skill.id}
    },
    ChangeUserAvailability: async (args, req) => {
        // if(!req.isAuth || req.role !== "Admin") {
        //     throw new Error("unauthorized");
        // }
        let user = await User.findOne({_id: args.userId});
        // let available = args.available
        if(typeof args.available === "boolean") {
            user.available = args.available;
        }
        if(typeof args.active === "boolean") {
            user.active = args.active;
        }
        if(args.role) {
            let roleValues = await Role.findOne({name: args.role.toLowerCase()});
            if(!roleValues) {
                throw new Error("Role Does not Exist")
            }
            user.role = roleValues;
        }
        const saveUser = await user.save();

        return {...user._doc, _id: user.id}
    },
    users: async (args, req) => {
        if(!req.isAuth) {
           throw new Error("unauthorized")
        }
        const users = await User.find({"active": true});
        return users.map(user => {
           const skills =  user.skills.map(skill => {
                // const skillTransformed = singleSkill.bind(this, skill._doc.skill);
                return { skill: singleSkill.bind(this, skill._doc.skill), level: skill._doc.level,  interest: skill._doc.interest} 
            })
            return {...user._doc, _id: user.id, skills: skills, role: userRole.bind(this, user._doc.role)}
        })
    },
    userById: async(args, res, req) => {
        if(!res.isAuth) {
            throw new Error("unauthorized") 
        }
        const user = await User.findById(args.userId);
        if(user.skills.length > 0) {
            const userSkills = user.skills.map(skill => {
                return {skill: singleSkill.bind(this, skill._doc.skill), level: skill._doc.level, interest: skill._doc.interest}
            }) 
            return {...user._doc, _id: user.id, skills: userSkills, role: userRole.bind(this, user._doc.role)}
        } else {
           return {...user._doc, _id: user.id, skills: [], role: userRole.bind(this, user._doc.role)}
        }
       
    }
  }