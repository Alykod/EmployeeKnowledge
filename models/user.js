const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    default: "Tampa"
  },
  state: {
    type: String,
    required: true,
    default: "FL"
  },
  country: {
    type: String,
    required: true,
    default: "United States"
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    // required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  fullTimeEmployee: {
    type: Boolean,
    required: true,
    default: true
  },
  skills: [
    {
      skill: {
        type: Schema.Types.ObjectId,
        ref: "Skill",
        // unique: true,
      },
      level: {
        type: Number,
        // default: 1
      },
      interest: {
        type: Number,
        // default: 1
      }
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
