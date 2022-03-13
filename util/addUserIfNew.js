const { getUser, addUser } = require('../data/controllers/usersController');

module.exports = async function(user) {
    return await getUser(user.id) || addUser(user.id, user.username);
}
