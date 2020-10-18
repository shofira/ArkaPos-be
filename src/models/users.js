const db = require('../config/db')

const user = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO users SET ?`, data, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  activation: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET active = 1 WHERE email = '${email}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  login: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = '${data.email}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  updateRefreshToken: (token, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET refreshToken='${token}' WHERE id ='${id}'`,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(res)
          }
        })
    })
  },
  checkRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE refreshToken = '${refreshToken}'`,
        (err, res) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  checkEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          if (res.length > 0) {
            resolve(res)
          } else {
            reject('Email tidak ditemukan')
          }

        }
      })
    })
  },
  renewPassword: (password, userKey) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET password = '${password}' WHERE userKey = '${userKey}'`,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(res)
          }
        })
    })
  },
  updateKey: (userKey, email) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET userKey = '${userKey}' WHERE email = '${email}'`,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(res)
          }
        })
    })
  },
  resetKey: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET userKey = null WHERE email = '${email}'`,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(res)
          }
        })
    })
  },
  logout: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET refreshToken = null WHERE id = '${id}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE id = '${id}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  update: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET ? WHERE id = ?`, [data, id], (err, result) => {
          if(err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
      })
    })
  }
}

module.exports = user