require('dotenv').config() 

exports.port = process.env.PORT || 3001
exports.accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h"
exports.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET"
exports.refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "30d"
exports.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET"
exports.refreshTokenCookieLife = process.env.COOKIE_LIFE || 30 * 24 * 60 * 60 * 1000
exports.dbHost = process.env.DB_HOST || "127.0.0.1"
exports.db = process.env.DB || "DAHTTT"
exports.userDB = process.env.USER_DB || "DAHTTT"
exports.passwordDB = process.env.PASSWORD_DB || ""
exports.saltRounds = Number(process.env.SALT_ROUNDS) || 10
exports.emailService = process.env.EMAIL_SERVICE || "gmail";
exports.emailUser = process.env.EMAIL_USER || "doanthietkehttt20211@gmail.com";
exports.emailPassword = process.env.EMAIL_PASSWORD || "Datk_httt_20211";
exports.otpTokenLife = process.env.OTP_TOKEN_LIFE || "3m"
exports.otpTokenSecret = process.env.OTP_TOKEN_SECRET || "OTP_TOKEN_SECRET"
exports.pageItem = process.env.PAGE_ITEM || 1
exports.perPageItem = process.env.PER_PAGE_ITEM || 50
exports.frontendHost = (process.env.FRONTEND_HOST && process.env.FRONTEND_HOST.split(" ")) || ["http://localhost:3000", "http://localhost:3000/", "http://localhost:3001"]
exports.googleClientID = process.env.GOOGLE_CLIENT_ID || "846925863530-akeqgusm19k4dgicm7ncbl1jlsdi48m2.apps.googleusercontent.com"
exports.orderBy = process.env.ORDER_BY || "Id"
exports.orderType = process.env.ORDER_TYPE || "ASC"
exports.startDate = process.env.START_DATE || new Date('0001-01-01')
exports.endDate = process.env.END_DATE || new Date('9999-12-31')

