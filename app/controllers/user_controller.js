const User_col = require('../models/user')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const keys = require('../../config/key')
// 查询个人信息
const find = async (ctx, next) => {
  const [user] = await User_col.find({ _id: ctx.query.id })
  ctx.body = {
    "code": 0,
    "data": { "user": user }
  }
}

// 登录
const login = async (ctx, next) => {
  const req = ctx.request.body
  const count = await User_col.count({ "username": req.username })
  if (count === 0) {
    ctx.body = {
      code: 1,
      msg: '用户名不存在'
    }
    return;
  }
  if (!req.username) {
    ctx.body = {
      code: 1,
      msg: '用户名不能为空'
    }
    return;
  }
  if (!req.password) {
    ctx.body = {
      code: 1,
      msg: '密码不能为空'
    }
    return;
  }
  const newpsw = crypto.createHash('md5').update(req.password).digest('hex')
  const [result] = await User_col.find({ "username": req.username, "password": newpsw })
  if (result) {
    const payload = { id: result._id, name: result.username, avatar: result.avatar }
    const token = jwt.sign(payload, keys.secretOrToken, { expiresIn: '1h' })
    ctx.body = {
      code: 0,
      token: token,
      msg: '登录成功',
      data: result
    }
    return;
  }
  ctx.body = {
    code: 1,
    msg: '用户名或密码错误'
  }
}

// 注册
const register = async (ctx, next) => {
  const req = ctx.request.body
  const count = await User_col.count({ "username": req.username })
  if (count > 0) {
    ctx.body = {
      code: 1,
      msg: '用户名已存在'
    }
    return;
  }

  if (req.username !== '' && req.password !== '') {
    const newpsw = crypto.createHash('md5').update(req.password).digest('hex')
    const user = new User_col({ "username": req.username, "password": newpsw })
    user.save()
    ctx.body = {
      "code": 0,
      "msg": "注册成功",
      "data": {

      }
    }
  } else {
    ctx.body = {
      "code": 1,
      "msg": "注册失败"
    }
  }
}
module.exports = {
  find,
  register,
  login
}