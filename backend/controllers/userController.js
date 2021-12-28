const bcrypt = require('bcrypt')
const path = require('path')
const User = require('../models/User')
const Tag = require('../models/Tag')
const config = require('../config/config')
const jwtHelper = require('../helpers/jwtToken')
const { OAuth2Client } = require('google-auth-library')
const OAuthClient = new OAuth2Client(config.googleClientID)

let nodemailer = require("nodemailer");
const { query } = require('express')
let tokenList = {}
let otpList = {}


exports.getUser = async function (req, res) {
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

exports.getUserByUserName = async function (req, res) {
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

exports.getUserByEmail = async function (req, res) {
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
        let avatarPath = await User.getAvatar(req.params.id)
        

        if (avatarPath == undefined) {
            avatarPath = {avatarLink: './public/images/default_avatar.jpg'}
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
exports.linkWithGoogleAccount = async (req, res) => {
    //dùng để liên kết tài khoản google với tài khoản hiện tại 
    //gửi email lên 
    try {
        //console.log(req.jwtDecoded)
        let count = await User.editUser({ googleId: req.body.googleId }, req.jwtDecoded.Id)

        return res.status(200).json({
            success: true,
        })
    } catch (error) {
        //console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.editProfile = async (req, res) => {
    //đổi thông tin người dùng trừ thông tin về email (đổi email cần verify email mới cho đổi), gửi access token và thông tin thay đổi lên nếu cần
    try {
        let user = req.body

        let id = await User.editUser(
            {
                userName: user.userName,
                avatarLink: user.avatarLink,
                gender: user.gender,
                facebookLink: user.facebookLink,
                githubLink: user.githubLink,
                location: user.location,
                description: user.description,
                googleId: user.googleId,
            }, req.jwtDecoded.Id)
        let newUser = await User.getUser(req.jwtDecoded.Id)
        //trả lại access và refresh token mới cho người dùng

        let accessToken = await jwtHelper.generateToken(newUser, config.accessTokenSecret, config.accessTokenLife)

        let refreshToken = await jwtHelper.generateToken(newUser, config.refreshTokenSecret, config.refreshTokenLife)

        tokenList[refreshToken] = { accessToken, refreshToken };

        res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });

        return res.status(200).json({
            success: true,
            accessToken: accessToken,
            user: newUser,
            message: "Change profile successful"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.sendOtpEditEmail = async (req, res) => {
    //gửi Otp vào email khi thay đổi email, gửi email lên,  trả về Otp token
    const emailOption = {
        service: config.emailService,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword
        }
    };
    let transporter = nodemailer.createTransport(emailOption);
    try {
        let email = req.body.email;
        const user = await User.getUserByEmail(email);
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already use, can not change this user email to this"
            });
        } else {
            transporter.verify(async function (error, success) {
                if (error) {
                    return res.status(535).json({
                        success: false,
                        message: error.message || "Some errors occur while sending email"
                    });
                } else {

                    let otp = Math.floor(100000 + Math.random() * 900000);

                    let mail = {
                        from: config.emailUser,
                        to: email,
                        subject: 'Xác thực thay đổi tài khoản email cho tài khoản Hệ thống hỏi đáp trực tuyến Heap Overflow',
                        text: 'Mã xác thực của bạn là ' + otp + '. Mã này có hiệu lực trong vòng 3 phút',
                    };
                    transporter.sendMail(mail, async function (error, info) {
                        if (error) {
                            return res.status(535).json({
                                success: false,
                                message: error.message || "Some errors occur while sending email"
                            });
                        } else {
                            let data = { email: email, Id: req.jwtDecoded.Id }

                            //tạo otptoken để check thời gian tồnt ại của otp token
                            let otpToken = await jwtHelper.generateToken(data, config.otpTokenSecret, config.otpTokenLife);
                            tokenList[otpToken] = data
                            otpList[data.email] = otp

                            return res.status(200).json({
                                success: true,
                                otpToken: otpToken
                            });
                        }
                    });
                }
            });
        }
    } catch (error) {
        //console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || "Some errors occur while sending email"
        });
    }
}
exports.checkOtpEditEmail = async (req, res) => {
    //check Otp và Otp token còn hạn không, gửi Otp, Otp token, accessToken của user lên, trả về access token và refresh token   cho username, email,... mới, dùng để đăng nhập
    const otpToken = req.body.otpToken
    if (otpToken && tokenList[otpToken]) {
        try {
            // decode data của user đã mã hóa vào otpToken
            const data = await jwtHelper.verifyToken(otpToken, config.otpTokenSecret);
            if (data && (req.body.otp == otpList[data.email])) {
                //thay đổi email của tài khoản này
                let id = await User.editUser({ email: data.email }, req.jwtDecoded.Id)

                //lấy thông tin user vừa ms sửa
                let newUser = await User.getUserByEmail(data.email)

                //trả về access và refresh token
                let accessToken = await jwtHelper.generateToken(newUser, config.accessTokenSecret, config.accessTokenLife)

                let refreshToken = await jwtHelper.generateToken(newUser, config.refreshTokenSecret, config.refreshTokenLife)

                tokenList[refreshToken] = { accessToken, refreshToken };

                res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });
                return res.json({
                    success: true,
                    user: newUser,
                    accessToken: accessToken
                });
            } else {
                //người dùng nhập sai OTP
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP",
                });
            }

        } catch (error) {
            // OTP không hợp lệ do hết hạn
            console.log(error)
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid OTP",
            });
        }
    } else {
        //sai OTP token

        return res.status(400).json({
            success: false,
            message: 'Invalid otp token provided',
        });
    }
}

exports.changePassword = async (req, res) => {
    try {
        let user = await User.getUser(req.jwtDecoded.Id)
        let match = await bcrypt.compare(req.body.oldPassword, user.password)
        if (match) {
            let newPassword = await bcrypt.hash(req.body.newPassword, config.saltRounds)
            let countChange = await User.updatePassword(req.jwtDecoded.Id, newPassword)
            if (countChange == 0) {
                return res.status(418).json({
                    success: false,
                    message: "Cannot change password"
                })
            }
            return res.status(200).json({
                success: true,
                message: 'Change password successful',
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.getListUser = async function(req, res)  {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perPage = parseInt(req.query.perPage) || config.perPageItem

        let orderBy = req.query.orderBy || config.orderBy
        let orderType = req.query.orderType || config.orderType

        let startDate = req.query.startDate ? new Date(req.query.startDate) : config.startDate
        let endDate = req.query.endDate ? new Date(req.query.endDate) : config.endDate

        let userList = await User.getListUser(page, perPage, orderBy, orderType, startDate, endDate)
        
        if (userList.data.length == 0) {
            return res.status(200).json({
                success: true,
                result: userList,
                message: "No user found"
            })
        }

        return res.status(200).json({
            success: true,
            result: userList
        })
    } 
    catch (error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        });
    } 
}