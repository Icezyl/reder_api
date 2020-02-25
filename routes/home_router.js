const Router = require('koa-router')
const router = new Router()
const { upload, index, yun, email } = require('../app/controllers/home')
const jwt = require('koa-jwt')
const { secret } = require('../config/key')
const auth = jwt({ secret })

router.get('/', index)
router.post('/upload', upload),
router.post('/email', email),
router.post('/yun', yun)

module.exports = router