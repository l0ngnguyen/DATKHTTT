
exports.up = function(knex) {
    return knex.schema.createTable('Post', table => {
        table.specificType('Id', 'int(10) AUTO_INCREMENT primary key').notNullable();
        table.integer('userId').notNullable();
        table.text('questionName', 'longtext').notNullable();
        table.text('questionDetail', 'longtext').notNullable();
        table.integer('voteNum').defaultTo(0);
        table.timestamp('date').defaultTo(knex.fn.now());
        table.integer('rightAnswerID');
      })
};

exports.down = function(knex) {
    knex.schema.dropTable('Post');
};
