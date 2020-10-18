const redis = require('redis')
const redisClient = redis.createClient()
const productModel = require('../models/products')
const upload = require('../helpers/upload')
const { success, failed, successWithMeta } = require('../helpers/response')

const products = {
  getAll: (req, res) => {
    try {
      const search = !req.query.search ? '' : req.query.search
      const sort = !req.query.sort ? 'id' : req.query.sort
      const typeSort = !req.query.typeSort ? 'asc' : req.query.typeSort

      const limit = !req.query.limit ? 9 : parseInt(req.query.limit)
      const page = !req.query.page ? 1 : parseInt(req.query.page)
      const offset = page === 1 ? 0 : (page - 1) * limit

      productModel.getAll(search, sort, typeSort, limit, offset)
        .then((result) => {
          // redis
          redisClient.set('products', JSON.stringify(result))

          const total = result[0].count
          const meta = {
            totalRows: total,
            totalPage: Math.ceil(total / limit),
            page
          }
          successWithMeta(res, result, meta, 'Get All data Success')
        }).catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  getDetail: (req, res) => {
    try {
      const id = req.params.id
      productModel.getDetail(id)
        .then((result) => {
          success(res, result, 'Get Detail data Success')
        })
        .catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  insert: (req, res) => {
    try {
      upload.single('image')(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            failed(res, [], 'Ukuran file terlalu besar')
          } else {
            failed(res, [], err)
          }
        } else {
          const body = req.body
          body.image = req.file.filename
          productModel.insert(body)
            .then((result) => {
              // redis
              redisClient.del('products');
              success(res, result, 'Insert data success');
            }).catch((err) => failed(res, [], err.message))
        }
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
            failed(res, [], 'Ukuran file terlalu besar')
          } else {
            failed(res, [], err)
          }
        } else {
          const id = req.params.id
          const body = req.body
          body.image = !req.file ? '' : req.file.filename
          productModel.update(body, id)
            .then((result) => {
              // redis
              redisClient.del('products')
              success(res, result, 'Update data success')
            }).catch((err) => failed(res, [], err.message))
        }
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  destroy: (req, res) => {
    try {
      const id = req.params.id
      productModel.destroy(id)
        .then((result) => {
          // redis
          redisClient.del('products')
          success(res, result, 'Delete data success')
        }).catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
}

module.exports = products
