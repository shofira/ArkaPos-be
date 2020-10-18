const { reject } = require('lodash')
const db = require('../config/db')

const transaksi = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM transaksi JOIN transaksi_detail ON transaksi.id = transaksi_detail.id_transaksi`,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(res)
          }
        }
      )
    })
  },
  insertMaster: (body) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO transaksi (invoice, cashier) VALUES ('${body.invoice}', '${body.cashier}')`,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(res)
          }
        }
      )
    })
  },
  insertDetail: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO transaksi_detail SET ?`, data, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  deleteMaster: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`Delete FROM transaksi WHERE id = ?`, id, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  deleteDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `Delete FROM transaksi_detail WHERE id_transaksi = ?`,
        id,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(res)
          }
        }
      )
    })
  },
}

module.exports = transaksi
