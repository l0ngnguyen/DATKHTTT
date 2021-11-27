const bcrypt = require('bcrypt')
const path = require('path')
const User = require('../models/User')
const config = require('../config/config')


exports.getUser = async function (req, res){
    try {
        let user = await User.getUser(req.params.id)
    
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Cannot find user with id = ${req.params.id}`
            })
        }
        return res.status(200).json({
            success: true,
            result: user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.getUserByUserName = async function (req, res){
    try {
        let user = await User.getUserByUserName(req.params.username)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: `Cannot find user with username = ${req.params.username}`
            })
        }
        return res.status(200).json({
            success: true,
            result: user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.getUserByEmail = async function (req, res){
    try {
        let user = await User.getUserByEmail(req.params.email)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: `Cannot find user with email = ${req.params.email}`
            })
        }
        return res.status(200).json({
            success: true,
            result: user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.createUser = async function (req, res){
    try {
        let user = req.body
        user.password = await bcrypt.hash(user.password, config.saltRounds)

        let newUser = await User.createUser(req.body)
        if (newUser.length == 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot create user"
            })
        }
        return res.status(200).json({
            success: true,
            result: newUser,
        })
    } catch (error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}
exports.uploadImage = async function (req, res) {
    try {
        if (req.file == undefined) {
            return res.status(400).json({
                success: false,
                message: "You must upload a file"
            })
        }
        let avatarPath = req.file.path

        return res.status(200).json({
            success: true,
            result: avatarPath
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.getAvatar = async function (req, res) {
    try {
        let avatarPath = await User.getAvatar(req.params.userId)

        if (avatarPath.avatarLink == undefined) {
            avatarPath.avatarLink = './public/images/default_avatar.jpg'
        }

        avatarPath = path.join(__dirname, '../' + avatarPath.avatarLink)

        res.status(200).sendFile(avatarPath)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}
exports.signUpWithGoogle = async (req, res) => {
    //đăng ký bằng tài khoản google, gửi google ID lên, trả về 1 access token cho email của tài khoản, sau đó dùng access token này gửi lên 1 lần nữa để đăng ký cho tài khoản này
}
exports.sentOtp = async (req, res) => {
    //gửi Otp vào email khi tạo tài khoản bằng email, gửi email, username lên  lên,  trả về Otp token
}
exports.checkOtp = async (req, res) => {
    //check Otp và Otp token còn hạn không, gửi Otp và Otp token lên, trả về access token  cho username, email,... đã đăng ký; sau đấy dùng access token này để đăng ký cho tài khoản
}

