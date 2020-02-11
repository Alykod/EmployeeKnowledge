const Skill = require("../../models/skill");
const User = require("../../models/user");
const UserSkill = require("../../models/userSkills");

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


module.exports = {
    userSkills: async(req, res , next) => {
        if(!res.isAuth) {
            throw new Error("unauthorized")
        }
        try {
           const userSkills =  await UserSkill.find();
            return userSkills.map(userSkill => {
                return {...userSkill._doc, _id: userSkill.id, user: user.bind(this, userSkill._doc.user), skill: singleSkill.bind(this, userSkill._doc.skill)}
            })
        }catch (err){
            throw err
        }
    },
    CreateUserSkill: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("unauthorized")
        }
        let skill = await Skill.findOne({name: args.skillName});
        if(!skill) {
            const newSkill = new Skill({
                name: args.skillName
            })
            newSkill.save();
            skill = newSkill;
        }
        const user = await User.findOne({_id: args.userId});
            const newUserSkill = {
                level: args.level,
                skill: skill
            }
            user.skills.push(newUserSkill);
            const saveUSer = await user.save();
            console.log(saveUSer)
        // }
        return {...skill._doc, _id: skill.id}
    },
    users: async (args, req) => {
        if(!req.isAuth) {
           throw new Error("unauthorized")
        }
        const users = await User.find();
        return users.map(user => {
           const skills =  user.skills.map(skill => {
                // const skillTransformed = singleSkill.bind(this, skill._doc.skill);
                return { skill: singleSkill.bind(this, skill._doc.skill), level: skill._doc.level} 
            })
            return {...user._doc, _id: user.id, skills: skills}
        })
    },
    userById: async(args, res, req) => {
        // if(!req.isAuth) {
        //     throw new Error("unauthorized") 
        // }
        const user = await User.findById(args.userId);
        if(user.skills.length > 0) {
            const userSkills = user.skills.map(skill => {
                return {skill: singleSkill.bind(this, skill._doc.skill), level: skill._doc.level}
            }) 
            return {...user._doc, _id: user.id, skills: userSkills}
        } else {
           return {...user._doc, _id: user.id, skills: []}
        }
       
    }
  }