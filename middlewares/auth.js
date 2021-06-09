
const passport = require('passport')
const { facebookId, facebookSecret, port } = require('./../services/env.service')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const UsuarioServicio = require('./../services/usuario.service')
const MensajesServicio = require('./../services/mensajes.service')

const usuarioServicio = new UsuarioServicio()
const mensajesServicio = new MensajesServicio()


const login = async function ( username, password, done ) {
  try {
    let usuarioDB = await usuarioServicio.getUserByName( username )
    if(usuarioDB.length > 0) {
      if(!usuarioDB[0].isValidPassword(password)) {
        return done(null, false)
      }
      mensajesServicio.sendMailEthereal(usuarioDB, 'login')
      mensajesServicio.sendMailGmail(usuarioDB)
      return done(null, usuarioDB[0])
    } else {
      return done(null, false)
    }
  } catch ( err ) { console.log(err); return done(err)}
  
}

const facebook = async function ( accessToken, refreshToken, profile, cb) { 
  try {
    let usuarioDB = await usuarioServicio.getUserByIdFacebook( profile.id )
    
    if(!usuarioDB) {
      usuarioDB = await usuarioServicio.add( profile )
    }

    mensajesServicio.sendMailEthereal(usuarioDB, 'login')
    mensajesServicio.sendMailGmail(usuarioDB)
    return cb(null, usuarioDB)
  } catch ( err ) { return cb(err)}
}

const checkIsAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    next()
  } else {
    res.render('login')
  }
}

passport.use('login', new LocalStrategy({usernameField: 'usuario', passwordField: 'password', session: true}, login ) )

passport.use('facebook', new FacebookStrategy({
    clientID: facebookId, 
    clientSecret: facebookSecret, 
    callbackURL: `http://localhost:${port}/api/auth/facebook/callback`, 
    profileFields: ['id', 'displayName', 'email', 'picture'] 
  }, facebook)
)

module.exports = { checkIsAuthenticated, passport }