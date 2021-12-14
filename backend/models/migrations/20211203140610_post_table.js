
exports.up = function(knex) {
    return knex.schema.createTable('Post', table => {
        table.specificType('Id', 'int(10) AUTO_INCREMENT primary key').notNullable();
        table.integer('userId').notNullable();
        table.foreign('userId').references('User.Id').onUpdate('CASCADE').onDelete('CASCADE')

        table.string('postName', 1000).notNullable();
        table.text('postDetail', 'longtext').notNullable();
        table.timestamp('date').defaultTo(knex.fn.now());

        table.integer('rightAnswerID');
        // table.foreign('rightAnswerID').references('Answer.Id').onUpdate('CASCADE').onDelete('CASCADE')
        
        table.integer('viewNum').defaultTo(0);
        table.unique('postName');
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Post');
};
