
const knex = require('./database')
const config = require('../config/config')

//Use for auth login

exports.getListTag = (page, perPage, orderBy, orderType, startDate, endDate) => {
    return knex.from('Tag').select(
        '*',
        knex('Post_Tag')
            .count('*')
            .whereRaw('?? = ??', ['Post_Tag.tagId', 'Tag.Id'])
            .as('postNum'),
    )
    .where('date', '>=', startDate).andWhere('date', '<=', endDate)
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getListTagByUserId = (userId, page, perPage, orderBy, orderType, startDate, endDate) => {
    return knex.from('Tag').select(
        '*',
        knex('Post_Tag')
            .count('*')
            .whereRaw('?? = ??', ['Post_Tag.tagId', 'Tag.Id'])
            .as('postNum'),
    )
    .where('date', '>=', startDate).andWhere('date', '<=', endDate)
    .where('userId', userId)
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.getTag = (tagId) => {
    return knex.from('Tag').select(
        '*',
        knex('Post_Tag')
            .count('*')
            .whereRaw('?? = ??', ['Post_Tag.tagId', 'Tag.Id'])
            .as('postNum'),
    )
    .where('Id', tagId).first()
}

exports.getTagByTagName = (tagName) => {
    return knex.from('Tag').select(
        '*',
        knex('Post_Tag')
            .count('*')
            .whereRaw('?? = ??', ['Post_Tag.tagId', 'Tag.Id'])
            .as('postNum'),
    )
    .where('tagName', tagName).first()
}

exports.searchTag = (query, page, perPage, orderBy, orderType, startDate, endDate) => {
    return knex.from('Tag').select(
        '*',
        knex('Post_Tag')
            .count('*')
            .whereRaw('?? = ??', ['Post_Tag.tagId', 'Tag.Id'])
            .as('postNum'),
    )
    .where('tagName', 'like', `%${query}%`)
    .where('date', '>=', startDate).andWhere('date', '<=', endDate)
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
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
