const Producto = require('./../models/producto.model')


class ProductoServicio {

  async getAll () {
    let prod = await Producto.find({}).lean()

    if(prod.length == 0) {      
      return []
    }
    
    return prod;
  }

  async getOne ( id_producto ) {
    let producto = await Producto.findOne({ id_producto }, {})  
    return   producto
  }

  async add ( producto ) {
    console.log(producto)
    let nuevoProducto = new Producto( { title: producto.title, price: producto.price, thumbnail: producto.thumbnail })
    return await nuevoProducto.save() 
  }

  async update ( producto) {
    return await Producto.updateOne( { id_producto: producto.id_producto }, { title: producto.title, price: producto.price, thumbnail: producto.thumbnail })    
  }

  async delete ( id_producto) {
    return await Producto.deleteOne( {id_producto })
  }
}


module.exports = ProductoServicio