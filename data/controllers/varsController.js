const knex = require('../../data/dbConfig');

function getUserVars() {
    return knex.select('key', 'value', 'username', 'user_id')
        .from('user_vars')
        .join('users', { 'user_vars.user_id': 'users.id' });
}
function getUserVarsByUser(user_id) {
    return getUserVars().where({ user_id });
}
function getGlobalVars() {
    return knex.select('key', 'value')
        .from('global_vars');
}
function getGlobalVar(key) {
    return getGlobalVars().where({ key }).first();
}
function getVar(user_id, key) {
    return getUserVarsByUser(user_id)
        .where({ key })
        .first()
        .then(v => v || getGlobalVar(key));
}
function insertUserVar(user_id, key, value) {
    return knex('user_vars')
        .insert({ user_id, key, value });
}
function insertGlobalVar(key, value) {
    return knex('global_vars')
        .insert({ key, value });
}
function updateUserVar(user_id, key, newValue) {
    return knex('user_vars')
        .where({ user_id, key })
        .update({ value: newValue, updated_at: knex.fn.now() });
}
function removeUserVar(user_id, key) {
    return knex('user_vars')
        .where({ user_id, key })
        .del();
}
function updateGlobalVar(key, newValue) {
    return knex('global_vars')
        .where({ key })
        .update({ value: newValue, updated_at: knex.fn.now() });
}
function removeGlobalVar(key) {
    return knex('global_vars')
        .where({ key })
        .del();
}

module.exports = {
    getUserVars,
    getUserVarsByUser,
    getGlobalVars,
    getGlobalVar,
    getVar,
    insertUserVar,
    insertGlobalVar,
    updateUserVar,
    removeUserVar,
    updateGlobalVar,
    removeGlobalVar
}
