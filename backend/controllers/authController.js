const User = require('../models/User')
const jwtHelper = require('../helpers/jwtToken')
const bcrypt = require('bcrypt')
const config = require('../config/config')

let tokenList = {}

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
    //console.log(refreshTokenFromClient)
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
        return res.status(403).send({
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

