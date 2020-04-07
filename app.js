const Koa = require('koa')
const config = require('./config/key')
const mongoose = require('mongoose')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const static = require('koa-static')
const passport = require('koa-passport')
const parameter = require('koa-parameter')
const path = require('path')
const app = new Koa()
const server = require('http').createServer(app.callback())
const createSocket = require('./socket')
createSocket(server) // 连接socket

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) console.log(err)
  console.log('connecting database successfully')
}) // 连接mongodb

app.use(static(path.join(__dirname, 'public/uploads')))
app.use(cors())
app.use(koaBody({
  multipart: true, // 启动文件上传
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'), // 设置上传路径
    keepExtensions: true, // 保存文件扩展名
  }
}))
app.use(parameter(app))

// 路由
require('./routes')(app)


server.listen(config.port, err => {
  console.log('runing at http://localhost:' + config.port)
})
