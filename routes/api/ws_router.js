const User = require('../../app/models/user')
const Message = require('../../app/models/message')
module.exports = io => {
  io.on('connection', socket => {
    socket.on('open', async (data) => {
      console.log(data)
      await User.update({ _id: data.id }, { state: 1 })
    })
    socket.on('send', async (data) => {
      const count = await Message.create({
        sendId: data.sendId,
        text: data.text,
        receiveId: data.receiveId
      });
      console.log(data)
      socket.emit('send', data)
    })
    socket.on('disconnection', (data) => {
      console.log(data,1)
    })
  })
}