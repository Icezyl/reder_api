module.exports = {
  port: 5000,
  db: 'mongodb://root:123456@localhost:27017/red?authSource=admin',
  // db: 'mongodb://root:123456@mongo:27017/red?authSource=admin',
  accessKey: '8wGIBjaDmYvZPYc567-uUF2PgMtX_fv_k9Fkbu43',
  secretKey: 'K478Xo9fz7yEB90C2jATy6cDz7TXz9ioHkpD8lTz',
  secret: 'secret',
  appID: '34dac50c186e449eb7e1224608bc3fba',
  appCertificate: 'de560b5858fe47c8aa9ce72203c4e7ba',
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
    return () => {
      return Math.random().toString(16).slice(2, 8).toUpperCase()
    }
  },
  get expire() {
    return () => {
      return new Date().getTime() + 3 * 60 * 1000
    }
  }
}