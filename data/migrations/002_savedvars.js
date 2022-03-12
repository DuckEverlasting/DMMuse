exports.up = function (knex, Promise) {
    return knex.schema
    .createTable("user_vars", (tbl) => {
      tbl.string("key").notNullable();
      tbl.string("value").notNullable();
      tbl.string("user_id").notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.timestamp("updated_at");

      tbl.primary(['key', 'user_id']);
      tbl.foreign("user_id").references("users.id");
    })
    .createTable("global_vars", (tbl) => {
      tbl.string("key").primary();
      tbl.string('value');
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.timestamp("updated_at");
    });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("global_vars").dropTableIfExists("user_vars");
};
