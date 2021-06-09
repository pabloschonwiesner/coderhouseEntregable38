const { port } = require('./services/env.service')
const connectToDatabase = require('./services/db.services')
const { server } = require('./services/index')

connectToDatabase().then( () => {
  server.listen(port, () => {
    console.log(`Escuchando el puerto ${port}`)    
  })

  server.on('error', (err) => { console.log(`Error de conexion: ${err}`)})
}
)

