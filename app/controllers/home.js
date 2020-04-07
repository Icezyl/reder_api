const path = require('path')
let qiniu = require('qiniu'); // 需要加载qiniu模块的
const { send } = require('../../config/mail')
const { code, expire, accessKey, secretKey, appCertificate, appID } = require('../../config/key')
const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
const Code = require('../models/code')
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
    await send(email, codm).then(() => {
      Code.create({
        code: codm,
        date: time,
        email: email
      })
      ctx.body = {
        msg: '发送成功'
      }
    }).catch(() => {
      ctx.status = 404
      ctx.body = {
        msg: '发送失败'
      }
    })
  }
  async generateRtcToken(ctx) {
    const { channelName, uid } = ctx.query
    var expirationTimeInSeconds = 3600
    var role = RtcRole.PUBLISHER
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var key = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, 0, role, privilegeExpiredTs)
    ctx.body = { key }
  }
}
module.exports = new HomeCtl()