exports.up = function (knex, Promise) {
    return knex.schema
    .createTable("users", (tbl) => {
      tbl.string("id").primary().notNullable();
      tbl.string("username").notNullable();
      tbl.string("role").defaultTo("player");
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.timestamp("updated_at");
    })
    .createTable("tips", (tbl) => {
      tbl.integer("id").primary();
      tbl.string('text');
      tbl.integer("user_id");
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.timestamp("updated_at");

      tbl.foreign("user_id").references("users.id");
    });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("tips").dropTableIfExists("users");
};
