
const userResolver = require('./user');
const skillResolver = require('./skill');
const userSkillResolver = require('./userskill');


const rootResolver = {
    ...userResolver,
    ...skillResolver,
    ...userSkillResolver
}

module.exports = rootResolver;