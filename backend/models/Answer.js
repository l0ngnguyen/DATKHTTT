const knex = require('./database')
const config = require('../config/config')

exports.getListAnswer = (page, perPage) => {
    return knex.select().table('Answer').paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListAnswerByUserId = (userId, page, perPage) => {
    return knex.select().table('Answer').where('userId', userId).paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListAnswerByPostId = (postId, page, perPage) => {
    return knex.select().table('Answer').where('postId', postId).paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getAnswer = (answerId) => {
    return knex('Answer').where('Id', answerId).first()
}

exports.getAnswerByUserIdAndPostId = (userId, postId) => {
    return knex('Answer').where('userID', userId).andWhere('postId', postId).first()
}

exports.createAnswer = ( userId, postId, answerDetail) => {
    return knex('Answer').insert({
        userId: userId,
        postId:postId,
        answerDetail: answerDetail,
    })
}
exports.editAnswer = (data, answerId) => {
    return knex('Answer').where('Id', answerId).update({
        ...data
    })
}
exports.deleteAnswer =  (answerId) => {
    return knex('Answer').where('Id', answerId).del()
}

exports.deleteAnswersByPostId =  (postId) => {
    return knex('Answer').where('postId', postId).del()
}

exports.deleteAnswersByUserId =  (userId) => {
    return knex('Answer').where('userId', userId).del()
}