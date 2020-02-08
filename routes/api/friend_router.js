const Router = require('koa-router')
const router = new Router()
const friend_controller = require('../../app/controllers/friend_controller')
const passport = require('koa-passport')

router.post('/friend/add', friend_controller.add)
router.post('/friend/find', friend_controller.find)
router.post('/friend/agree', friend_controller.agree)
router.post('/friend/news', friend_controller.news)
router.get('/friend/search', friend_controller.search)
router.post('/friend/personal', friend_controller.personal)
module.exports = router