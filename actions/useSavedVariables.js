const db = require('../data/dbConfig.js');

exports.get = function(params, user) {

}

exports.set = function(params, user) {
  
}

function getGlobalVar(key) {
  return db('globalVars')
    .where("key", key)
    .first();
}

function getUserVar(key, user) {
  return db('userVars')
    .where("username", user)
    .where("key", key)
    .first();
}

function addUserVar(key, value, user) {
  const variable = {
    username: user,
    key,
    value
  }
  return db('userVars')
    .returning('id')
    .insert(variable)
    .then(ids => {
      [id] = ids;
      return db('userVars')
        .where("id", id)
        .first();
    });
}

function updateUserVar(key, value, user) {
  const variable = {
    username: user,
    key,
    value
  }
  return db('userVars')
    .where("username", user)
    .where("key", key)
    .update(variable)
    .then(saved => {
      if(saved > 0) {
        return getUserVar(key, user);
      } else {
        return null;
      }
    });

function addGlobalVar(key, value, user) {
  const variable = {
    username: user,
    key,
    value
  }
  return db('userVars')
    .returning('id')
    .insert(variable)
    .then(ids => {
      [id] = ids;
      return db('userVars')
        .where("id", id)
        .first();
    });
}

function checkIfAdmin(user) {
  const isAdmin = await db('admins')
}