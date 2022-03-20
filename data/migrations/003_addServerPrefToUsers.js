exports.up = function (knex, Promise) {
    return knex.schema
        .table("users", tbl => {
            tbl.string("preferredGuild");
        });
};

exports.down = function (knex, Promise) {
  return knex.schema.table("users").dropColumn("preferredGuild");
};
