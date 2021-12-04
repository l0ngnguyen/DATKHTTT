
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Tag').del()
    .then(function () {
      // Inserts seed entries
      return knex('Tag').insert([
        {userId: 1, tagName: "Java", tagDetail: "Java is a high-level object oriented programming language. Use this tag when you're having problems using or understanding the language itself. This tag is frequently used alongside other tags for libraries and/or frameworks used by Java developers."},
        {userId: 1, tagName: "c#", tagDetail: "C# (pronounced 'see sharp') is a high level, statically typed, multi-paradigm programming language developed by Microsoft. C# code usually targets Microsoft's .NET family of tools and run-times, which include .NET, .NET Framework and Xamarin among others. Use this tag for questions about code written in C# or about C#'s formal specification."},
        {userId: 1, tagName: "javascript", tagDetail: "For questions regarding programming in ECMAScript (JavaScript/JS) and its various dialects/implementations (excluding ActionScript)."},
        {userId: 1, tagName: "node.js", tagDetail: "Node.js is an event-based, non-blocking, asynchronous I/O runtime that uses Google's V8 JavaScript engine and libuv library."},
        {userId: 1, tagName: "reactjs", tagDetail: "React is a JavaScript library for building user interfaces. It uses a declarative, component-based paradigm and aims to be both efficient and flexible."},
      ]);
    });
};
