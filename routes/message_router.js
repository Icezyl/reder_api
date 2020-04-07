const Router = require('koa-router')
const router = new Router({ prefix: '/message' })
const { msgList, clearSee, findId, countSee, allSee } = require('../app/controllers/message_controller')
const jwt = require('koa-jwt')
const { secret } = require('../config/key')
const auth = jwt({ secret })


router.get('/all', msgList) // 查询所有聊天消息
router.put('/see', clearSee)
router.get('/see', countSee)
router.get('/allSee/:id', allSee)
router.get('/:id', findId) // id查询最新消息

module.exports = router