
const knex = require('./database')
const bcrypt = require('bcrypt')
const config = require('../config/config')

//Use for auth login
exports.getUserByUserName = (username) => {
    return knex('User').where('userName', username).first()
}

exports.getUserByEmail = (email) => {
    return knex('User').where('email', email).first()
}

exports.getUser = (userID) => {
    return knex('User').where('Id', userID).first()
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