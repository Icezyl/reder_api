const User_col = require('../models/user')
const Code = require('../models/code')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { secret } = require('../../config/key')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
class UserCtl {
  // 查询用户信息
  async find(ctx) {
    let user = ''
    let success = ''
    if (ctx.query._id) {
      user = await User_col.findOne({ _id: ctx.query._id })
      if (!user) { ctx.throw(404, '用户不存在') }
    } else {
      user = await User_col.find()
    }
    ctx.body = { user, success }
  }
  // 修改用户信息
  async update(ctx) {
    const user = await User_col.updateOne({ _id: ctx.params.id }, ctx.request.body)
    ctx.body = {
      user
    }
  }
  // 查询关注列表
  async listFollowing(ctx) {
    const user = await User_col.findById(ctx.params.id).select('+following').populate('following')
    if (!user) {
      ctx.status = 404
    }
    ctx.body = user.following
  }
  // 关注
  async follow(ctx) {
    const me = await User_col.findById(ctx.state.user._id).select('+following')
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  // 取消关注
  async unFollow(ctx) {
    const me = await User_col.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  // 查询用户粉丝
  async listFollowers(ctx) {
    const user = await User_col.find({ following: ctx.params.id })
    ctx.body = user
  }
  async followingId(ctx) {
    const count = await User_col.countDocuments({ _id: ctx.query.id, following: ctx.query.follow })
    ctx.body = { count }
  }
  // 登录
  async login(ctx) {
    const req = ctx.request.body
    ctx.verifyParams({
      email: { type: 'string', require: true },
      password: { type: 'string', require: true }
    })
    const newpsw = crypto.createHash('md5').update(req.password).digest('hex')
    const user = await User_col.findOne({ "email": req.email, "password": newpsw })
    if (!user) {
      ctx.status = 409
      ctx.body = { msg: '邮箱或密码不正确' }
      return
    }
    const { _id, email } = user
    const token = jwt.sign({ _id, email }, secret, { expiresIn: '1d' })
    ctx.body = {
      msg: '登录成功',
      token,
      user
    }
  }
  // 注册
  async register(ctx) {
    const { username, password, email, code } = ctx.request.body
    ctx.verifyParams({
      username: { type: 'string', require: true },
      password: { type: 'string', require: true },
      email: { type: 'email', require: true }
    })
    const count = await User_col.countDocuments({ username })
    if (count) {
      ctx.status = 409
      ctx.body = { msg: '用户已存在' }
      return
    }
    const em = await User_col.countDocuments({ email })
    if (em) {
      ctx.status = 409
      ctx.body = { msg: '邮箱已注册' }
      return
    }
    const newpsw = crypto.createHash('md5').update(password).digest('hex')
    const userCode = await Code.findOne({ code: code.toUpperCase() })
    if (userCode) {
      if (userCode.date > new Date().getTime()) {
        if (userCode.code === code.toUpperCase() && userCode.email === email) {
          await User_col.create({ "username": username, "password": newpsw, "email": email })
          ctx.body = {
            "msg": "注册成功",
            "code": 0
          }
        } else {
          ctx.status = 409
          ctx.body = { msg: '验证码错误' }
          return
        }
      } else {
        ctx.status = 409
        ctx.body = { msg: '验证码已过期' }
        return
      }
    } else {
      ctx.status = 409
      ctx.body = { msg: '验证码错误' }
      return
    }
  }
  // 找回密码
  async retrieve(ctx) {
    const { email, code, password } = ctx.request.body
    const date = new Date().getTime()
    const userCode = await Code.findOne({ email: email, code: code.toUpperCase() })
    const newpsw = crypto.createHash('md5').update(password).digest('hex')
    if (!userCode) {
      ctx.status = 404
      ctx.body = {
        msg: '验证码错误'
      }
    }
    if (userCode.date > date) {
      if (userCode) {
        const user = await User_col.findOne({ email })
        const d = await User_col.updateOne({ _id: user._id }, { password: newpsw })
        ctx.status = 200
      }
    } else {
      ctx.body = {
        msg: '验证码已过期'
      }
    }
  }
  // 删除用户
  async deleteId(ctx) {
    const id = ctx.params.id
    const user = await User_col.deleteOne({ _id: ObjectId(id) })
    ctx.body = {
      user
    }
  }
  async search(ctx) {
    const { name, id } = ctx.query
    let list = await User_col.find({ username: { $regex: name, $options: '$i' }, following: id })
    const { following } = await User_col.findOne({ _id: id }).select('+following')
    if (following) {
      const userList = await User_col.find({ _id: { $in: following }, following: { $ne: id }, username: { $regex: name, $options: '$i' } })
      list = [...list, ...userList]
    }
    ctx.body = list
  }
  async crossList(ctx) {
    const { following } = await User_col.findOne({ _id: ctx.params.id }).select('+following')
    let list = []
    if (following) {
      list = await User_col.find({ _id: { $in: following }, following: ctx.params.id })
    }
    ctx.body = list
  }
  async cross(ctx) {
    const { to, from } = ctx.query
    const userTo = await User_col.countDocuments({ _id: to, following: from })
    const userFrom = await User_col.countDocuments({ _id: from, following: to })
    const count = userTo === userFrom
    ctx.body = { count }
  }
}
module.exports = new UserCtl()