const knex = require('./database')
const config = require('../config/config')

exports.getListPost = (page, perPage, orderBy, orderType, startDate, endDate) => {
    return knex.from('Post').select(
        '*',
        knex('User')
            .select('userName')
            .whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            .as('postUserName'),

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

        knex('Favorite_Post')
            .count('*')
            .whereRaw('?? = ??', ['Favorite_Post.postId', 'Post.Id'])
            .as('likeNum'),
    )
        .where('date', '>=', startDate).andWhere('date', '<=', endDate)
        .orderBy(orderBy, orderType)
        .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListPostByUserId = (userId, page, perPage, orderBy, orderType, startDate, endDate) => {
    return knex.from('Post').select(
        '*',
        knex('User')
            .select('userName')
            .whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            .as('postUserName'),

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

        knex('Favorite_Post')
            .count('*')
            .whereRaw('?? = ??', ['Favorite_Post.postId', 'Post.Id'])
            .as('likeNum'),
    )
        .where('userId', userId)
        .where('date', '>=', startDate).andWhere('date', '<=', endDate)
        .orderBy(orderBy, orderType)
        .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getPost = (postId) => {
    return knex.from('Post').select(
        '*',
        knex('User')
            .select('userName')
            .whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            .as('postUserName'),

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

        knex('Favorite_Post')
            .count('*')
            .whereRaw('?? = ??', ['Favorite_Post.postId', 'Post.Id'])
            .as('likeNum'),
    )
        .where('Id', postId).first()
}

exports.getPostByPostName = (postName) => {
    return knex.from('Post').select(
        '*',
        knex('User')
            .select('userName')
            .whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            .as('postUserName'),

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

        knex('Favorite_Post')
            .count('*')
            .whereRaw('?? = ??', ['Favorite_Post.postId', 'Post.Id'])
            .as('likeNum'),
    )
        .where('postName', postName).first()
}

exports.searchPost = (query, page, perPage, orderBy, orderType, startDate, endDate) => {
    return knex.from('Post').select(
        '*',
        knex('User')
            .select('userName')
            .whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            .as('postUserName'),

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

        knex('Favorite_Post')
            .count('*')
            .whereRaw('?? = ??', ['Favorite_Post.postId', 'Post.Id'])
            .as('likeNum'),
    )
        .where('postName', 'like', `%${query}%`)
        .where('date', '>=', startDate).andWhere('date', '<=', endDate)
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