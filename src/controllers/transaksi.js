const redis = require('redis')
const redisClient = redis.createClient()
const transaksiModel = require('../models/transaksi')
const { success, failed } = require('../helpers/response')

const transaksi = {
  insert: async (req, res) => {
    try {
      const body = req.body
      transaksiModel.insertMaster(body)
        .then((response) => {
          const idMaster = response.insertId
          const insertDetail = body.detail.map((item) => {
            item.id_transaksi = idMaster
            transaksiModel.insertDetail(item)
          })
          Promise.all(insertDetail)
            .then(() => success(res, response, 'Insert Data Success'))
            .catch((err) => failed(res, [], err.message))
        })
        .catch((err) => {
          failed(res, [], 'Insert Data Failed!')
        })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  destroy: async (req, res) => {
    const id = req.params.id
    transaksiModel
      .deleteMaster(id)
      .then((response) => {
        const idMaster = response.insertId
        const deleteDetail = body.detail.map((item) => {
          item.id_transaksi = idMaster
          transaksiModel.deleteDetail(item)
        })
        Promise.all(deleteDetail)
          .then(() => {
            success(res, response, 'Insert Data Success')
          })
          .catch((err) => {
            failed(res, [], 'Insert Data Failed!')
          })
      })
      .catch((err) => {
        failed(res, [], 'Internal Server Error!')
      })
  },
}

module.exports = transaksi
