const path = require('path')
let qiniu = require('qiniu'); // 需要加载qiniu模块的
const { send } = require('../../config/mail')
const { code, expire } = require('../../config/key')
const Code = require('../models/code')
const accessKey = '8wGIBjaDmYvZPYc567-uUF2PgMtX_fv_k9Fkbu43';
const secretKey = 'K478Xo9fz7yEB90C2jATy6cDz7TXz9ioHkpD8lTz';
const bucket = 'reder-avatar';

class HomeCtl {
  index(ctx) {
    ctx.body = {
      title: 'reder聊天室api'
    }
  }
  upload(ctx) {
    const file = ctx.request.files.file
    const basename = path.basename(file.path)
    ctx.body = {
      url: `${ctx.origin}/${basename}`
    }
  }
  yun(ctx) {
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let options = {
      scope: bucket,
      expires: 3600 * 24
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    if (uploadToken) {
      ctx.body = { 'token': uploadToken }
    } else {
      ctx.body = Code('re_error')
    }
  }
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }
  async email(ctx) {
    const { email } = ctx.request.body
    const codm = code()
    const time = expire()
    await send(email, codm).then(async () => {
      await Code.create({
        code: codm,
        date: time,
        email: email
      })
      ctx.body = {
        msg: '发送成功'
      }
    }).catch(() => {
      ctx.body = {
        msg: '发送失败'
      }
    })
  }
}
module.exports = new HomeCtl()