const express = require('express')
const router = express.Router()
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const ProductoServicio = require('./../services/producto.service')

const productoServicio = new ProductoServicio()

const schema = buildSchema(`
  type Query {
    productos: [Producto],
    producto(id_producto: Int): Producto
  },
  type Mutation {
    addProducto(title: String, price: Float, thumbnail: String): Producto
  },
  type Producto {
    title: String,
    price: Float,
    thumbnail: String,
    id_producto: Int
  }
`)

async function getAll () {
  return await productoServicio.getAll()
}

async function getOne (args) {
  if(args.id_producto) {
    return await productoServicio.getOne(args.id_producto)
  } 
}

async function addProducto({title, price, thumbnail}) {
  return await productoServicio.add( {
    title: title,
    price: price,
    thumbnail: thumbnail
  })
}

const root = {
  productos: getAll,
  producto: getOne,
  addProducto: addProducto
}

router.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

module.exports = router