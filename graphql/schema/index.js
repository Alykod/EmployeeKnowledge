const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type UserSkill {
    _id: ID!,
    skill: Skill!,
    user: User!,
    level: Int!
}
type Skill {
    _id: ID!
    name: String!
}
type Skills {
    skill: Skill!,
    level: Int!
}
type User {
    _id: ID!
    firstName: String!
    lastName: String!
    password: String
    email: String
}
type Auth {
    userId: ID!,
    token: String!,
    tokenExpiration: Int!
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
}
type RootQuery {
    skills: [Skill!]! 
    userSkills: [UserSkill!]!
    login(email: String!, password: String!): Auth!
}
type RootMutation {
    CreateSkill(skillInput: SkillInput): Skill
    CreateUser(userInput: UserInput) : User
    CreateUserSkill(skillName: String!, userId: ID!, level: Int!) : UserSkill
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)