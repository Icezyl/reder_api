const User_col = require('../models/user')
const Friend_col = require('../models/friend')
const Code = require('../models/code')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { secret } = require('../../config/key')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
class UserCtl {
  async find(ctx) {
    let user = ''
    let success = ''
    if (ctx.query._id) {
      user = await User_col.findOne({ _id: ctx.query._id })
      if (!user) { ctx.throw(404, '用户不存在') }
    } else if (ctx.query.myId && ctx.query.youId) {
      user = await User_col.findOne({ _id: ctx.query.youId })
      success = await Friend_col.findOne({ myId: ctx.query.myId, youId: ctx.query.youId }, { success: 1 })
    } else {
      user = await User_col.find()
    }
    ctx.body = { user, success }
  }
  async update(ctx) {
    const user = await User_col.updateOne({ _id: ctx.params.id }, ctx.request.body)
    ctx.body = {
      user
    }
  }
  async login(ctx) {
    const req = ctx.request.body
    ctx.verifyParams({
      username: { type: 'string', require: true },
      password: { type: 'string', require: true }
    })
    const newpsw = crypto.createHash('md5').update(req.password).digest('hex')
    const user = await User_col.findOne({ "username": req.username, "password": newpsw })
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

  async register(ctx) {
    const { username, password, email, code } = ctx.request.body
    ctx.verifyParams({
      username: { type: 'string', require: true },
      password: { type: 'string', require: true },
      email: { type: 'email', require: true }
    })
    const count = await User_col.count({ username })
    if (count) {
      ctx.status = 409
      ctx.body = { msg: '用户已存在' }
      return
    }
    const em = await User_col.count({ email })
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
  async retrieve(ctx) {
    const { email, code, password } = ctx.request.body
    const date = new Date().getTime()
    const userCode = await Code.find({ email: email, code: code.toUpperCase() })
    if (userCode.date > date) {
      if (userCode) {
        const user = await User_col.findOne({ email })
        const d = await User_col.updateOne({ _id: user._id }, { password })
        ctx.body = {
          d
        }
      }
    } else {
      ctx.body = {
        msg: '验证码已过期'
      }
    }

    ctx.body = {
      msg: '验证码错误'
    }
  }
  async deleteId(ctx) {
    const id = ctx.params.id
    const user = await User_col.deleteOne({ _id: ObjectId(id) })
    ctx.body = {
      user
    }
  }
}
module.exports = new UserCtl()