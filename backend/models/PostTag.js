const knex = require('./database')
const config = require('../config/config')


exports.getTagsOfPost = (postId) => {
    return knex.select('tagId').table('Post_Tag').where('postId', postId)
}

exports.getPostsOfTag = (tagId) => {
    return knex.select('postId').table('Post_Tag').where('tagId', tagId)
}

exports.addTagToPost = (postId, tagId) => {
    return knex('Post_Tag').insert({
        postId: postId,
        tagId: tagId,
    })
}

exports.deleteTagFromPost= (postId) => {
    return knex('Post_Tag').where('postId', postId).del()
}