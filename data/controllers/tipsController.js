const knex = require('../../data/dbConfig');

module.exports = {
    getTips: function() {
        return knex.select('tips.id', 'text', 'username', 'user_id')
            .from('tips')
            .join('users', { 'tips.user_id': 'users.id' });
    },
    getTip: function(id) {
        return knex.first('tips.id', 'text', 'username', 'user_id')
            .from('tips')
            .where({ id: id })
            .join('users', { 'tips.user_id': 'users.id' });
    },
    getTipsByUser: function(user_id) {
        return knex.select('tips.id', 'text', 'username', 'user_id')
        .from('tips')
        .join('users', { 'tips.user_id': 'users.id' })
        .where({ user_id });
    },
    insertTip: function(text, user_id) {
        return knex('tips')
            .insert({ text, user_id });
    },
    updateTip: function(id, newText) {
        return knex('tips')
            .where({ id })
            .update({ text: newText, updated_at: knex.fn.now() });
    },
    removeTip: function(id) {
        return knex('tips')
            .where({ id })
            .del();
    }
}