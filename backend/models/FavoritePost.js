const knex = require('./database')
const config = require('../config/config')
const { creteUserVote } = require('../controllers/postController')

exports.getLikeNumOfPost = (postId) => {
    return (knex("Favorite_Post").count("userId", {as: 'likeNum'}).where("postId", postId).first()
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
            .whereRaw('?? = ??', ['Post.Id', 'Favorite_Post.postId'])
			.where('Favorite_Post.userId', userId)
            .as('addToFavoritePostDate'),
    )
    .from('Post')
    .whereIn('Post.Id', function(){
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
