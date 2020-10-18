const express = require('express')
const { getAll, getDetail, insert, update, destroy } = require('../controllers/categories')

const router = express.Router()

router
.get('/store', getAll)
.get('/detail/:id', getDetail)
.post('/insert', insert)
.put('/update/:id', update)
.delete('/delete/:id', destroy)

module.exports = router