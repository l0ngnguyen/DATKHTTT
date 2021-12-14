
exports.up = function(knex) {
  return knex.schema.createTable('Answer_Vote', table => {
    table.integer('answerId').notNullable();
    table.foreign('answerId').references('Answer.Id').onUpdate('CASCADE').onDelete('CASCADE')

    table.integer('userId').notNullable();
    table.foreign('userId').references('User.Id').onUpdate('CASCADE').onDelete('CASCADE')

    table.boolean('voteType').notNullable();
    table.timestamp('date').defaultTo(knex.fn.now());
    table.primary(['answerId', 'userId']);
})
};

exports.down = function(knex) {
  return knex.schema.dropTable('Answer_Vote');
};
