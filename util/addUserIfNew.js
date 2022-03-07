const { getUser, addUser } = require('../data/controllers/usersController');

module.exports = async function(user) {
    console.log("INSIDE FUNCTION");
    if (await getUser(user.id).length > 0) {
        console.log("ADDING USER");
        return addUser(user.id, user.username);
    }
}
