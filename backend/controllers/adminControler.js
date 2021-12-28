const bcrypt = require('bcrypt')
const path = require('path')
const User = require('../models/User')
const Tag = require('../models/Tag')
const config = require('../config/config')
const jwtHelper = require('../helpers/jwtToken')
const { OAuth2Client } = require('google-auth-library')
const OAuthClient = new OAuth2Client(config.googleClientID)

exports.createUser = async function (req, res) {
    try {

        //phần này là để admin controller, phải authen role của tài khoản trước

        req.body.password = await bcrypt.hash(req.body.password, config.saltRounds)

        let newUserId = await User.createUser(req.body)
        if (newUserId.length == 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot create user"
            })
        }
        let newUser = await User.getUser(newUserId)
        return res.status(200).json({
            success: true,
            result: newUser,
        })
    } catch (error) {
        if (error.code == "ER_DUP_ENTRY"){
            let message
            if (error.message.includes('username')){
                message = 'Username is already exist, please use another username'
            } else  if (error.message.includes('email')){
                message = 'Email is already exist, please use another email'
            }
            return res.status(400).json({
                success: false,
                message: message
            })
        }
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.editUser = async function (req, res) {
    try {
        delete req.body.token
        let user = await User.getUser(req.params.id) 
        if (!user){
            return res.status(404).json({
                success: false,
                message: `Can not found user with id = ${req.params.id}`,
            })
        }

        req.body.password = await bcrypt.hash(req.body.password, config.saltRounds)

        let newUserId = await User.editUser(req.body, req.params.id)
        if (newUserId.length == 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot edit user"
            })
        }
        let newUser = await User.getUser(req.params.id)
        return res.status(200).json({
            success: true,
            result: newUser,
        })
    } catch (error) {
        if (error.code == "ER_DUP_ENTRY"){
            let message
            if (error.message.includes('username')){
                message = 'Username is already exist, please use another username'
            } else  if (error.message.includes('email')){
                message = 'Email is already exist, please use another email'
            }
            return res.status(400).json({
                success: false,
                message: message
            })
        }
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.deleteUser = async function (req, res) {
    try {
        let user = await User.getUser(req.params.id) 
        if (!user){
            return res.status(404).json({
                success: false,
                message: `Can not found user with id = ${req.params.id}`,
            })
        }
        let userCount = await User.deleteUser(req.params.id)
        if (userCount == 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete user"
            })
        }
        return res.status(200).json({
            success: true,
            result: userCount,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//lấy tổng số lượng user, post, tag, answer, upvote, downvote, favorite post trong một khoảng thời gian (truyền lên trong req)
// mặc định là từ 1/1/1 đến 31/12/9999
exports.getGeneralInfoAnalysis = async function(req, res){

}
//lấy số lượng user, post, tag, answer, upvote, downvote, favorite post mỗi ngày trong một khoảng thời gian (truyền lên trong request)
// mặc định là từ 1/1/1 đến 31/12/9999
exports.getDetailInfoAnalysis = async function(req, res){

}


//sửa lại các phương thức get list, search: thêm khoảng thời gian vào, set mặc định là từ 1/1/1 đến 31/12/9999