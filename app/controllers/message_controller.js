const Message_col = require('../models/message')
const Friend_col = require('../models/friend')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


class MessageClt {
  async findId(ctx) {
    const list = await Message_col.aggregate([
      {
        $match: { receiveId: ObjectId(ctx.params.id) }
      },
      {
        $group: {
          _id: '$sendId',
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
      { $project: { user_info: { age: 0, sex: 0, password: 0 } } }
    ])
    ctx.body = { list }
  }
  async findee(ctx) {
    const friend = await Friend_col.find({
      myId: ctx.params.id, success: 1
    }, { youId: 1, _id: 0 })

    ctx.body = {
      friend
    }
  }
  async msgList(ctx) {
    await Message_col.updateMany({
      $or: [
        { $and: [{ sendId: ObjectId(ctx.params.id) }, { receiveId: ObjectId(ctx.state.user._id) }] },
        { $and: [{ sendId: ObjectId(ctx.state.user._id) }, { receiveId: ObjectId(ctx.params.id) }] }
      ]
    }, { see: 0 })
    const list = await Message_col.find({
      $or: [
        { $and: [{ sendId: ObjectId(ctx.params.id) }, { receiveId: ObjectId(ctx.state.user._id) }] },
        { $and: [{ sendId: ObjectId(ctx.state.user._id) }, { receiveId: ObjectId(ctx.params.id) }] }
      ]
    })
    ctx.body = { list }
  }
}

module.exports = new MessageClt()