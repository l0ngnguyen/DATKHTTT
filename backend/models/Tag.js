
const knex = require('./database')
const config = require('../config/config')

//Use for auth login

exports.getListTag = (page, perPage) => {
    return knex.select().table('Tag').paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListTagByUserId = (userId, page, perPage) => {
    return knex.select().table('Tag').where('userId', userId).paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getTag = (tagId) => {
    return knex('Tag').where('Id', tagId).first()
}

exports.getTagByTagName = (tagName) => {
    return knex('Tag').where('tagName', tagName).first()
}

exports.searchTag = (query) => {
    return knex('Tag')
        .where('tagName', 'like', `%${query}%`)
}
exports.createTag = (tag, userId) => {
    return knex('Tag').insert({
        userId: userId,
        tagName: tag.tagName,
        tagDetail: tag.tagDetail,
    })
}
exports.editTag = (data, tagId) => {
    return knex('Tag').where('Id', tagId).update({
        ...data
    })
}
exports.deleteTag =  (tagId) => {
    return knex('Tag').where('Id', tagId).del()
}
