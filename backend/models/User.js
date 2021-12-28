
const knex = require('./database')
const bcrypt = require('bcrypt')
const config = require('../config/config')

//Use for auth login
exports.getUserByUserName = (username) => {
    return knex.from('User').select(
        '*',
        knex('Post')
            .count('Id')
            .whereRaw('?? = ??', ['userId', 'User.Id'])
            .as('numPost'),
            
        knex('Answer')
            .count('Id')
            .whereRaw('?? = ??', ['userId', 'User.Id'])
            .as('numAnswer'),

        knex("Post_Vote")
            .count("userId")
            .whereIn("postId", function () {
                this.select('Id').from('Post').whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            })
            .andWhere("voteType", true)
            .as('numUpVotePost'),

        knex("Post_Vote")
            .count("userId")
            .whereIn("postId", function () {
                this.select('Id').from('Post').whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            })
            .andWhere("voteType", false)
            .as('numDownVotePost'),

        knex("Answer_Vote")
            .count("userId")
            .whereIn("answerId", function () {
                this.select('Id').from('Answer').whereRaw('?? = ??', ['Answer.userId', 'User.Id'])
            })
            .andWhere("voteType", true)
            .as('numUpVoteAnswer'),

        knex("Answer_Vote")
            .count("userId")
            .whereIn("answerId", function () {
                this.select('Id').from('Answer').whereRaw('?? = ??', ['Answer.userId', 'User.Id'])
            })
            .andWhere("voteType", false)
            .as('numDownVoteAnswer'),
    )
    .where('userName', username).first()
}

exports.getUserByEmail = (email) => {
    return knex.from('User').select(
        '*',
        knex('Post')
            .count('Id')
            .whereRaw('?? = ??', ['userId', 'User.Id'])
            .as('numPost'),
            
        knex('Answer')
            .count('Id')
            .whereRaw('?? = ??', ['userId', 'User.Id'])
            .as('numAnswer'),

        knex("Post_Vote")
            .count("userId")
            .whereIn("postId", function () {
                this.select('Id').from('Post').whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            })
            .andWhere("voteType", true)
            .as('numUpVotePost'),

        knex("Post_Vote")
            .count("userId")
            .whereIn("postId", function () {
                this.select('Id').from('Post').whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            })
            .andWhere("voteType", false)
            .as('numDownVotePost'),

        knex("Answer_Vote")
            .count("userId")
            .whereIn("answerId", function () {
                this.select('Id').from('Answer').whereRaw('?? = ??', ['Answer.userId', 'User.Id'])
            })
            .andWhere("voteType", true)
            .as('numUpVoteAnswer'),

        knex("Answer_Vote")
            .count("userId")
            .whereIn("answerId", function () {
                this.select('Id').from('Answer').whereRaw('?? = ??', ['Answer.userId', 'User.Id'])
            })
            .andWhere("voteType", false)
            .as('numDownVoteAnswer'),
    )
    .where('email', email).first()
}

exports.getUser = (userId) => {
    return knex.from('User').select(
        '*',
        knex('Post')
            .count('Id')
            .where('Post.userId', userId)
            .as('numPost'),
        knex('Answer')
            .count('Id')
            .where('Answer.userId', userId)
            .as('numAnswer'),
        knex("Post_Vote")
            .count("userId")
            .whereIn("postId", function () {
                this.select('Id').from('Post').where('userId', userId)
            })
            .andWhere("voteType", true)
            .as('numUpVotePost'),

        knex("Post_Vote")
            .count("userId")
            .whereIn("postId", function () {
                this.select('Id').from('Post').where('userId', userId)
            })
            .andWhere("voteType", false)
            .as('numDownVotePost'),

        knex("Answer_Vote")
            .count("userId")
            .whereIn("answerId", function () {
                this.select('Id').from('Answer').where('userId', userId)
            })
            .andWhere("voteType", true)
            .as('numUpVoteAnswer'),

        knex("Answer_Vote")
            .count("userId")
            .whereIn("answerId", function () {
                this.select('Id').from('Answer').where('userId', userId)
            })
            .andWhere("voteType", false)
            .as('numDownVoteAnswer'),
    ).where('Id', userId).first()
}

//admin
exports.getListUser = (page, perPage, orderBy, orderType, startDate, endDate) => {
    return knex.from('User').select(
        '*',
        knex('Post')
            .count('Id')
            .whereRaw('?? = ??', ['userId', 'User.Id'])
            .as('numPost'),
            
        knex('Answer')
            .count('Id')
            .whereRaw('?? = ??', ['userId', 'User.Id'])
            .as('numAnswer'),

        knex("Post_Vote")
            .count("userId")
            .whereIn("postId", function () {
                this.select('Id').from('Post').whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            })
            .andWhere("voteType", true)
            .as('numUpVotePost'),

        knex("Post_Vote")
            .count("userId")
            .whereIn("postId", function () {
                this.select('Id').from('Post').whereRaw('?? = ??', ['Post.userId', 'User.Id'])
            })
            .andWhere("voteType", false)
            .as('numDownVotePost'),

        knex("Answer_Vote")
            .count("userId")
            .whereIn("answerId", function () {
                this.select('Id').from('Answer').whereRaw('?? = ??', ['Answer.userId', 'User.Id'])
            })
            .andWhere("voteType", true)
            .as('numUpVoteAnswer'),

        knex("Answer_Vote")
            .count("userId")
            .whereIn("answerId", function () {
                this.select('Id').from('Answer').whereRaw('?? = ??', ['Answer.userId', 'User.Id'])
            })
            .andWhere("voteType", false)
            .as('numDownVoteAnswer'),
    )
    .where('date', '>=', startDate).andWhere('date', '<=', endDate)
    .orderBy(orderBy, orderType)
    .paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.createUser = (user) => {
    return knex('User').insert({
        userName: user.userName,
        password: user.password,
        email: user.email,
        avatarLink: user.avatarLink,
        gender: user.gender,
        facebookLink: user.facebookLink,
        githubLink: user.githubLink,
        location: user.location,
        description: user.description,
        date: user.date,
        role: user.role,
        googleId: user.googleId
    })
}

exports.getAvatar = (userId) => {
    return knex('User').select("avatarLink").where('Id', userId).first()
}

exports.updatePassword = (Id, newPassword) => {
    return knex('User').where('Id', Id).update('password', newPassword)
}

exports.getUserByGoogleID = (googleId) => {
    return knex('User').where('googleId', googleId).first()
}

exports.editUser = (data, Id) => {
    return knex('User').where('Id', Id).update({
        ...data
    })
}

//admin
exports.deleteUser = (userId) => {
    return knex('User').where('Id', userId).del()
}