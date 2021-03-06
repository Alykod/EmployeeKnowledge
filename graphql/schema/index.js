const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type UserSkill {
    _id: ID!,
    skills: Skills!,
    user: NewUser!,
    level: Int!
    interest: Int!
}
type NewUser {
    _id: ID!
    firstName: String!
    lastName: String!
    password: String
    email: String
    city: String
    state: String
    available: Boolean
    role: String
}
type Role {
    _id: ID!,
    name: String!
}
type Skill {
    _id: ID!
    name: String!
}
type Skills {
    skill: Skill!
    level: Int
    interest: Int
}
type Locations {
    cities: [String!]!
    states: [String!]!
}
type Roles {
    role: [Role!]!
}
type DiffSkills {
    name: String!
    level: Int!
    interest: Int!
}
type User {
    _id: ID!
    firstName: String!
    lastName: String!
    password: String
    email: String
}
type UserWithSkills {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    skills: [Skills]
    city: String
    state: String
    available: Boolean
    fullTimeEmployee: Boolean
    role: Role
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
    state: String!
    city: String!
    fullTimeEmployee: Boolean!
    role: String!

}
input SkillInput {
    name: String!
    user: ID!
}
type RootQuery {
    skills: [Skill!]!
    locations: Locations! 
    roles: [Role!]!
    login(email: String!, password: String!): Auth!
    users: [UserWithSkills!]!
    userById(userId: String!): UserWithSkills!
}
type RootMutation {
    CreateSkill(skillInput: SkillInput): Skill
    CreateUser(userInput: UserInput) : Auth!
    CreateUserSkill(skillName: String!, userId: ID!, level: Int!, interest: Int!) : Skill
    ChangeUserAvailability(userId: ID!, available: Boolean, role: String, active: Boolean): User
    CreateRole(role: String!): Role
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)