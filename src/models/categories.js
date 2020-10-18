const db = require('../config/db')

const categories = {
  getAll: (search, sort, typeSort, limit, offset) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT *, (SELECT COUNT(*) FROM categories) AS count FROM categories  WHERE category LIKE '%${search}%' ORDER BY ${sort} ${typeSort} LIMIT ${offset}, ${limit}`,
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
  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM categories WHERE id = ?`, id, (err, res) => {
        if (err) {
          reject(new Error(err))
        }
        resolve(res)
      })
    })
  },
  insert: (data) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO categories (category) VALUES ('${data.category}')`,
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
  update: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE categories SET category = '${data.category}' WHERE id = '${id}'`,
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
  destroy: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM categories WHERE id = '${id}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
}

module.exports = categories
