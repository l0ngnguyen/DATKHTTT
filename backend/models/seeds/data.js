const bcrypt = require('bcrypt')

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('User').del()
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

  await knex('Post').del()
  .then(function () {
    // Inserts seed entries
    return knex('Post').insert([
      {
        userId: 1,
        postName:"How interlink external hyperlink/hotspot from WPF with internal hotspot on 3D object in Unity?",
        postDetail: "Google polyline decoded is not what expected"
      },
      {
        userId: 1,
        postName:"Google polyline decoded is not what expected",
        postDetail: "Google polyline decoded is not what expected"
      },
      {
        userId: 1,
        postName:"Can I use subfolders in electron fiddle?",
        postDetail: "Google polyline decoded is not what expected" 
      },
      {
        userId: 1,
        postName:"How to retrieve the respective value from the checkbox to display in the div based on search text??",
        postDetail: "Google polyline decoded is not what expected"
      },
      {
        userId: 1,
        postName:"How to calculate the percentage of failed requests (HTTP status 401) using Splunk query?",
        postDetail: "Google polyline decoded is not what expected"
      },
      {
        userId: 1,
        postName:"Artisan Storage:link doesnt work laravel 8",
        postDetail: "Google polyline decoded is not what expected"
      },
      {
        userId: 1,
        postName:"Slow Content Download of large json file node.js/express",
        postDetail: "Google polyline decoded is not what expected"
      },
    ]);
  });

  await knex('Answer').del()
    .then(function () {
      // Inserts seed entries
      return knex('Answer').insert([
        {userId: 1, postId: 1, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 1, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 2, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 2, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 3, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 3, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 4, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 4, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 5, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
        {userId: 1, postId: 5, answerDetail: " And there is only one entry in the NodeMachine table - the K1 wheel, which is suitable for all one hundred motorcycles and for all one hundred cars. "},
      ]);
    });
};
