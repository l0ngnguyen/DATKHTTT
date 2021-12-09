
exports.up = function(knex) {
  return knex.schema.createTable('Answer_Vote', table => {
    table.integer('answerId').notNullable();
    table.integer('userId').notNullable();
    table.boolean('voteType').notNullable();
    table.timestamp('date').defaultTo(knex.fn.now());
    table.primary(['answerId', 'userId']);
})
};

exports.down = function(knex) {
  knex.schema.dropTable('Answer_Vote');
};
