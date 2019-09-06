const redbird = require('redbird')

const proxy = redbird({
  ssl: {
    port: 3443,
    key: '../ssl/nginx.key',
    cert: '../ssl/nginx.crt'
  }
})

proxy.register('192.168.0.8:3001', 'http://192.168.0.8:3000')
