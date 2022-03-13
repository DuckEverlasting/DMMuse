
exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('users').del()
      .then(function () {
        // Inserts seed entries
        return knex('users').insert([
          {
              id: '271003111236042753',
              username: 'DuckEverlasting',
              role: 'ADMIN'
          },
        ]);
      });
  };
  