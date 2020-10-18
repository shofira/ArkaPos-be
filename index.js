const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { PORT } = require('./src/helpers/env')
const { authentication, authorization } = require('./src/helpers/auth')

// import router
const usersRouter = require('./src/routes/users')
const categoriesRouter = require('./src/routes/categories')
const productsRouter = require('./src/routes/products')
const transaksiRouter = require('./src/routes/transaksi')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('src/images'))

// root
app.use('/users', usersRouter)
app.use('/categories', categoriesRouter)
app.use('/products', productsRouter)
app.use('/transaksi', transaksiRouter)

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`)
})
