
exports.up = function(knex) {
    return knex.schema.createTable('Post_Vote', table => {
        table.integer('postId').notNullable();
        table.foreign('postId').references('Post.Id').onUpdate('CASCADE').onDelete('CASCADE')

        table.integer('userId').notNullable();
        table.foreign('userId').references('User.Id').onUpdate('CASCADE').onDelete('CASCADE')
        
        table.boolean('voteType').notNullable();
        table.timestamp('date').defaultTo(knex.fn.now());
        table.primary(['postId', 'userId']);
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('Post_Vote');
};
