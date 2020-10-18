const db = require('../config/db')
const fs = require('fs')
const path = 'src/images'

const products = {
  getAll: (search, sort, typeSort, limit, offset) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT *,  (SELECT COUNT(*) FROM products) AS count FROM products WHERE name_product LIKE '%${search}%' ORDER BY ${sort} ${typeSort} LIMIT ${offset}, ${limit}`,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          }
          resolve(res)
        }
      )
    })
  },
  getDetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM products WHERE id = ?`, id, (err, res) => {
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
        `INSERT INTO products (id_category, name_product, price, image) VALUES ('${data.id_category}', '${data.name_product}', '${data.price}', '${data.image}' )`,
        (err, res) => {
          if (err) {
            reject(new Error(err))
          }
          resolve(res)
        }
      )
    })
  },
  update: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM products WHERE id = ?`, id, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(new Promise((resolve, reject) => {
            let newImage = null
            let imageOld = result[0].image
            if(!data.image) {
              newImage = imageOld
              db.query(`UPDATE products SET ?, image = '${newImage}' WHERE id = ?`, [data, id], (err, res) => {
                if (err) { reject(new Error(err)) }
                else { resolve(res) }
              })
            } else {
              const image = result[0].image
              fs.unlink(`${path}/${image}`, (err) => {
              if (err) throw err
              resolve(result)
            })
            db.query(`UPDATE products SET ? WHERE id = ?`, [data, id], (err, res) => {
              if (err) { reject(new Error(err)) }
              else { resolve(res) }
            })
            }
          }))
        }
      })
    })
  },
  destroy: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM products WHERE id = '${id}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          const image = result[0].image
          db.query(`DELETE FROM products WHERE id = ?`, id, (err, res) => {
            if (err) {
              reject(new Error(err))
            } else {
              if (image) {
                fs.unlink(`${path}/${image}`, (err) => {
                  if (err) throw err
                  resolve(res)
                })
              } else {
                resolve(res)
              }
            }
          })
        }
      })
    })
  }
}

module.exports = products
