const bcrypt = require('bcrypt')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('User').del()
    .then(function () {
      // Inserts seed entries
      let saltRounds = 10
      let password = bcrypt.hashSync('a12345678', saltRounds)
      return knex('User').insert([
        {
          userName: "admin01",
          password: password,
          email: "vuquanghuy21081999@gmail.com",
          gender: true,
          avatarLink: "./public/images/default_avatar.jpg",
          facebookLink: "",
          githubLink: "",
          location: "Ha Noi",
          description: "Admin account",
          role: 1,
        },
      ]);
    });
};
