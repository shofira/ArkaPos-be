const express = require('express')
const { insert, destroy } = require('../controllers/transaksi')

const router = express.Router()

router
.post('/insert', insert)
.delete('/delete/:id', destroy)

module.exports = router