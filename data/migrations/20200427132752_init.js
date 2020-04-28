
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('admins', tbl => {
      tbl.increments();
      tbl
        .string('userid', 32)
        .notNullable()
        .unique();
    })
    .createTable('globalVars', tbl => {
      tbl.increments();
      tbl
        .string('key', 128)
        .notNullable()
        .unique();
      tbl
        .string('value', 256)
        .notNullable()
    })
    .createTable('userVars', tbl => {
      tbl.increments();
      tbl
        .string('userid', 32)
        .notNullable()
      tbl
        .string('key', 128)
        .notNullable()
      tbl
        .string('value', 256)
        .notNullable()
    })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('admins')
  knex.schema.dropTableIfExists('globalVars')
  return knex.schema.dropTableIfExists('userVars')
};
