const express = require('express')
const { getAll, getDetail, insert, update, destroy } = require('../controllers/products')

const router = express.Router()

router
.get('/store', getAll)
.get('/detail/:id', getDetail)
.post('/insert', insert)
.patch('/update/:id', update)
.delete('/delete/:id', destroy)

module.exports = router