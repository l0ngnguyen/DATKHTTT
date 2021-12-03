exports.up = function(knex) {
    return knex.schema.createTable('Tag', table => {
        table.specificType('Id', 'int(10) AUTO_INCREMENT primary key').notNullable();
        table.integer('userId').notNullable();
        table.string('tagName', 256).notNullable();
        table.string('tagDetail', 1000).notNullable();
        table.timestamp('date').defaultTo(knex.fn.now());
        table.unique('tagName');
        table.unique('tagDetail');
      })
};

exports.down = function(knex) {
    knex.schema.dropTable('Tag');
};
