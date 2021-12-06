exports.up = function (knex) {
  return knex.schema.createTable('User', table => {
    table.specificType('Id', 'int(10) AUTO_INCREMENT primary key').notNullable();
    table.string('userName', 256).notNullable();
    table.string('password', 256).notNullable();
    table.string('email', 265).notNullable();
    table.string('avatarLink', 256).defaultTo("./public/images/default_avatar.jpg");
    table.boolean('gender').notNullable();//true: male; false: female
    table.string('facebookLink', 256); 
    table.string('githubLink', 256); 
    table.string('location', 256);
    table.string('description', 256);
    table.timestamp('date').defaultTo(knex.fn.now());
    table.integer('role').notNullable().defaultTo(1); //1 is admin, 0 is user
    table.string('googleId',256)
    table.unique('userName');
    table.unique('email');
  })
};

exports.down = function (knex) {
  knex.schema.dropTable('User');
};
