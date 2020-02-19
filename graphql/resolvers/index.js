
const userResolver = require('./user');
const skillResolver = require('./skill');
const userSkillResolver = require('./userskill');
const roleResolver = require('./role')


const rootResolver = {
    ...userResolver,
    ...skillResolver,
    ...userSkillResolver,
    ...roleResolver
}

module.exports = rootResolver;