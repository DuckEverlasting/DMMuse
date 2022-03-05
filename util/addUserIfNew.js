const { getUser, addUser } = require('../data/controllers/usersController');

module.exports = async function(user) {
    if (await getUser(user.id).length > 0) {
        addUser(user.id, user.username);
    }
}
