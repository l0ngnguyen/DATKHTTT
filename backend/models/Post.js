const knex = require('./database')
const config = require('../config/config')

exports.getListPost = (page, perPage, orderBy, orderType) => {
    return knex.from('Post').select(
        '*',
        knex('Answer')
            .count('*')
            .whereRaw('?? = ??', ['Answer.postId', 'Post.Id'])
            .as('numAnswer'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListPostByUserId = (userId, page, perPage, orderBy, orderType) => {
    return knex.from('Post').select(
        '*',
        knex('Answer')
            .count('*')
            .whereRaw('?? = ??', ['Answer.postId', 'Post.Id'])
            .as('numAnswer'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .where('userId', userId)
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getPost = (postId) => {
    return knex.from('Post').select(
        '*',
        knex('Answer')
            .count('*')
            .whereRaw('?? = ??', ['Answer.postId', 'Post.Id'])
            .as('numAnswer'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .where('Id', postId).first()
}

exports.getPostByPostName = (postName) => {
    return knex.from('Post').select(
        '*',
        knex('Answer')
            .count('*')
            .whereRaw('?? = ??', ['Answer.postId', 'Post.Id'])
            .as('numAnswer'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .where('postName', postName).first()
}

exports.searchPost = (query, page, perPage, orderBy, orderType) => {
    return knex.from('Post').select(
        '*',
        knex('Answer')
            .count('*')
            .whereRaw('?? = ??', ['Answer.postId', 'Post.Id'])
            .as('numAnswer'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Post_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Post_Vote.postId', 'Post.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .where('postName', 'like', `%${query}%`)
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
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
exports.deletePost = (postId) => {
    return knex('Post').where('Id', postId).del()
}