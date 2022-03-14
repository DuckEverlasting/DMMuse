const knex = require('../../data/dbConfig');

module.exports = {
    getGuilds: function() {
        return knex.select('id', 'name')
            .from('guilds');
    }
}