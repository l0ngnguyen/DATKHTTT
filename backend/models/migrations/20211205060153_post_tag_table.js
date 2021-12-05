
exports.up = function (knex) {
    return knex.schema.createTable('Post_Tag', table => {
        table.integer('postId').notNullable();
        table.integer('tagId').notNullable();
        table.primary(['postId', 'tagId']);
    })
};

exports.down = function (knex) {
    knex.schema.dropTable('Post_Tag');
};
