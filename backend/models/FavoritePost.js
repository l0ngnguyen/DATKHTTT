const knex = require('./database')
const config = require('../config/config')
const { creteUserVote } = require('../controllers/postController')

exports.getLikeNumOfPost = (postId) => {
    return (knex("Favorite_Post").count("userId", { as: 'likeNum' }).where("postId", postId).first()
    )
}

exports.getUserLikeOfPost = (postId, userId) => {
    return knex.select().table("Favorite_Post").where("postId", postId).andWhere("userId", userId)
}

exports.getFavoritePostsOfUser = (userId, page, perPage, orderBy, orderType) => {
    return knex.select(
        '*',
        knex('Favorite_Post')
            .select('date')
            .where('Favorite_Post.userId', userId)
            .whereRaw('?? = ??', ['Post.Id', 'Favorite_Post.postId'])
			.where('Favorite_Post.userId', userId)
            .as('addToFavoritePostDate'),
            
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
        .from('Post')
        .whereIn('Post.Id', function () {
            this.select('postId').from('Favorite_Post').where('userId', userId)
        })
        .orderBy(orderBy, orderType)
        .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}


exports.addPostToFavorite = (postId, userId) => {
    return knex('Favorite_Post').insert({
        postId: postId,
        userId: userId,
    })
}

exports.deletePostFromFavorite = (userId, postId) => {
    return knex('Favorite_Post').where("userId", userId).andWhere("postId", postId).del()
}
