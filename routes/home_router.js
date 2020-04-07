const Router = require('koa-router')
const router = new Router()
const { upload, index, yun, email, generateRtcToken } = require('../app/controllers/home')
const jwt = require('koa-jwt')
const { secret } = require('../config/key')
const auth = jwt({ secret })


router.post('/upload', upload)
router.post('/email', email)
router.post('/yun', yun)
router.get('/generateRtcToken', generateRtcToken)
router.get('/', index)
module.exports = router