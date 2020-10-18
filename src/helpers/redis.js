const redis = require('redis')
const redisClient = redis.createClient()
const _ = require('lodash')
const { successWithMeta } = require('./response')

module.exports = {
  // products
  redisGetProduct: (req, res, next) => {
    redisClient.get('products', (err, result) => {
      if (data) {
        const data = JSON.parse(result)
        const search = !req.query.search ? '' : req.query.search
        const sort = !req.query.sort ? 'id' : req.query.sort
        const typeSort = !req.query.typeSort ? 'asc' : req.query.typeSort

        const limit = !req.query.limit ? 3 : parseInt(req.query.limit)
        const page = !req.query.page ? 1 : parseInt(req.query.page)
        const start = (page - 1) * limit
        const end = page * limit

        const sorting = _.orderBy(data, [sort], [typeSort])
        let dataRedis = sorting

        if (search !== null) {
          const searchData = sorting.filter(e => e.name_product.includes(search))
          dataRedis = searchData
        }

        // const output = _.slice(dataRedis, start, offset)
        const meta = {
          totalRows: dataRedis.length,
          totalPage: Math.ceil(dataRedis.length / limit),
          page,
          limit
        }

        successWithMeta(res, dataRedis, meta, 'Get products from redis')
      } else {
        next()
      }
    })
  },

  // categories
  redisGetCategories: (req, res, next) => {
    redisClient.get('categories', (err, data) => {
      if (data) {
        const dataRedis = JSON.parse(data)
        const search = !req.query.search ? '' : req.query.search

        const sort = !req.query.sort ? 'id' : req.query.sort
        const typeSort = !req.query.typeSort ? 'asc' : req.query.typeSort

        const limit = !req.query.limit ? 3 : parseInt(req.query.limit)
        const page = !req.query.page ? 1 : parseInt(req.query.page)
        const start = page === 1 ? 0 : page * limit - limit
        const offset = start === 0 ? limit : start * limit

        // const output = _.filter(dataRedis, (obj) =>
        //   obj.category.includes(search)
        // )

        // const output = _.orderBy(dataRedis, [sort], [typeSort])
        const output = _.slice(dataRedis, start, offset)
        const meta = {
          totalRows: dataRedis.length,
          totalPage: Math.ceil(dataRedis.length / limit),
          page,
          limit,
        }

        successWithMeta(res, output, meta, 'Get categories from redis')
      } else {
        next()
      }
    })
  },

  // users
  redisGetUsers: (req, res, next) => {
    redisClient.get('users', (err, data) => {
      if (data) {
        const dataRedis = JSON.parse(data)
        // search
        const search = !req.query.search ? '' : req.query.search

        // sort
        const sort = !req.query.sort ? 'id' : req.query.sort
        const typeSort = !req.query.typeSort ? 'asc' : req.query.typeSort

        // pagination
        const limit = !req.query.limit ? 3 : parseInt(req.query.limit)
        const page = !req.query.page ? 1 : parseInt(req.query.page)
        const start = page === 1 ? 0 : page * limit - limit
        const offset = start === 0 ? limit : start * limit

        const output = _.filter(dataRedis, (obj) => obj.email.includes(search))

        // const output = _.orderBy(dataRedis, [sort], [typeSort])
        // const output = _.slice(dataRedis, start, offset)
        const meta = {
          totalRows: dataRedis.length,
          totalPage: Math.ceil(dataRedis.length / limit),
          page,
          limit,
        }

        successWithMeta(res, output, meta, 'Get users from redis')
      } else {
        next()
      }
    })
  },
}
