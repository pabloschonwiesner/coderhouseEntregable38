const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const AutoIncrement = require('mongoose-sequence')(mongoose);

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  facebookId: String,
  usuario: String,
  password: String,
  email: String,
  picture: String
})

usuarioSchema.pre( 'save', async function(next) {
  const user = this
  if(user.facebookId != undefined) {
    const hash = await bcrypt.hash(user.password, 10)
    this.password = hash
  }

  next()
})

usuarioSchema.methods.isValidPassword = async function(password) {
  const user = this
  if(user.facebookId != undefined) {
    return bcrypt.compare(password, user.password)
  } else {
    return true
  }
}

usuarioSchema.plugin(AutoIncrement, {inc_field: 'id_usuario'});
module.exports = mongoose.model('Usuario', usuarioSchema)