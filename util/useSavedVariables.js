const db = require('../data/dbConfig.js');

exports.getVar = async function(key, interaction) {
  const user = interaction.user.id;

  let variable = await db('userVars')
    .where("userid", user)
    .where("key", key)
    .first();
  if (variable) {
    return variable.value;
  } else {
    variable = await getGlobalVar(key);
    if (variable) {
      return variable.value;
    } else {
      return null
    }
  }
}

exports.setUserVar = async function({ params, interaction }) {
  if (!params.includes("as") || params.length < 3) {
    return 'Sorry, that\'s not the right syntax. To save value "a" under the name "b", the correct command is "save a as b".'
  }

  const value = params.slice(0, params.indexOf("as")).join(" ");
  const key = params.slice(params.indexOf("as") + 1).join(" ");
  const user = interaction.user.id;

  let isGlobal = await getGlobalVar(key);
  if (isGlobal) {
    return "Sorry, that variable has been reserved by an admin."
  }

  let alreadyExists = await db('userVars')
    .where("userid", user)
    .where("key", key)
    .first();
  let updated;
  if (alreadyExists) {
    updated = await updateUserVar(key, value, user);
  } else {
    updated = await addUserVar(key, value, user);
  }
  if (updated) {
    return `Got it, I've set "${key}" to equal "${value}" (for you only).`
  } else {
    return "Sorry, something's gone wrong."
  }
}

exports.setGlobalVar = async function({ params, interaction }) {
  if (!params.includes("as") || params.length < 3) {
    return 'Sorry, that\'s not the right syntax. To save value "a" under the name "b", the correct command is "save a as b".'
  }

  const value = params.slice(0, params.indexOf("as")).join(" ");
  const key = params.slice(params.indexOf("as") + 1).join(" ");
  const user = interaction.user.id;

  if (isAdmin(user)) {
    let alreadyExists = await getUserVar(key, user);
    let updated;
    if (alreadyExists) {
      updated = await updateGlobalVar(key, value);
    } else {
      updated = await addGlobalVar(key, value);
    }
    if (updated) {
      return `Got it, I've set "${key}" to equal "${value}" globally.`
    } else {
      return "Sorry, something's gone wrong."
    }
  }
}

getGlobalVar = async function(key) {
  let variable = await db('globalVars')
    .where("key", key)
    .first();

  if (variable) {
    return variable;
  } else {
    return null;
  }
}

function addUserVar(key, value, user) {
  const variable = {
    userid: user,
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
    userid: user,
    key,
    value
  }
  return db('userVars')
    .where("userid", user)
    .where("key", key)
    .update(variable)
    .then(saved => {
      if(saved > 0) {
        return getUserVar(key, user);
      } else {
        return null;
      }
    });
}

function addGlobalVar(key, value) {
  const variable = {
    key,
    value
  }
  return db('globalVars')
    .returning('id')
    .insert(variable)
    .then(ids => {
      [id] = ids;
      return db('globalVars')
        .where("id", id)
        .first();
    });
}

function updateGlobalVar(key, value) {
  const variable = {
    key,
    value
  }
  return db('globalVars')
    .where("key", key)
    .update(variable)
    .then(saved => {
      if(saved > 0) {
        return getGlobalVar(key);
      } else {
        return null;
      }
    });
}

async function isAdmin(user) {
  const isAdmin = await db('admins').where("userid", user);
  return !!isAdmin;
}