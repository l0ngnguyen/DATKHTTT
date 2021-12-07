
exports.up = function(knex) {
    return knex.schema.createTable('Post_Vote', table => {
        table.integer('postId').notNullable();
        table.integer('userId').notNullable();
        table.boolean('voteType').notNullable();
        table.timestamp('date').defaultTo(knex.fn.now());
        table.primary(['postId', 'userId']);
    })
};

exports.down = function(knex) {
  knex.schema.dropTable('Post_Vote');
};
