
exports.up = function (knex) {
    return knex.schema.createTable('Post_Tag', table => {
        table.integer('postId').notNullable();
        table.foreign('postId').references('Post.Id').onUpdate('CASCADE').onDelete('CASCADE')

        table.integer('tagId').notNullable();
        table.foreign('tagId').references('Tag.Id').onUpdate('CASCADE').onDelete('CASCADE')

        table.primary(['postId', 'tagId']);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('Post_Tag');
};
