const Koa = require('koa')
const config = require('./config/key')
const mongoose = require('mongoose')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) console.log(err)
  console.log('connecting database successfully')
})

// 欢迎加入前端全栈开发交流圈一起吹水聊天学习交流：619586920

require('./routes/api/ws_router')(io)


app.use(cors())
app.use(bodyParser())
app.use(passport.initialize())
app.use(passport.session())

const user_router = require('./routes/api/user_router')
const friend_router = require('./routes/api/friend_router')
const message_router = require('./routes/api/message_router')
app.use(message_router.routes()).use(message_router.allowedMethods())
app.use(friend_router.routes()).use(friend_router.allowedMethods())
app.use(user_router.routes()).use(user_router.allowedMethods())

// 回调到passport.js
require('./config/passport')(passport)


server.listen(config.port, err => {
  console.log('runing at http://localhost:' + config.port)
})
