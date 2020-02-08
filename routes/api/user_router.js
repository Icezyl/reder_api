const Router = require('koa-router')
const router = new Router({ prefix: '/users' }) // 路由前缀 
const user_controller = require('../../app/controllers/user_controller')
const passport = require('koa-passport')

router.get('/') // 查询全部
router.get('/:id', user_controller.find) // 查看特定用户
router.post('/register', user_controller.register) //注册 userName password
router.post('/login', user_controller.login) // 登录 userName password

module.exports = router