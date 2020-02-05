const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSkillsSchema = new Schema(
  {
    skill: {
      type: Schema.Types.ObjectId,
      ref: "Skill"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    level: {
      type: Number
    }
  }
);


module.exports = mongoose.model('UserSkill', userSkillsSchema);