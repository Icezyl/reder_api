const User = require('../app/models/user')
const Message = require('../app/models/message')
const IO = require('socket.io')
function creatSocket(app) {
  const io = IO(app)
  let hashName = []
  let nan = []
  let nv = []
  io.on('connection', socket => {
    socket.on('/', async data => {
      await User.update({ _id: data.id }, { state: 1 })
      hashName[data.id] = socket.id
    })
    socket.on('send', async (data) => {
      const { from, to, content } = data
      let messageId = [from, to].sort().join('_')
      await Message.create({
        ...data, messageId
      });
      io.sockets.to(hashName[data.to]).emit('chat', data)
    })
    socket.on('add', async data => {
      const count = await Message.countDocuments({ messageId: data.id })
      if (!count) {
        await Message.create({ messageId: data.id, content: '我不再隐藏我的身份了，还希望你可以和我保持联系呀~' })
        io.sockets.to(hashName[data.to]).emit('chat', { messageId: data.id, content: '我不再隐藏我的身份了，还希望你可以和我保持联系呀~' })
      }
    })
    socket.on('clearSee', async data => {
      io.sockets.to(hashName[data.to]).emit('clearSee', data)
    })
    socket.on('callAudio', async data => {
      socket.to(hashName[data.id]).emit('callAudio', data)
    })
    socket.on('refuseAudio', async data => {
      socket.to(hashName[data.from]).emit('refuseAudio')
    })
    socket.on('callVideo', async data => {
      socket.to(hashName[data.id]).emit('callVideo', data)
    })
    socket.on('refuseVideo', async data => {
      socket.to(hashName[data.from]).emit('refuseVideo')
    })

    socket.on('voice', data => {
      if (data.sex) {
        if (nv.length) {
          let index = Math.floor((Math.random() * nv.length))
          let user = nv[index]
          nv.splice(index, 1)
          let channel = [user.id, data.id].sort().join('_')
          socket.emit('successVoice', { channel, id: user.id })
          socket.to(hashName[user.id]).emit('successVoice', { channel, id: data.id })
        } else {
          let success = nan.some(item => {
            item.id == data.id
          })
          if (!success) {
            nan.push(data)
          }
        }
      } else {
        if (nan.length) {
          let index = Math.floor((Math.random() * nan.length))
          let user = nan[index]
          nan.splice(index, 1)
          let channel = [user.id, data.id].sort().join('_')
          socket.emit('successVoice', { channel, id: user.id })
          socket.to(hashName[user.id]).emit('successVoice', { channel, id: data.id })
        } else {
          let success = nv.some(item => {
            item.id == data.id
          })
          if (!success) {
            nv.push(data)
          }
        }
      }
    })
    socket.on('removeVoice', data => {
      if (data.sex) {
        nan.some((item, index) => {
          if (item.id === data.id) {
            nan.splice(index, 1)
          }
        })
      } else {
        nv.some((item, index) => {
          if (item.id === data.id) {
            nv.splice(index, 1)
          }
        })
      }
    })
    socket.on('disconnection', async (data) => {
      await User.update({ _id: data.id }, { state: 0 })
    })
  })
}
module.exports = creatSocket