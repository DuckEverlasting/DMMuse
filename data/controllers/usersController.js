const knex = require('../../data/dbConfig');

module.exports = {
    getUsers: function() {
        return knex.select('id', 'username', 'role', 'preferredGuild')
            .from('users');
    },
    getUser: function(id) {
        return knex.first('id', 'username', 'role', 'preferredGuild')
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
    setPreferredGuild: function(id, preferredGuild) {
        return knex('users')
            .where({ id })
            .update({ preferredGuild, updated_at: knex.fn.now() });
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
