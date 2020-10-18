const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const fs = require('fs')
const upload = require('../helpers/upload')
const userModel = require('../models/users')
const { success, failed, tokenResult } = require('../helpers/response')
const { JWTKEY, MAIL, PS, URL, REFRESHTOKEN, urlForgot } = require('../helpers/env')

const user = {
  register: async (req, res) => {
    try {
      const body = req.body
      const salt = await bcrypt.genSalt(10)
      const hashPass = await bcrypt.hash(body.password, salt)

      const data = {
        name: body.name,
        email: body.email,
        password: hashPass,
        image: 'default.jpg',
        active: 0
      }
      userModel.register(data).then(async (result) => {

        const activateKey = jwt.sign({
          email: data.email
        }, JWTKEY)

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: MAIL,
            pass: PS
          }
        })
        let info = await transporter.sendMail({
          from: '"ArkaPos" <ArkaChat@gmail.com>',
          to: data.email,
          subject: 'Register Account',
          html:
            `Hello, ${data.name}! <br />
          <p>Please Activate your email to get access in <b>ArkaPos</b> ^_^ <br />
          <a href="${URL}/users/activate/${activateKey}">Klik here to activate</a></p>`
        })
        success(res, result, 'Send email success')

      }).catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  activate: (req, res) => {
    const token = req.params.token
    if (token) {
      jwt.verify(token, JWTKEY, (err, response) => {
        if (err) {
          failed(res, [], 'Failed activation!')
        } else {
          const email = response.email
          userModel.activation(email)
            .then((result) => {
              success(res, result, 'Email has been activated')
            }).catch((err) => {
              failed(res, [], err.message)
            })
        }
      })
    }
  },
  login: (req, res) => {
    try {
      const body = req.body
      userModel.login(body)
        .then(async (result) => {
          const results = result[0]
          const password = results.password
          const userRefreshToken = results.refreshToken
          const isMatch = await bcrypt.compare(body.password, password)

          if (isMatch) {
            if (results.active === 1) {
              jwt.sign({
                email: results.email
              }, JWTKEY, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                  failed(res, [], err.message)
                } else {
                  if (userRefreshToken === null) {
                    const id = results.id
                    const refreshToken = jwt.sign({ id }, REFRESHTOKEN)
                    userModel.updateRefreshToken(refreshToken, id).then(() => {
                      const data = {
                        id,
                        token,
                        refreshToken
                      }
                      tokenResult(res, data, 'Login success')
                    }).catch((err) => {
                      failed(res, [], err.message)
                    })
                  } else {
                    const data = {
                      id: results.id,
                      token,
                      refreshToken
                    }
                    tokenResult(res, data, 'Login success')
                  }
                }
              })
            } else {
              failed(res, [], 'Need Activation')
            }
          } else {
            failed(res, [], 'Incorrect password! Please try again')
          }
        }).catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  renewToken: (req, res) => {
    const refreshToken = req.body.refreshToken
    userModel.checkRefreshToken(refreshToken)
      .then((result) => {
        if (result.length >= 1) {
          const user = result[0]
          const newToken = jwt.sign({ email: user.email }, JWTKEY, { expiresIn: 3600 })
          const data = {
            token: newToken,
            refreshToken
          }
          tokenResult(res, data, 'Refresh Token Success')
        } else {
          failed(res, [], 'Refresh Token Not Found')
        }
      })
      .catch((err) => failed(res, [], err.message))
  },
  forgotPassword: async (req, res) => {
    try {
      const email = req.body.email

      userModel.checkEmail(email).then(() => {
        const userkey = jwt.sign({ email }, JWTKEY)

        userModel.updateKey(userkey, email).then(async (result) => {
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: MAIL,
              pass: PS
            }
          })

          let info = await transporter.sendMail({
            from: '"ArkaPos" <ArkaChat@gmail.com>',
            to: email,
            subject: 'Forgot Password',
            html:
              `Hello! <br />
            <p>We have sent you this email in response to your request to reset your password on <b>ArkaPos</b> ^_^ <br />
            <a href="${urlForgot}/forgot?${userkey}">Klik here to reset your password</a></p>`
          })
          success(res, result, 'Send email success')

        }).catch((err) => failed(res, [], err.message))
      }).catch((err) => failed(res, [], err.message))

    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  renewPassword: async (req, res) => {
    try {
      const body = req.body
      const salt = await bcrypt.genSalt(10)
      const hashPass = await bcrypt.hash(body.password, salt)
      const key = req.params.userKey

      userModel.renewPassword(hashPass, key)
        .then((result) => {
          success(res, result, 'Update password success')
          jwt.verify(key, JWTKEY, (err, response) => {
            if (err) {
              failed(res, [], 'Failed reset userkey!')
            } else {
              const email = response.email
              userModel.resetKey(email)
                .then((results) => {
                  console.log(results)
                  success(res, results, 'Update password success')
                }).catch((err) => {
                  failed(res, [], err.message)
                })
            }
          })
        }).catch((err) => {
          failed(res, [], err.message)
        })

    } catch (error) {
      failed(res, [], error.message)
    }
  },
  logout: (req, res) => {
    try {
      const id = req.params.id
      userModel.logout(id)
        .then((result) => {
          success(res, result, 'Logout Success')
        }).catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  detail: (req, res) => {
    try {
      const id = req.params.id
      userModel.getDetail(id).then((result) => {
        if (result.length > 0) {
          success(res, result, 'Get detail success')
        } else {
          failed(res, [], 'Data detail not found')
        }
      }).catch((err) => {
        failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  update: (req, res) => {
    try {
      upload.single('image')(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            failed(res, [], 'Max size upload is 2mb!')
          } else {
            failed(res, [], err)
          }
        } else {
          const id = req.params.id
          const body = req.body
          userModel.getDetail(id).then((result) => {
            const oldImage = result[0].image
            body.image = !req.file ? oldImage : req.file.filename
            if (body.image !== oldImage) {
              if (oldImage !== 'default.jpg') {
                fs.unlink(`src/images/${oldImage}`, (err) => {
                  if (err) {
                    failed(res, [], err.message)
                  } else {
                    userModel.update(body, id).then((result) => {
                      success(res, result, 'Update success')
                    }).catch((err) => {
                      failed(res, [], err.message)
                    })
                  }
                })
              } else {
                userModel.update(body, id).then((result) => {
                  success(res, result, 'Update success')
                }).catch((err) => {
                  failed(res, [], err.message)
                })
              }
            } else {
              userModel.update(body, id).then((result) => {
                success(res, result, 'Update success')
              }).catch((err) => {
                failed(res, [], err.message)
              })
            }
          })
        }
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  }
}

module.exports = user
