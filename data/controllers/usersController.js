const knex = require('../../data/dbConfig');

module.exports = {
    getUsers: function() {
        return knex.select('id', 'username', 'role')
            .from('users');
    },
    getUser: function(id) {
        return knex.first('id', 'username', 'role')
            .from('users')
            .where({ id: id });
    },
    addUser: function(id, username) {
        return knex('users')
            .insert({ id, username });
    },
    addAdmin: function(id, username) {
        return knex('users')
            .insert({ id, username, role: 'ADMIN' });
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
