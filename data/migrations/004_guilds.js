exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("guilds", (tbl) => {
      tbl.string("id").notNullable();
      tbl.string("name").notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.timestamp("updated_at");
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists("guilds")
    .dropTableIfExists("guilds");
};
