const knex = require('./database')
const config = require('../config/config')
const { creteUserVote } = require('../controllers/AnswerController')

exports.getUpVoteNumOfAnswer = (answerId) => {
    return (knex("Answer_Vote").count("userId", {as: 'voteNum'}).where("answerId", answerId).andWhere("voteType", true)
    )
}

exports.getDownVoteNumOfAnswer = (answerId) => {
    return (knex("Answer_Vote").count("userId", {as: "voteNum"}).where("answerId", answerId).andWhere("voteType", false)
    )
}

exports.getUserVoteOfAnswer = (answerId, userId) => {
    return knex.select().table("Answer_Vote").where("answerId", answerId).andWhere("userId", userId)
}

exports.addUserVote = (answerId, userId, voteType) => {
    return knex('Answer_Vote').insert({
        answerId: answerId,
        userId: userId,
        voteType: voteType,
    })
}

exports.deleteUserVote = (userId, answerId) => {
    return knex('Answer_Vote').where("userId", userId).andWhere("answerId", answerId).del()
}

exports.deleteUserVoteByAnswerId = (answerId) => {
    return knex('Answer_Vote').where("answerId", answerId).del()
}

exports.deleteUserVoteByPostId = (postId) => {
    return knex('Answer_Vote').whereIn("answerId", function(){
        this.select('answerId').from('Answer').where('postId', postId)
    }).del()
}