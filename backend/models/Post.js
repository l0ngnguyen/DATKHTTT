const knex = require('./database')
const config = require('../config/config')

exports.getListPost = (page, perPage) => {
    return knex.select().table('Post').paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListPostByUserId = (userId, page, perPage) => {
    return knex.select().table('Post').where('userId', userId).paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getPost = (postId) => {
    return knex('Post').where('Id', postId).first()
}

exports.getPostByPostName = (postName) => {
    return knex('Post').where('postName', postName).first()
}

exports.searchPost = (query) => {
    return knex('Post')
        .where('postName', 'like', `%${query}%`)
}
exports.createPost = (post, userId) => {
    return knex('Post').insert({
        userId: userId,
        postName: post.postName,
        postDetail: post.postDetail,
    })
}
exports.editPost = (data, postId) => {
    return knex('Post').where('Id', postId).update({
        ...data
    })
}
exports.deletePost =  (postId) => {
    return knex('Post').where('Id', postId).del()
}