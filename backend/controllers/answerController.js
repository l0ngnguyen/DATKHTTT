const path = require('path')
const Post = require('../models/Post')
const Tag = require('../models/Tag')
const PostTag = require('../models/PostTag')
const PostVote = require('../models/PostVote')
const config = require('../config/config')
const Answer = require('../models/Answer')
const User = require('../models/User')
const AnswerVote = require('../models/AnswerVote')
const jwtHelper = require('../helpers/jwtToken')
const postController = require('./postController')

exports.getVoteNum = async function (req, res) {
    //lấy vote num của vote đó
    try {
        let answer = await Answer.getAnswer(req.query.answerId)
        if (!answer) {
            return res.status(400).json({
                success: false,
                message: `Cannot find answer with id = ${req.query.answerId}`
            })
        }

        let voteNum = { upVote: 0, downVote: 0 }
        let upVote = await AnswerVote.getUpVoteNumOfAnswer(req.query.answerId)
        let downVote = await AnswerVote.getDownVoteNumOfAnswer(req.query.answerId)
        voteNum.upVote = upVote[0].voteNum
        voteNum.downVote = downVote[0].voteNum

        return res.status(200).json({
            success: true,
            result: voteNum
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }

}

//check xem user đã vote post này hay chưa và trả về
exports.getUserVote = async function (req, res) {
    try {
        let answer = await Answer.getAnswer(req.body.answerId)
        if (!answer) {
            return res.status(400).json({
                success: false,
                message: `Can not find answer with id = ${req.body.answerId}`
            })
        }

        let userVote = await AnswerVote.getUserVoteOfAnswer(req.body.answerId, req.jwtDecoded.Id)
        return res.status(200).json({
            success: true,
            result: userVote
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }

}
//thêm vote mới vào post: xoá vote cũ đi nếu có rồi thêm vào)
exports.creteUserVote = async function (req, res) {
    try {
        //check answer có còn tồn tại hay không
        let answer = await Answer.getAnswer(req.body.answerId)
        if (!answer) {
            return res.status(400).json({
                success: false,
                message: `Can not find answer with id = ${req.body.answerId}`
            })
        }
        //xoá vote cũ trước ở post này của người dùng
        let delVote = await AnswerVote.deleteUserVote(req.jwtDecoded.Id, req.body.answerId)
        let addVote = await AnswerVote.addUserVote(req.body.answerId, req.jwtDecoded.Id, req.body.voteType)
        let voteResult = await AnswerVote.getUserVoteOfAnswer(req.body.answerId, req.jwtDecoded.Id)

        return res.status(200).json({
            success: true,
            result: voteResult
        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


//delete vote của người dùng
exports.deleteUserVote = async function (req, res) {
    try {
        //check answer có còn tồn tại hay không
        let answer = await Answer.getAnswer(req.body.answerId)
        if (!answer) {
            return res.status(400).json({
                success: false,
                message: `Can not find answer with id = ${req.body.answerId}`
            })
        }
        //xoá vote cũ trước ở answer này của người dùng
        let delVote = await AnswerVote.deleteUserVote(req.jwtDecoded.Id, req.body.answerId)

        return res.status(200).json({
            success: true,
            result: delVote
        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


exports.getAnswer = async function (req, res) {
    try {
        let answer = await Answer.getAnswer(req.params.id)
        if (!answer) {
            return res.status(404).json({
                success: false,
                message: `Cannot find answer with id = ${req.params.id}`
            })
        }
        answer.postDetail = await postController.getPostDetail(answer.postId)
        return res.status(200).json({
            success: true,
            result: answer
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.getAnswerList = async function (req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perPage = parseInt(req.query.perPage) || config.perPageItem

        let orderBy = req.query.orderBy || config.orderBy
        let orderType = req.query.orderType || config.orderType

        let startDate = req.query.startDate ? new Date(req.query.startDate) : config.startDate
        let endDate = req.query.endDate ? new Date(req.query.endDate) : config.endDate

        let answerList
        let userId = req.query.userId
        let postId = req.query.postId

        if (!userId && !postId) {
            answerList = await Answer.getListAnswer(page, perPage, orderBy, orderType, startDate, endDate)
        } else if (userId && !postId) {
            let user = await User.getUser(userId)
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot find user with userId = ${userId}`
                })
            }

            answerList = await Answer.getListAnswerByUserId(userId, page, perPage, orderBy, orderType, startDate, endDate)
        } else if (!userId && postId) {
            let post = await Post.getPost(postId)
            if (!post) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot find post with userId = ${post}`
                })
            }

            answerList = await Answer.getListAnswerByPostId(postId, page, perPage, orderBy, orderType, startDate, endDate)

            let postView = await Post.editPost({ viewNum: post.viewNum + 1 }, postId)
        }
        //lấy số upvote và downvote cho answer(cần thì viết ko thfi có rồi)

        for (var answer of answerList.data) {
            //Lấy thông tin post của từng answer
            answer.postDetail = await postController.getPostDetail(answer.postId)
        }

        if (answerList.data.length == 0) {
            return res.status(200).json({
                success: true,
                result: answerList,
                message: "No answer found"
            })
        }

        return res.status(200).json({
            success: true,
            result: answerList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


//tạo post mới
exports.createAnswer = async function (req, res) {
    try {
        //check xem post còn tồn tại hay không
        let post = await Post.getPost(req.body.postId)
        if (!post) {
            return res.status(400).json({
                success: false,
                message: `Can not find post with id = ${req.body.postId}`
            })
        }

        let id = await Answer.createAnswer(req.jwtDecoded.Id, req.body.postId, req.body.answerDetail);

        if (id == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot create answer `
            })
        }

        let answer = await Answer.getAnswer(id)


        return res.status(200).json({
            success: true,
            result: answer
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//sửa  post
exports.editAnswer = async function (req, res) {
    try {
        //check answer có còn tồn tại hay không
        let answer = await Answer.getAnswer(req.body.answerId)
        if (!answer) {
            return res.status(400).json({
                success: false,
                message: `Can not find answer with id = ${req.body.answerId}`
            })
        }
        //check xem có quyền edit post hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (answer.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2) {
            return res.status(403).json({
                success: false,
                message: `You are not answer creator or admin, can not edit this answer`
            })
        }
        let count = await Answer.editAnswer({
            answerDetail: req.body.answerDetail
        }, answer.Id);
        answer = await Answer.getAnswer(req.body.answerId)


        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot edit answer with id = ${req.body.answerId}`
            })
        }

        return res.status(200).json({
            success: true,
            result: answer
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.deleteAnswer = async function (req, res) {
    try {
        //check answer có còn tồn tại hay không
        let answer = await Answer.getAnswer(req.body.answerId)
        if (!answer) {
            return res.status(400).json({
                success: false,
                message: `Can not find answer with id = ${req.body.answerId}`
            })
        }
        //check xem có quyền edit post hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (answer.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2) {
            return res.status(403).json({
                success: false,
                message: `You are not answer creator or admin, can not edit this answer`
            })
        }

        // let answerVoteCount = await AnswerVote.deleteUserVoteByAnswerId(req.body.answerId)  
        let count = await Answer.deleteAnswer(req.body.answerId)


        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot delete answer with id = ${req.body.answerId}`
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


