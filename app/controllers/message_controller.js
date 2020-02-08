const Message_col = require('../models/message')
const User_col = require('../models/user')
const mongoose = require('mongoose')

const findId = async (ctx) => {
  const req = ctx.request.body
  const s = await Message_col.aggregate([
    { $match: { sendId: mongoose.Types.ObjectId(req.id) } },
    {
      $group: {
        _id: '$receiveId',
        arr: { $last: '$$ROOT' },
        // arr: { $push: '$$ROOT' },
        see: { $sum: '$see' }
      }
    }
    , {
      $lookup: {
        from: 'user',
        localField: '_id',
        foreignField: '_id',
        as: 'user_info'
      }
    },
    { $project: { user_info: { _id: 0, age: 0, sex: 0, password: 0 } } }
  ])
  ctx.body = {
    code: 0,
    data: {
      list: s
    }
  }
}
const msgList = async (ctx) => {
  const req = ctx.request.body
  if (req.id && req.youId) {
    const l = await Message_col.aggregate([
      { $match: { sendId: [mongoose.Types.ObjectId(req.id),mongoose.Types.ObjectId(req.youId)], receiveId: mongoose.Types.ObjectId(req.youId) } },
    ])
    ctx.body = {
      l
    }
  }
}
module.exports = {
  findId, msgList
}