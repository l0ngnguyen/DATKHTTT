const path = require('path')
const Post = require('../models/Post')
const Tag = require('../models/Tag')
const PostTag = require('../models/PostTag')
const PostVote = require('../models/PostVote')
const config = require('../config/config')
const jwtHelper = require('../helpers/jwtToken')
const Answer = require('../models/Answer')
const AnswerVote = require('../models/AnswerVote')



exports.getVoteNum = async function (req, res) {
    //lấy vote num của vote đó
    try {
        let post = await Post.getPost(req.query.postId)
        if (!post) {
            return res.status(400).json({
                success: false,
                message: `Cannot find post with id = ${req.query.postId}`
            })
        }
        let voteNum = { upVote: 0, downVote: 0 }
        let upVote = await PostVote.getUpVoteNumOfPost(req.query.postId)
        let downVote = await PostVote.getDownVoteNumOfPost(req.query.postId)
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
        let post = await Post.getPost(req.body.postId)
        if (!post){
            return res.status(400).json({
                success: false,
                message: `Can not find post with id = ${req.body.postId}`
            })
        }
        let userVote = await PostVote.getUserVoteOfPost(req.body.postId, req.jwtDecoded.Id)
        return res.status(200).json({
            success: true,
            result: userVote
        })
    
    } catch (error){
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
        //check xem post còn tồn tại hay không
        let post = await Post.getPost(req.body.postId)
        if (!post){
            return res.status(400).json({
                success: false,
                message: `Can not find post with id = ${req.body.postId}`
            })
        }
        //xoá vote cũ trước ở post này của người dùng
        let delVote  = await PostVote.deleteUserVote(req.jwtDecoded.Id, req.body.postId)
        let addVote = await PostVote.addUserVote( req.body.postId, req.jwtDecoded.Id, req.body.voteType)
        let voteResult = await PostVote.getUserVoteOfPost(req.body.postId, req.jwtDecoded.Id)

        return res.status(200).json({
            success: true,
            result: voteResult
        })
        
    }
    catch (error){
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
        //check xem post còn tồn tại hay không
        let post = await Post.getPost(req.body.postId)
        if (!post){
            return res.status(400).json({
                success: false,
                message: `Can not find post with id = ${req.body.postId}`
            })
        }
        //xoá vote cũ trước ở post này của người dùng
        let delVote  = await PostVote.deleteUserVote(req.jwtDecoded.Id, req.body.postId)

        return res.status(200).json({
            success: true,
            result: delVote
        })
        
    }
    catch (error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}




exports.getTags = async function (req, res){
    try {
        let post = await Post.getPost(req.query.postId)
        if (!post){
            return res.status(400).json({
                success: false,
                message: `Can not find post with id = ${req.query.postId}`
            })
        }
        let postTags = await PostTag.getTagsOfPost(req.query.postId)

        let listTag = []
        for (var index in postTags) {
            listTag.push(await Tag.getTag(postTags[index].tagId))
        }
        return res.status(200).json({
            success: true,
            result: listTag
        })
    } catch (error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}



exports.getPost = async function (req, res) {
    try {
        let post = await Post.getPost(req.params.id)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: `Cannot find post with id = ${req.params.id}`
            })
        }
        return res.status(200).json({
            success: true,
            result: post
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.getPostList = async function (req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perPage = parseInt(req.query.perPage) || config.perPageItem
        let postList
        let userId = req.query.userId

        if (!userId) {
            postList = await Post.getListPost(page, perPage)
        } else {
            postList = await Post.getListPostByUserId(userId, page, perPage)
        }

        // for (var post of postList.data) {
        //     //Lấy danh sách tag cho từng vote 
        //     let postTags = await PostTag.getTagsOfPost(post.Id)
        //     post.postTags = []

        //     for (var index in postTags) {
        //         post.postTags.push(await Tag.getTag(postTags[index].tagId))
        //     }

        //     //lấy vote num cho từng vote
        //     post.voteNum = { upVote: 0, downVote: 0 }
        //     let upVote = await PostVote.getUpVoteNumOfPost(post.Id)
        //     let downVote = await PostVote.getDownVoteNumOfPost(post.Id)
        //     post.voteNum.upVote = upVote[0].voteNum
        //     post.voteNum.downVote = downVote[0].voteNum
        // }

        if (postList.data.length == 0) {
            return res.status(400).json({
                success: false,
                message: "No post found"
            })
        }

        return res.status(200).json({
            success: true,
            result: postList
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.searchPost = async function (req, res) {
    try {
        let query = req.query.query

        let posts = await Post.searchPost(query)

        // list cac tag cua moi post
        // for (var post of posts) {
        //     let postTags = await PostTag.getTagsOfPost(post.Id)
        //     post.postTags = []
        //     for (var index in postTags) {
        //         post.postTags.push(await Tag.getTag(postTags[index].tagId))
        //     }

        //     post.voteNum = { upVote: 0, downVote: 0 }
        //     let upVote = await PostVote.getUpVoteNumOfPost(post.Id)
        //     let downVote = await PostVote.getDownVoteNumOfPost(post.Id)
        //     post.voteNum.upVote = upVote[0].voteNum
        //     post.voteNum.downVote = downVote[0].voteNum
        // }

        return res.status(200).json({
            success: true,
            result: posts
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//tạo post mới
exports.createPost = async function (req, res) {
    try {
        let count = await Post.createPost(req.body, req.jwtDecoded.Id);
        let post = await Post.getPostByPostName(req.body.postName)

        for (let index in req.body.postTags) {
            let count = await PostTag.addTagToPost(post.Id, req.body.postTags[index])
        }

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot create post `
            })
        }

        // //laasy casc tak da chen duoc
        // let postTags = await PostTag.getTagsOfPost(post.Id)
        // post.postTags = []
        // for (var index in postTags) {
        //     post.postTags.push(await Tag.getTag(postTags[index].tagId))
        // }
        // //lấy thông tin vote: mặc định mới tạo thì bằng 0 hết 
        // post.voteNum = { upVote: 0, downVote: 0 }
        // let upVote = await PostVote.getUpVoteNumOfPost(post.Id)
        // let downVote = await PostVote.getDownVoteNumOfPost(post.Id)
        // post.voteNum.upVote = upVote[0].voteNum
        // post.voteNum.downVote = downVote[0].voteNum

        return res.status(200).json({
            success: true,
            result: post
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//sửa  post
exports.editPost = async function (req, res) {
    try {
        let post = await Post.getPost(req.body.postId)
        //Check exists
        if (post === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find post with id = ${req.body.postId}`
            })
        }
        //check xem có quyền edit post hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (post.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2) {
            return res.status(403).json({
                success: false,
                message: `You are not post creator or admin, can not edit this post`
            })
        }
        let count = await Post.editPost({
            postName: req.body.postName,
            postDetail: req.body.postDetail,
        }, post.Id);
        post = await Post.getPost(req.body.postId)


        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot edit post with id = ${req.body.postId}`
            })
        }

        //xoa bo tag cu roi them tag moi vao
        let delPostTag = await PostTag.deleteTagFromPost(post.Id)
        for (let index in req.body.postTags) {
            let count = await PostTag.addTagToPost(post.Id, req.body.postTags[index])
        }

        // //laasy casc tak da chen duoc
        // let postTags = await PostTag.getTagsOfPost(post.Id)
        // post.postTags = []
        // for (var index in postTags) {
        //     post.postTags.push(await Tag.getTag(postTags[index].tagId))
        // }

        // //lấy vote num sau khi sửa
        // post.voteNum = { upVote: 0, downVote: 0 }
        // let upVote = await PostVote.getUpVoteNumOfPost(post.Id)
        // let downVote = await PostVote.getDownVoteNumOfPost(post.Id)
        // post.voteNum.upVote = upVote[0].voteNum
        // post.voteNum.downVote = downVote[0].voteNum

        return res.status(200).json({
            success: true,
            result: post
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.deletePost = async function (req, res) {
    try {
        let post = await Post.getPost(req.body.postId)
        //Check exists
        if (post === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find post with id = ${req.body.postId}`
            })
        }
        //check xem có quyền edit tag hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (post.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2) {
            return res.status(403).json({
                success: false,
                message: `You are not post creator or admin, can not delete this tag`
            })
        }

        //xoas cac tag khoi post (them vao luc lam bang co khoa ngoai de no khong loi)
        let ansVoteCount = await AnswerVote.deleteUserVoteByPostId(req.body.postId)
        let answerCount = await Answer.deleteAnswersByPostId(req.body.postId)

        //xoá post
        let postVoteCount = await PostVote.deleteUserVoteByPosstId(req.body.postId)
        let postCount = await Post.deletePost(req.body.postId)

        if (postCount == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot delete post with id = ${req.body.postId}`
            })
        }

        return res.status(200).json({
            success: true,
            result: postCount
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//get right answer of post
//set right answer of post
exports.setRightAnswer = async function (req, res) {
    try {
        let post = await Post.getPost(req.body.postId)
        //Check exists
        if (post === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find post with id = ${req.body.postId}`
            })
        }
        let answer = await Answer.getAnswer(req.body.answerId)
        //Check exists
        if (answer === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find answer with id = ${req.body.answerId}`
            })
        }
        if (answer.postId != req.body.postId){
            return res.status(400).json({
                success: false,
                message: `Cannot set answer of another post for this post`
            })
        }
        //check xem có quyền edit post hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (post.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2) {
            return res.status(403).json({
                success: false,
                message: `You are not post creator or admin, can not edit this post`
            })
        }
        let count = await Post.editPost({
            rightAnswerId: req.body.answerId,
        }, post.Id);
        post = await Post.getPost(req.body.postId)

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot edit post with id = ${req.body.postId}`
            })
        }

        return res.status(200).json({
            success: true,
            result: post
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}
//delete right answer of post
exports.delRightAnswer = async function (req, res) {
    try {
        let post = await Post.getPost(req.body.postId)
        //Check exists
        if (post === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find post with id = ${req.body.postId}`
            })
        }
        //check xem có quyền edit post hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (post.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2) {
            return res.status(403).json({
                success: false,
                message: `You are not post creator or admin, can not edit this post`
            })
        }
        let count = await Post.editPost({
            rightAnswerId: null,
        }, post.Id);
        post = await Post.getPost(req.body.postId)

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot edit post with id = ${req.body.postId}`
            })
        }

        return res.status(200).json({
            success: true,
            result: post
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}