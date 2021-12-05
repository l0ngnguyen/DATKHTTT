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
        //login với username/email và password
        let user = await User.getUserByUserName(req.body.username) || await User.getUserByEmail(req.body.username)
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
            userId: user.Id,
        });

    } catch (err) {
        
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
exports.sendOtpForgetPassword = async (req, res) => {
    // option của tài khoản gửi email cho người dùng để lấy lại mật khẩu
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
                   
                    return res.status(535).json({
                        success: false,
                        message: error.message || "Some errors occur while sending email"
                    });
                } else {

                    let otp = Math.floor(100000 + Math.random() * 900000);

                    let mail = {
                        from: config.emailUser,
                        to: email,
                        subject: 'Xác thực quên mật khẩu tài khoản Hệ thống hỏi đáp trực tuyến Heap Overflow',
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
        
        return res.status(500).json({
            success: false,
            message: error.message || "Some errors occur while sending email"
        });
    }
};
exports.checkOtpForgetPassword = async (req, res) => {
    const otpToken = req.body.otpToken
    if (otpToken && tokenList[otpToken]) {
        try {
            // decode data của user đã mã hóa vào otpToken
            const data = await jwtHelper.verifyToken(otpToken, config.otpTokenSecret);
            if (data && (req.body.otp == otpList[data.email])) {

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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Verity google token failed"
        });
    }
    try {
        const { sub, email } = payload;
        let user = await User.getUserByGoogleID(sub) || await User.getUserByEmail(email)
        //nếu user ko tồn tại thì ko cho phép đăng nhập, mà chuyển sang trang đăng ký, trả về một accessToken cho phép đăng ký
        if (!user) {
            let user = { email: email, googleId: sub }
            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife);
            tokenList[accessToken] = user;
            
            return res.status(200).json({
                success: true,
                exist: false,
                accessToken: accessToken,
                message: "User does not exist, please sign up",
                ...payload
            })
            //nếu có tồn tại user
        } else {
            //nếu email của tài khoản hệ thống trùng với mail của google account thì liên kết tài khoản với google luôn rồi đăng nhập ngay
            if (!user.googleId) {
                //update google iD để kết nối tài khoản hệ thống vs tài khoản google 
                let res = await User.editUser({ googleId: sub }, user.Id)
            }
            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife);
            let refreshToken = await jwtHelper.generateToken(user, config.refreshTokenSecret, config.refreshTokenLife)
            tokenList[refreshToken] = { accessToken, refreshToken };
            res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });
            
            return res.status(200).json({
                success: true,
                exist: true,
                accessToken: accessToken,
                message: "Login successfully",
                userId: user.Id,
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

exports.signUpWithGoogle = async (req, res) => {
    //đăng ký bằng tài khoản google, gửi google TokenID lên, trả về 1 access token cho google ID của tài khoản, sau đó dùng access token này gửi lên 1 lần nữa để đăng ký cho tài khoản này
    let payload;
    try {
        const ticket = await OAuthClient.verifyIdToken({
            idToken: req.body.idToken,
            audience: config.googleClientID
        })
        payload = ticket.getPayload()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Verity google token failed"
        });
    }
    try {
        const { sub, email } = payload;
        let user = await User.getUserByGoogleID(sub) || await User.getUserByEmail(email)
        if (user) {
            //nếu tồn tại tài khoản có email bằng email google thì link tài khoản đó với tài khoản google và cho phép đăng nhập luôn 
            if (!user.googleId) {
                //update google iD để kết nối tài khoản hệ thống vs tài khoản google 
                let res = await User.editUser({ googleId: sub }, user.Id)
            }

            //có tài khoản hệ thống đã tạo bằng google account này rồi thì cho phép đăng nhập luôn
            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife);
            let refreshToken = await jwtHelper.generateToken(user, config.refreshTokenSecret, config.refreshTokenLife)
            tokenList[refreshToken] = { accessToken, refreshToken };
            res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });

            return res.status(200).json({
                success: false,
                exist: true,
                message: "Already sign up with this google account, link user to this google account ",
                accessToken: accessToken,
                userId: user.Id,
                ...payload
            })
            //chưa có tài khoản thì trả về access token cho googleId và email (google)
        } else {
            let user = { email: email, googleId: sub }
            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife);
            tokenList[accessToken] = user;

            return res.status(200).json({
                success: true,
                exist: false,
                accessToken: accessToken,
                message: "Can create account with this google account, please sign up with this access token",
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
exports.sendOtpSignUp = async (req, res) => {
    //gửi Otp vào email khi tạo tài khoản bằng email, gửi email lên,  trả về Otp token
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
        let userName = req.body.userName;
        const userByEmail = await User.getUserByEmail(email);
        const userByUserName = await User.getUserByUserName(userName)
        if (userByEmail || userByUserName) {
            if (userByEmail && userByUserName){
                return res.status(400).json({
                    success: false,
                    message: "User name and email is already use, can not use this to register new account"
                });
            } 
            else if (userByUserName){
                return res.status(400).json({
                    success: false,
                    message: "User name is already use, can not use this to register new account"
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Email is already use, can not use this to register new account"
                });
            }
            
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
                        subject: 'Xác thực tạo tài khoản Hệ thống hỏi đáp trực tuyến Heap Overflow',
                        text: 'Mã xác thực của bạn là ' + otp + '. Mã này có hiệu lực trong vòng 3 phút',
                    };
                    transporter.sendMail(mail, async function (error, info) {
                        if (error) {
                            return res.status(535).json({
                                success: false,
                                message: error.message || "Some errors occur while sending email"
                            });
                        } else {
                            let data = { email: email }

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
    
        return res.status(500).json({
            success: false,
            message: error.message || "Some errors occur while sending email"
        });
    }
}
exports.checkOtpSignUp = async (req, res) => {
    //check Otp và Otp token còn hạn không, gửi Otp và Otp token lên, trả về access token  cho username, email,... đã đăng ký; sau đấy dùng access token này để đăng ký cho tài khoản
    const otpToken = req.body.otpToken
    if (otpToken && tokenList[otpToken]) {
        try {
            // decode data của user đã mã hóa vào otpToken
            const data = await jwtHelper.verifyToken(otpToken, config.otpTokenSecret);
            if (data && (req.body.otp == otpList[data.email])) {

                let accessToken = await jwtHelper.generateToken(data, config.accessTokenSecret, config.accessTokenLife);
                tokenList[accessToken] = data
                return res.json({
                    success: true,
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

exports.signUp = async (req, res) => {
    //đăng ký tài khoản, gửi thông tin của ngườI dùng và access token lên để xác thực, sau đó tiến hành thêm tài khoản vào hệ thống, access token và refresh token
    const accessToken = req.body.accessToken
    try {
        const data = await jwtHelper.verifyToken(accessToken, config.accessTokenSecret);

        if (data.email != req.body.email) {
            return res.status(400).json({
                success: false,
                message: 'Please check your request email to match with email in access token'
            });
        } else {
            let user = req.body
            user.accessToken = undefined
            user.password = await bcrypt.hash(user.password, config.saltRounds)
            user.avatarLink = user.avatarLink || "./public/images/default_avatar.jpg"

            user.Id = await User.createUser({ ...user, googleId: data.googleId })
            user = await User.getUser(user.Id);
            //phương thức insert của  knex nó trả về 1 mảng id nếu thành công

            let accessToken = await jwtHelper.generateToken(user, config.accessTokenSecret, config.accessTokenLife)

            let refreshToken = await jwtHelper.generateToken(user, config.refreshTokenSecret, config.refreshTokenLife)

            tokenList[refreshToken] = { accessToken, refreshToken };

            res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true, maxAge: config.refreshTokenCookieLife });
            return res.status(200).json({
                success: true,
                accessToken: accessToken,
                userId: user.Id
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}



