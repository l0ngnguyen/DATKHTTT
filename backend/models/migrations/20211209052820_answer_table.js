
exports.up = function(knex) {
    return knex.schema.createTable('Answer', table => {
        table.specificType('Id', 'int(10) AUTO_INCREMENT primary key').notNullable();
        table.integer('userId').notNullable();
        table.integer('postId').notNullable();
        table.text('answerDetail', 'longtext').notNullable();
        table.timestamp('date').defaultTo(knex.fn.now());
      })
};

exports.down = function(knex) {
    knex.schema.dropTable('Answer');
};
