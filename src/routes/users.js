const express = require('express')
const { register, activate, login, renewToken, forgotPassword, renewPassword, logout, detail, insert, update, destroy } = require('../controllers/users')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router()

router
  .post('/register', register)
  .get('/activate/:token', activate)
  .post('/login', login)
  .post("/refresh", renewToken)
  .post('/forgot', forgotPassword)
  .post('/resetPass/:userKey', renewPassword)
  .post('/logout/:id', authenticate, authorize, logout)
  .get('/getDetail/:id', detail)
  .post('/insert', insert)
  .patch('/update/:id', update)
  .delete('/delete/:id', destroy)

module.exports = router