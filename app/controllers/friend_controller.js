const Friend_col = require('../models/friend')
const User_col = require('../models/user')
const mongoose = require('mongoose')
// 添加好友
const add = async (ctx, next) => {
  const req = ctx.request.body
  if (req.myId && req.youId) {
    const find = await Friend_col.find({ myId: req.myId, youId: req.youId, success: 1 })
    if (find.length === 0) {
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
    } else {
      const id = find[0]._id
      const up = await Friend_col.update({ _id: id }, { see: 1 })
      if (up) {
        ctx.body = {
          code: 0,
          msg: '发送成功+'
        }
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '发送失败'
    }
  }

}
// 同意
const agree = async (ctx, next) => {
  const req = ctx.request.body
  if (req.id) {
    const [friend] = await Friend_col.find({ _id: req.id, success: 0 })
    if (friend) {
      const agup = await Friend_col.update({ _id: req.id }, { success: 1, see: 0 })
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
  } else {
    ctx.body = {
      code: 1,
      msg: '错误'
    }
  }
}

// 查看我的联系人
const find = async (ctx, next) => {
  const req = ctx.request.body
  if (req.id) {
    const ag = await Friend_col.aggregate([{
      $lookup: {
        from: 'user',
        localField: 'youId',
        foreignField: '_id',
        as: 'user_info'
      }
    },
    {
      $match: { success: 1, myId: mongoose.Types.ObjectId(req.id) }
    }
    ])
    ctx.body = {
      code: 0,
      data: {
        list: ag
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '没有联系人'
    }
  }
}
// 查看朋友申请
const news = async (ctx, next) => {
  const req = ctx.request.body
  if (req.id) {
    await Friend_col.update({ youId: req.id, success: 0, see: 1 }, { see: 0 })
    const ag = await Friend_col.aggregate([{
      $lookup: {
        from: 'user',
        localField: 'myId',
        foreignField: '_id',
        as: 'user_info'
      }
    },
    {
      $match: { success: 0, youId: mongoose.Types.ObjectId(req.id) }
    }
    ])
    ctx.body = {
      code: 0,
      data: {
        aa: req.id,
        list: ag
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '没有联系人'
    }
  }
}
// 搜索好友
const search = async (ctx, next) => {
  const req = ctx.request.body
  console.log(req, ctx.query.name)
  if (ctx.query.name) {
    const n = await User_col.find({ username: { $regex: ctx.query.name } })
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
const personal = async (ctx, next) => {
  const req = ctx.request.body
  if (req.id && req.youId) {
    const [userinfo] = await User_col.find({ _id: req.youId })
    const success = await Friend_col.count({ myId: req.id, youId: req.youId })
    ctx.body = {
      msg: '成功',
      data: {
        userinfo,
        success
      }
    }
  }
}
module.exports = {
  add,
  agree,
  find,
  news,
  search,
  personal
}