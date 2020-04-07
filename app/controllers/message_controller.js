const Message_col = require('../models/message')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


class MessageClt {
  async findId(ctx) {
    const list = await Message_col.aggregate([
      {
        $match: {
          $or: [
            { from: ObjectId(ctx.params.id) },
            { to: ObjectId(ctx.params.id) }
          ]
        }
      },
      {
        $group: {
          _id: '$messageId',
          arr: { $last: '$$ROOT' }
        }
      }
    ])
    ctx.body = { list }
  }
  async countSee(ctx) {
    const { id, to } = ctx.query
    const count = await Message_col.countDocuments({ messageId: id, to: to, see: 1 })
    ctx.body = { count }

  }
  async allSee(ctx) {
    const count = await Message_col.countDocuments({ to: ctx.params.id, see: 1 })
    ctx.body = { count }
  }
  async clearSee(ctx) {
    const { to, from } = ctx.request.body
    await Message_col.updateMany({ to: ObjectId(to), from: ObjectId(from) }, { see: 0 })
    ctx.status = 204
  }
  async msgList(ctx) {
    let messageId = [ctx.query.id, ctx.query.to].sort().join('_')
    const count = await Message_col.countDocuments({
      messageId
    })
    let ss = count - ctx.query.page * 20
    let limit = 20
    if (ss < 0) {
      limit = limit + ss
      ss = 0
    }
    const list = await Message_col.find({
      messageId
    }).limit(limit).skip(ss)
    ctx.body = { list }
  }
}

module.exports = new MessageClt()