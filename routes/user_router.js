const Router = require('koa-router')
const router = new Router({ prefix: '/users' }) // 路由前缀 
const { find, register, login, update, deleteId, retrieve } = require('../app/controllers/user_controller')
const { checkOwner } = require('../app/controllers/home')
const jwt = require('koa-jwt')
const { secret } = require('../config/key')
const auth = jwt({ secret })

router.get('/', find) // 按条件查询
router.delete('/:id', deleteId)
router.post('/register', register) //注册 username password
router.post('/login', login) // 登录 username password
router.patch('/:id', auth, checkOwner, update) // 修改用户信息
router.put('/retrieve', retrieve) // 找回密码
module.exports = router