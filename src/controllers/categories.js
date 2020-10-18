const redis = require('redis')
const redisClient = redis.createClient()
const categoryModel = require('../models/categories')
const { success, successWithMeta, failed } = require('../helpers/response')

const categories = {
  getAll: (req, res) => {
    try {
    const search = !req.query.search ? '' : req.query.search
    const sort = !req.query.sort ? 'id' : req.query.sort
    const typeSort = !req.query.typeSort ? 'asc' : req.query.typeSort

    const limit = !req.query.limit ? 5 : parseInt(req.query.limit)
    const page = !req.query.page ? 1 : parseInt(req.query.page)
    const offset = page === 1 ? 0 : (page - 1) * limit

    categoryModel
      .getAll(search, sort, typeSort, limit, offset)
      .then((result) => {

        // redis
        redisClient.set('categories', JSON.stringify(result))

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
      categoryModel.getDetail(id)
      .then((result) => success(res, result, 'Get Detail data Success'))
      .catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  insert: (req, res) => {
    try {
      const body = req.body
      categoryModel.insert(body)
        .then((result) => {
          // redis
          redisClient.del('categories')
          success(res, result, 'Insert data success')
        }).catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  update: (req, res) => {
    try {
      const body = req.body
      const id = req.params.id
      categoryModel.update(body, id)
        .then((result) => {
          // redis
          redisClient.del('categories')
          success(res, result, 'Update data success')
        }).catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  destroy: (req, res) => {
    try {
      const id = req.params.id
      categoryModel.destroy(id)
        .then((result) => {
          // redis
          redisClient.del('categories')
          success(res, result, 'Delete data success')
        }).catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  }
}

module.exports = categories