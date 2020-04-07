const Router = require('koa-router')
const router = new Router({ prefix: '/users' }) // 路由前缀 
const { find, register, login, update, deleteId, retrieve, listFollowing, followingId, listFollowers, unFollow, follow, cross, crossList, search } = require('../app/controllers/user_controller')
const { checkOwner } = require('../app/controllers/home')
const jwt = require('koa-jwt')
const { secret } = require('../config/key')
const auth = jwt({ secret })


router.delete('/:id', deleteId)
router.post('/register', register) //注册 
router.post('/login', login) // 登录 
router.patch('/:id', auth, checkOwner, update) // 修改用户信息
router.put('/retrieve', retrieve) // 找回密码
router.get('/:id/following', listFollowing) // 查询关注列表
router.put('/following/:id', auth, follow) // 关注某人
router.delete('/following/:id', auth, unFollow) // 取消关注
router.get('/:id/followers', listFollowers) // 粉丝列表
router.get('/following', followingId)
router.get('/search', search)
router.get('/:id/crossList', crossList) // 互关列表
router.get('/cross', cross) // 互关
router.get('/', find) // 按条件查询
module.exports = router