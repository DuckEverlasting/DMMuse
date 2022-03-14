exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("guilds")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("guilds").insert([
        {
          id: "703705692162490451",
          name: "Eberron Awaits!"
        },
      ]);
    });
};
