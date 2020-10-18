const jwt = require('jsonwebtoken')
const { tokenErr } = require('./response')
const { JWTKEY } = require('./env')

const auth = {
  authenticate: (req, res, next) => {
    const token = req.headers.token
    if (token === undefined || token === '') {
      tokenErr(res, [], 'Token is required!')
    } else {
      next()
    }
  },
  authorize: (req, res, next) => {
    const token = req.headers.token
    jwt.verify(token, JWTKEY, (err) => {
      if (err && err.name === 'TokenExpiredError') {
        tokenErr(res, [], 'Token Expired! please login again')
      } else if (err && err.name === 'JsonWebTokenError') {
        tokenErr(res, [], 'Authorization Failed!')
      } else {
        next()
      }
    })
  }
}

module.exports = auth