const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const connectDB = require("./config/db");
const Skill = require("./models/skill");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const app = express();
connectDB();
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type Skill {
            _id: ID!
            name: String!
        }
        type User {
            _id: ID!
            firstName: String!
            lastName: String!
            password: String
            email: String
        }
        input UserInput {
            email: String!
            password: String!
            firstName: String!
            lastName: String!
        }
        input SkillInput {
            name: String!
            user: ID!
            level: Int!
        }
        type RootQuery {
            skills: [Skill!]! 
        }
        type RootMutation {
            CreateSkill(skillInput: SkillInput): Skill
            CreateUser(userInput: UserInput) : User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      skills: async () => {
        return await Skill.find();
      },
      CreateSkill: args => {
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
      },
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
                return { ...result._doc, passowrd: null, _id: result.id };
              });
            })
            .catch(err => {
              throw err;
            });
        });
      }
    },
    graphiql: true
  })
);

app.listen(3000);
