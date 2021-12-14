
exports.up = async function(knex) {
    await knex.schema.createTable('Answer', table => {
        table.specificType('Id', 'int(10) AUTO_INCREMENT primary key').notNullable();
        table.integer('userId').notNullable();
        table.foreign('userId').references('User.Id').onUpdate('CASCADE').onDelete('CASCADE')
        
        table.integer('postId').notNullable();
        table.foreign('postId').references('Post.Id').onUpdate('CASCADE').onDelete('CASCADE')

        table.text('answerDetail', 'longtext').notNullable();

        table.timestamp('date').defaultTo(knex.fn.now());
        
        
    })
    return knex.schema.table('Post', function (table) {
        table.foreign('rightAnswerID').references('Answer.Id').onUpdate('CASCADE').onDelete('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Answer');
};
