const knex = require('../../data/dbConfig');

module.exports = {
    getUsers: function() {
        return knex.select('id', 'username', 'role', 'preferredServer')
            .from('users');
    },
    getUser: function(id) {
        return knex.first('id', 'username', 'role', 'preferredServer')
            .from('users')
            .where({ id: id });
    },
    addUser: function(id, username) {
        return knex('users')
            .insert({ id, username, role: 'PLAYER' });
    },
    addAdmin: function(id, username) {
        return knex('users')
            .insert({ id, username, role: 'ADMIN' });
    },
    setPreferredServer: function(id, preferredServer) {
        return knex('users')
            .where({ id })
            .update({ preferredServer, updated_at: knex.fn.now() });
    },
    updateUserRole: function(id, newRole) {
        return knex('users')
            .where({ id })
            .update({ role: newRole, updated_at: knex.fn.now() });
    },
    removeUser: function(id) {
        return knex('users')
            .where({ id })
            .del();
    }
}
