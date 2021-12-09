
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Answer').del()
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
