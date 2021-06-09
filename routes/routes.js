const express = require('express')
const app = express()

app.use(require('./usuario.routes'))
app.use(require('./producto.routes'))
app.use(require('./mensaje.routes'))

module.exports = app