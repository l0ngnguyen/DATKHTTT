
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Post').del()
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
};
