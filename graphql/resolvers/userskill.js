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
        const skill = await Skill.findOne({name: args.skillName});
        const user = await User.findOne({_id: args.userId});
        const userSkill = new UserSkill({
           skill: skill,
           user:  user,
           level: args.level
        })

        const result = await userSkill.save();
        return {...result._doc, _id: result.id}
    },
  }