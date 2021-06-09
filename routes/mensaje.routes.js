const express = require('express')
const router = express.Router()
const { checkIsAuthenticated }= require('./../middlewares/auth')
const MensajeServicio = require('./../services/mensaje.service')

const mensajeServicio = new MensajeServicio()

router.get('/chat', checkIsAuthenticated, async (req, res) => {
  res.render('chat', { productos: await mensajeServicio.getAll()} )
})

module.exports = router