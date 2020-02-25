const Friend_col = require('../models/friend')
const User_col = require('../models/user')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
class friendClt {
  async add(ctx) {
    ctx.verifyParams({
      myId: { type: 'string', require: true },
      youId: { type: 'string', require: true }
    })
    const req = ctx.request.body
    const count = await Friend_col.create({
      myId: req.myId,
      youId: req.youId,
      success: 0, see: 1
    });
    if (count) {
      ctx.body = {
        code: 0,
        msg: '发送成功'
      }
    }
  }
  async find(ctx) {
    const list = await Friend_col.aggregate([{
      $lookup: {
        from: 'user',
        localField: 'youId',
        foreignField: '_id',
        as: 'user_info'
      }
    },
    {
      $match: { success: 1, myId: ObjectId(ctx.query._id) }
    }, {
      $project: { user_info: { _id: 1, avatar: 1, username: 1 } }
    }
    ])
    ctx.body = {
      code: 0,
      list
    }
  }
  async agree(ctx) {
    const req = ctx.request.body
    ctx.verifyParams({
      _id: { type: "string", require: true }
    })
    const [friend] = await Friend_col.find({ _id: req._id, success: 0 })
    if (friend) {
      const agup = await Friend_col.update({ _id: req._id }, { success: 1, see: 0 })
      if (agup) {
        if (await Friend_col.create({
          myId: friend.youId,
          youId: friend.myId,
          success: 1, see: 0
        })) {
          ctx.body = {
            code: 0,
            msg: '已成为好友'
          }
        }
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '请求失败'
      }
    }
  }
  async news(ctx) {
    await Friend_col.update({ youId: ObjectId(ctx.query.id), success: 0, see: 1 }, { see: 0 })
    const list = await Friend_col.aggregate([{
      $lookup: {
        from: 'user',
        localField: 'myId',
        foreignField: '_id',
        as: 'user_info'
      }
    },
    {
      $match: { success: 0, youId: ObjectId(ctx.query._id) }
    }
    ])
    ctx.body = {
      code: 0,
      data: list
    }
  }
  async search(ctx) {
    if (ctx.params.name) {
      const n = await User_col.find({ username: { $regex: ctx.params.name } })
      ctx.body = {
        code: 0,
        list: n
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '请填写用户名'
      }
    }
  }
  async personal(ctx) {
    const req = ctx.request.body
    const userinfo = await User_col.findOne({ _id: ObjectId(req.youId) })
    const success = await Friend_col.count({ myId: ObjectId(req.id), youId: ObjectId(req.youId) })
    ctx.body = {
      data: {
        userinfo,
        success
      }
    }
  }
}
module.exports = new friendClt()