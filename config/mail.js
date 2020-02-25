const nodemailer = require('nodemailer');
const { smtp } = require('./key')
//创建发送邮件的请求对象
let transporter = nodemailer.createTransport({
  host: smtp.host,    //发送端邮箱类型（QQ邮箱）
  port: 465,      //端口号
  secure: true,
  auth: {
    user: smtp.user, // 发送方的邮箱地址（自己的）
    pass: smtp.pass // mtp 验证码
  }
});

function send(mail, code) {
  let mailObj = {
    from: `"邮件名称" <${smtp.user}>`,   // 邮件名称和发件人邮箱地址
    to: mail,   //收件人邮箱地址（这里的mail是封装后方法的参数，代表收件人的邮箱地址）
    subject: '邮件标题',   //邮件标题
    text: '您的验证码是：' + code , // 邮件内容，这里的code是这个方法的参数，代表要发送的验证码信息，这里的内容可以自定义
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailObj, (err, data) => {
      if (err) {
        reject()    //出错
      } else {
        resolve()    //成功
      }
    })
  })
}
module.exports = { send }