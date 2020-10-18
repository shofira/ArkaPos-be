require('dotenv').config()

module.exports = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASS: process.env.PASSWORD,
  DB: process.env.DATABASE,
  JWTKEY: process.env.JWTKEY,
  REFRESHTOKEN: process.env.JWTREFRESH,
  MAIL: process.env.EMAIL,
  PS: process.env.PASS,
  URL: process.env.URL,
  urlForgot: process.env.URLFORGOT
}