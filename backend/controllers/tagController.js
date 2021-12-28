const path = require('path')
const Post = require('../models/Post')
const Tag = require('../models/Tag')
const PostTag = require('../models/PostTag')
const PostVote = require('../models/PostVote')
const config = require('../config/config')
const User = require('../models/User')
const jwtHelper = require('../helpers/jwtToken')


exports.getTag = async function (req, res) {
    try {
        let tag = await Tag.getTag(req.params.id)

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: `Cannot find tag with id = ${req.params.id}`
            })
        }
        return res.status(200).json({
            success: true,
            result: tag
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}



exports.getTagList = async function (req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perPage = parseInt(req.query.perPage) || config.perPageItem

        let orderBy = req.query.orderBy || config.orderBy
        let orderType = req.query.orderType || config.orderType

        let startDate = req.query.startDate ? new Date(req.query.startDate) : config.startDate
        let endDate = req.query.endDate ? new Date(req.query.endDate) : config.endDate

        let tagList
        let userId = req.query.userId

        if (!userId){
            tagList = await Tag.getListTag(page, perPage, orderBy, orderType, startDate, endDate)
        } else {
            let user = await User.getUser(userId)
            if (!user){
                return res.status(400).json({
                    success: false,
                    message: `Cannot find tags of user with userId = ${userId}`
                })
            }
            tagList = await Tag.getListTagByUserId(userId, page, perPage, orderBy, orderType, startDate, endDate)
        }

        if (tagList.data.length == 0) {
            return res.status(200).json({
                success: true,
                result: tagList,
                message: "No tag found"
            })
        }
        return res.status(200).json({
            success: true,
            result: tagList
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.searchTag = async function (req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perPage = parseInt(req.query.perPage) || config.perPageItem

        let orderBy = req.query.orderBy || config.orderBy
        let orderType = req.query.orderType || config.orderType

        let query = req.query.query

        let startDate = req.query.startDate ? new Date(req.query.startDate) : config.startDate
        let endDate = req.query.endDate ? new Date(req.query.endDate) : config.endDate

        let tags = await Tag.searchTag(query, page, perPage, orderBy, orderType, startDate, endDate)

        return res.status(200).json({
            success: true,
            result: tags
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


exports.createTag = async function (req, res) {

    try {
        let tag = req.body
        let count = await Tag.createTag(req.body, req.jwtDecoded.Id);
        tag = await Tag.getTagByTagName(req.body.tagName)
        
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot create tag `
            })
        }

        return res.status(200).json({
            success: true,
            result: tag
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}




exports.editTag = async function (req, res) {
    try {
        let tag = await Tag.getTag(req.body.tagId)
        //Check exists
        if (tag === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find tag with id = ${req.body.tagId}`
            })
        }
        //check xem có quyền edit tag hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (tag.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2){
            return res.status(403).json({
                success: false,
                message: `You are not tag creator or admin, can not edit this tag`
            })
        }
        let count = await Tag.editTag({
            tagName: req.body.tagName,
            tagDetail: req.body.tagDetail
        }, tag.Id);
        tag = await Tag.getTag(req.body.tagId)
        
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot edit tag with id = ${req.body.tagId}`
            })
        }

        return res.status(200).json({
            success: true,
            result: tag
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

exports.deleteTag = async function (req, res) {
    try {
        let tag = await Tag.getTag(req.body.tagId)
        //Check exists
        if (tag === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find tag with id = ${req.body.tagId}`
            })
        }
        //check xem có quyền edit tag hay không: là chủ sở hữu hoặc là admin (role bằng 2 là admin)
        if (tag.userId != req.jwtDecoded.Id && req.jwtDecoded.role != 2){
            return res.status(403).json({
                success: false,
                message: `You are not tag creator or admin, can not delete this tag`
            })
        }
        let count = await Tag.deleteTag(req.body.tagId)
        
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot delete tag with id = ${req.body.tagId}`
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