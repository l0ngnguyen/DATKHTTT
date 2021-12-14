const knex = require('./database')
const config = require('../config/config')

exports.getListAnswer = (page, perPage, orderBy, orderType) => {
    return knex.from('Answer').select(
        '*',
        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListAnswerByUserId = (userId, page, perPage, orderBy, orderType) => {
    return knex.from('Answer').select(
        '*',
        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .where('userId', userId)
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListAnswerByPostId = (postId, page, perPage, orderBy, orderType) => {
    return knex.from('Answer').select(
        '*',
        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .where('postId', postId)
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getAnswer = (answerId) => {
    return knex.from('Answer').select(
        '*',
        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .where('Id', answerId).first()
}

exports.getAnswerByUserIdAndPostId = (userId, postId) => {
    return knex.from('Answer').select(
        '*',
        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', true)
            .as('upVoteNum'),

        knex('Answer_Vote')
            .count('*')
            .whereRaw('?? = ??', ['Answer_Vote.answerId', 'Answer.Id'])
            .andWhere('voteType', false)
            .as('downVoteNum'),
    )
    .where('userID', userId).andWhere('postId', postId).first()
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