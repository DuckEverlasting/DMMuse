exports.up = function (knex, Promise) {
    return knex.schema
        .table("users", tbl => {
            tbl.string("preferredServer");
        });
};

exports.down = function (knex, Promise) {
  return knex.schema.table("users").dropColumn("preferredServer");
};
