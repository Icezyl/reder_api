module.exports = {
  port: 5000,
  db: 'mongodb://root:123456@localhost:27017/red?authSource=admin',
  secret: 'secret',
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return '2821749451@qq.com'
    },
    get pass() {
      return 'wcumuanllbybdebb'
    }
  },
  get code() {
    return ()=> {
      return Math.random().toString(16).slice(2,8).toUpperCase()
    }
  },
  get expire() {
    return ()=> {
      return new Date().getTime()+60*1000
    }
  }
}