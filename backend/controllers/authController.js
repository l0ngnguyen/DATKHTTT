const User = require('../models/User')
const jwtHelper = require('../helpers/jwtToken')
const bcrypt = require('bcrypt')
const config = require('../config/config')
const { OAuth2Client } = require('google-auth-library')
const OAuthClient = new OAuth2Client(config.googleClientID)

let nodemailer = require("nodemailer");
let tokenList = {}
let otpList = {}

exports.login = async function (req, res) {
    try {
        console.log(req.body)
        let user = await User.getUserByUserName(req.body.username)

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Username or password incorrect"
            })
            return
        }

        let match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            res.status(401).json({
                success: false,
                message: "Username or password incorrect"
            })
            return
        }

        let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife)
        let refreshToken = await jwtHelper.generateToken(user, config.refreshTokenSecret, config.refreshTokenLife)
        tokenList[refreshToken] = { accessToken, refreshToken };
        res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });
        return res.status(200).json({
            success: true,
            accessToken,
            id: user.Id,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            err,
        });
    }
}

exports.refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    let refreshTokenFromClient = req.cookies.refreshToken;
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            let decoded = await jwtHelper.verifyToken(refreshTokenFromClient, config.refreshTokenSecret);
            let user = decoded;
            //console.log(user)
            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife);
            // gửi token mới về cho người dùng
            return res.status(200).json({
                success: true,
                accessToken
            });
        } catch (error) {
            console.log(error)
            delete tokenList[refreshTokenFromClient];
            res.status(403).json({
                success: false,
                message: 'Invalid refresh token.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).json({
            success: false,
            message: 'No token provided.',
        });
    }
};
exports.logOut = function (req, res) {
    var refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        delete tokenList[refreshToken];
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true
        })

    } else {
        res.status(403).json({
            success: false
        })
    }
};
exports.sendOtp = async (req, res) => {
    // option của tài khoản gửi email cho người dùng
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
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email does not exist"
            });
        } else {
            transporter.verify(async function (error, success) {
                if (error) {
                    console.log(error)
                    return res.status(535).json({
                        success: false,
                        message: error.message || "Some errors occur while sending email"
                    });
                } else {

                    let otp = Math.floor(100000 + Math.random() * 900000);

                    let mail = {
                        from: config.emailUser,
                        to: email,
                        subject: 'Xác thực tài khoản Hệ thống hỏi đáp trực tuyến Heap Overflow',
                        text: 'Mã xác thực của bạn là ' + otp + '. Mã này có hiệu lực trong vòng 3 phút',
                    };
                    transporter.sendMail(mail, async function (error, info) {
                        if (error) {
                            return res.status(535).json({
                                success: false,
                                message: error.message || "Some errors occur while sending email"
                            });
                        } else {
                            let data = user
                            data.password = undefined
                            //tạo otptoken để check thời gian tồnt ại của otp token
                            let otpToken = await jwtHelper.generateToken(data, config.otpTokenSecret, config.otpTokenLife);
                            tokenList[otpToken] = data
                            otpList[user.email] = otp
                            console.log(user.email)

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
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || "Some errors occur while sending email"
        });
    }
};
exports.checkOtp = async (req, res) => {
    const otpToken = req.body.otpToken
    if (otpToken && tokenList[otpToken]) {
        try {
            // decode data của user đã mã hóa vào otpToken
            const data = await jwtHelper.verifyToken(otpToken, config.otpTokenSecret);
            if (data && (req.body.otp == otpList[data.email])) {
                console.log(data.email)
                let accessToken = await jwtHelper.generateToken(data, config.accessTokenSecret, config.accessTokenLife);
                tokenList[accessToken] = data
                return res.json({
                    success: true,
                    accessToken: accessToken
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP",
                });
            }

        } catch (error) {
            // otp hết hạn
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid OTP",
            });
        }
    } else {
        // console.log(tokenList[req.body.otpToken])
        return res.status(400).json({
            success: false,
            message: 'Invalid otp token provided',
        });
    }
};

exports.forgetPassword = async (req, res) => {
    const accessToken = req.body.accessToken
    // console.log(req.body.newPassword)
    if (accessToken && tokenList[accessToken]) {
        try {
            // decode data của user đã mã hóa vào accessToken trong bước checkOtp trước đó
            const data = await jwtHelper.verifyToken(accessToken, config.accessTokenSecret);
            let newPassword = await bcrypt.hash(req.body.newPassword, config.saltRounds)
            let countChange = await User.updatePassword(data.Id, newPassword)
            if (countChange == 0) {
                return res.status(418).json({
                    success: false,
                    message: "Cannot change password"
                })
            }

            return res.status(200).json({
                success: true,
                result: "Success to change password"
            })
        } catch (error) {
            // otp hết hạn
            return res.status(400).json({
                success: false,
                message: error.message || 'Some errors occur while changing password',
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: 'Invalid access token provided',
        });
    }
}

exports.loginWithGoogle = async (req, res) => {
    let payload;
    try {
        const ticket = await OAuthClient.verifyIdToken({
            idToken: req.body.idToken,
            audience: config.googleClientID
        })
        payload = ticket.getPayload()
    } catch (error){
        return res.status(500).json({
            success: false,
            message: "Verity google token failed"
        });
    }
    try {
        const { sub } = payload;
        let user = await User.getUserByGoogleID(sub)
        if (!user) {
            return res.status(200).json({
                //yêu cầu người dùng tạo tài khoản
                //thêm chức năng liên kết tài khoản với tài khoản google
                success: true,
                exist: false,
                message: "User does not exist",
                ...payload
            })
        } else {
            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife);
            let refreshToken = await jwtHelper.generateToken(user, config.refreshTokenSecret, config.refreshTokenLife)
            tokenList[refreshToken] = { accessToken, refreshToken };
            res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });
            return res.status(200).json({
                success: true,
                exist: true,
                accessToken: accessToken,
                message: "Login successfully",
                ...payload
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




