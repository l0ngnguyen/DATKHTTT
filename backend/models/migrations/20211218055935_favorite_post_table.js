
exports.up = function(knex) {
    return knex.schema.createTable('Favorite_Post', table => {
        table.integer('postId').notNullable();
        table.foreign('postId').references('Post.Id').onUpdate('CASCADE').onDelete('CASCADE')

        table.integer('userId').notNullable();
        table.foreign('userId').references('User.Id').onUpdate('CASCADE').onDelete('CASCADE')
        
        table.timestamp('date').defaultTo(knex.fn.now());
        table.primary(['postId', 'userId']);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Favorite_Post');
};
