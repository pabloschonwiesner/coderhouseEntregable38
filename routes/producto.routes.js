const express = require('express')
const router = express.Router()
const { checkIsAuthenticated }= require('./../middlewares/auth')
const ProductoServicio = require('./../services/producto.service')

const productoServicio = new ProductoServicio()


router.get('/', checkIsAuthenticated,  (req, res) => {
  res.redirect('/producto')      
})

router.get('/producto', checkIsAuthenticated, async (req, res) => {
  let productos = await productoServicio.getAll()
  console.log({productos})
  res.render('productos', { productos, listExists: true} )
})


router.post('/producto', async  (req, res) => {
  try {
    if(req.body) {
      await productoServicio.add(req.body)
    }
    res.redirect('/producto')
  } catch ( err ) { console.log(err) }
})

router.delete('/producto/:id_producto', async  (req, res) => {
  try {
    if(req.params.id_producto) {
      await productoServicio.delete(req.params.id_producto)
    }
    // res.redirect('/api')
    res.status(200).json({delete: true})
  } catch ( err ) { console.log(err) }
})

router.put('/producto', async  (req, res) => {
  try {
    if(req.body) {
      await productoServicio.update(req.body)
    }
    // res.redirect('/api')
    res.status(200).json({update: true})
  } catch ( err ) { console.log(err) }
})

module.exports = router