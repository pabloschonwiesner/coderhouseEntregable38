const { io } = require('../services/index')
const MensajeServicio = require('./../services/mensaje.service')
const MensajesServicio = require('./../services/mensajes.service')

let mensajeServicio = new MensajeServicio()
let mensajesServicio = new MensajesServicio()

io.on('connection', (client) => {
  console.log('cliente conectado')
  io.on('disconnect', () => {
    console.log('cliente desconectado')
  })

  client.on('message', async (data) => {
    console.log(data);

    if(data.text.includes('administrador')) {
      let mensaje = `${data.author.email} ${data.text}`
      mensajesServicio.sendSMS(mensaje)
    }

    let mensajeAgregado = await mensajeServicio.add(data)
    io.sockets.emit('message', JSON.stringify(mensajeAgregado))
  })

  async function emitirListaMensajes() {
    let  mensajes = await mensajeServicio.getAll()
    client.emit('todosLosMensajes', JSON.stringify(mensajes))
  }

  // emitirListaProductos()
  emitirListaMensajes()
})