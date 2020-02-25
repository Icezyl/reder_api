const Router = require('koa-router')
const router = new Router({ prefix: '/friend' })
const { add, find, agree, news, search, personal } = require('../app/controllers/friend_controller')
const jwt = require('koa-jwt')
const { secret } = require('../config/key')
const auth = jwt({ secret })

router.get('/', find) // 查询这用户的好友
router.get('/news', news)  // 查询申请列表
router.get('/search/:name', search) // 搜索用户
router.get('/personal', personal) // 查询用户信息
router.post('/add', auth, add) // 添加用户
router.post('/agree', auth, agree) // 同意用户

module.exports = router