const path = require('path')
const Post = require('../models/Post')
const PostTag = require('../models/PostTag')
const config = require('../config/config')
const jwtHelper = require('../helpers/jwtToken')


exports.getPost = async function (req, res) {
    try {
        let post = await Post.getPost(req.params.id)
        let postTags = await PostTag.getTagsOfPost(req.params.id)
        post.postTags = []

        for (var index in postTags) {
            post.postTags.push(postTags[index].tagId)
        }

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

        for (var post of postList.data) {
            let postTags = await PostTag.getTagsOfPost(post.Id)
            post.postTags = []

            for (var index in postTags) {
                post.postTags.push(postTags[index].tagId)
            }
        }

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
        for (var post of posts) {
            let postTags = await PostTag.getTagsOfPost(post.Id)
            post.postTags = []
            for (var index in postTags) {
                post.postTags.push(postTags[index].tagId)
            }
        }

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

//sửa khi có thêm tag
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
                message: `Cannot create tag `
            })
        }

        //laasy casc tak da chen duoc
        let postTags = await PostTag.getTagsOfPost(post.Id)
        post.postTags = []
        for (var index in postTags) {
            post.postTags.push(postTags[index].tagId)
        }

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

//sửa khi có thêm tag
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
        //check xem có quyền edit tag hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (post.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2) {
            return res.status(403).json({
                success: false,
                message: `You are not post creator or admin, can not edit this tag`
            })
        }
        let count = await Post.editPost({
            postName: req.body.postName,
            postDetail: req.body.postDetail
        }, post.Id);
        post = await Post.getPost(req.body.postId)

        //xoa bo tag cu roi them tag moi vao
        let delPostTag = await PostTag.deleteTagFromPost(post.Id)
        for (let index in req.body.postTags) {
            let count = await PostTag.addTagToPost(post.Id, req.body.postTags[index])
        }

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot edit post with id = ${req.body.postId}`
            })
        }

        //laasy casc tak da chen duoc
        let postTags = await PostTag.getTagsOfPost(post.Id)
        post.postTags = []
        for (var index in postTags) {
            post.postTags.push(postTags[index].tagId)
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

exports.deletePost = async function (req, res) {
    try {
        let post = await Post.getPost(req.body.postId)
        //Check exists
        if (post === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find Post with id = ${req.body.postId}`
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
        let delPostTag = await PostTag.deleteTagFromPost(req.body.postId)

        let count = await Post.deletePost(req.body.postId)

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot delete post with id = ${req.body.postId}`
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

exports.searchPostByTag = async function (req, res) {

}