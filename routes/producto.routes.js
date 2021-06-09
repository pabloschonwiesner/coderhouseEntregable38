const express = require('express')
const router = express.Router()
const { checkIsAuthenticated }= require('./../middlewares/auth')
const ProductoServicio = require('./../services/producto.service')

const productoServicio = new ProductoServicio()


router.get('/', checkIsAuthenticated,  (req, res) => {
  res.redirect('/producto')      
})



router.get('/producto', checkIsAuthenticated, async (req, res) => {
  res.render('productos', { productos: await productoServicio.getAll(), listExists: true} )
})


router.post('/producto', async  (req, res) => {
  try {
    if(req.body) {
      await productoServicio.add(req.body)
    }
    res.redirect('/producto')
  } catch ( err ) { console.log(err) }
})

module.exports = router