const Dynamic_col = require('../models/dynamic')
const User_col = require('../models/user')
const Give_col = require('../models/give')
const Comment_col = require('../models/comment')
class DynamicCtl {
  async send(ctx) {
    const { userId, imgs, content } = ctx.request.body
    const ok = await Dynamic_col.create(ctx.request.body)
    ctx.body = { ok }
  }
  async remove(ctx) {
    const ok = await Dynamic_col.remove({ _id: ctx.params.id })
    ctx.body = { ok }
  }
  async findUserId(ctx) {
    const list = await Dynamic_col.find({ userId: ctx.query.id }).populate('userId').sort({ 'created': -1 }).limit(5).skip(ctx.query.page * 5)
    ctx.body = { list }
  }
  async findId(ctx) {
    const dynamic = await Dynamic_col.findOne({ _id: ctx.params.id }).populate('userId')
    ctx.body = {
      dynamic
    }
  }
  async index(ctx) {
    const list = await Dynamic_col.find().populate('userId').sort({ 'created': -1 }).limit(10).skip(ctx.query.page * 10)
    ctx.body = { list }
  }
  async follow(ctx) {
    const user = await User_col.findOne({ _id: ctx.query.id }).select('following')
    let list = ''
    if (user.following) {
      list = await Dynamic_col.find({
        userId: { $in: user.following }
      }).populate('userId').sort({ 'created': -1 }).limit(5).skip(ctx.query.page * 5)
    }
    // .populate({ path: '_id', model: 'Give' })
    ctx.body = {
      list
    }
  }
  async give(ctx) {
    const un = await Give_col.countDocuments({ id: ctx.request.body.id, userId: ctx.state.user._id, giveType: 0, give: 1 })
    if (un) {
      await Give_col.remove({ id: ctx.request.body.id, userId: ctx.state.user._id })
    } else {
      await Give_col.create({ id: ctx.request.body.id, userId: ctx.state.user._id })
    }
    ctx.status = 204
  }
  async findGive(ctx) {
    const count = await Give_col.countDocuments({ id: ctx.query.id, giveType: 0, give: 1 })
    const user = await Give_col.countDocuments({ id: ctx.query.id, giveType: 0, give: 1, userId: ctx.query.userId })
    ctx.body = { count, user }
  }
  async comment(ctx) {
    const ss = await Comment_col.create(ctx.request.body)
    ctx.body = { ss }
  }
  async unComment(ctx) {
    const ok = await Comment_col.remove({ _id: ctx.params.id })
    ctx.body = { ok }
  }
  async countComment(ctx) {
    const count = await Comment_col.countDocuments({ id: ctx.query.id })
    ctx.body = { count }
  }
  async allComment(ctx) {
    const list = await Comment_col.find({ id: ctx.query.id }).populate('userId').limit(10).skip(ctx.query.page * 10)
    console.log(ctx.query)
    ctx.body = { list }
  }
}
module.exports = new DynamicCtl()