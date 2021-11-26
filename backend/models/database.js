const config = require('../config/config')

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: config.dbHost,
        user: config.userDB,
        password: config.passwordDB,
        database: config.db,
        timezone: "+00:00",
        // typeCast: function(field, next) {
        //     if (field.type == 'TINY' && field.length == 1) {
        //         return (field.string() == '1'); // 1 = true, 0 = false
        //     }
        //     return next();
        // }
    },
    acquireConnectionTimeout: 30000
});

const { attachPaginate } = require('knex-paginate');
attachPaginate();

module.exports = knex