const knex = require('./database')
const config = require('../config/config')
const { creteUserVote } = require('../controllers/postController')

exports.getUpVoteNumOfPost = (postId) => {
    return (knex("Post_Vote").count("userId", {as: 'voteNum'}).where("postId", postId).andWhere("voteType", true)
    )
}

exports.getDownVoteNumOfPost = (postId) => {
    return (knex("Post_Vote").count("userId", {as: "voteNum"}).where("postId", postId).andWhere("voteType", false)
    )
}

exports.getUserVoteOfPost = (postId, userId) => {
    return knex.select().table("Post_Vote").where("postId", postId).andWhere("userId", userId)
}

exports.addUserVote = (postId, userId, voteType) => {
    return knex('Post_Vote').insert({
        postId: postId,
        userId: userId,
        voteType: voteType,
    })
}

exports.deleteUserVote = (userId, postId) => {
    return knex('Post_Vote').where("userId", userId).andWhere("postId", postId).del()
}

exports.deleteUserVoteByPosstId = (postId) => {
    return knex('Post_Vote').where("postId", postId).del()
}