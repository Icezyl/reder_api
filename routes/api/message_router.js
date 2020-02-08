const Router = require('koa-router')
const router = new Router()
const message_controller = require('../../app/controllers/message_controller')
const passport = require('koa-passport')

router.post('/message/findId', message_controller.findId)
router.post('/message/msgList', message_controller.msgList)

module.exports = router