const Router = require('koa-router')
const router = new Router({ prefix: '/message' })
const { findId, msgList, findee } = require('../app/controllers/message_controller')
const jwt = require('koa-jwt')
const { secret } = require('../config/key')
const auth = jwt({ secret })

router.get('/:id', findId) // id查询最新消息
router.get('/all/:id', auth, msgList) // 查询所有聊天消息
router.get('/ee/:id', findee)

module.exports = router