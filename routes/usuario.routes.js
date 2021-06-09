const express = require('express')
const router = express.Router()
const path = require('path')
const { passport, checkIsAuthenticated }= require('./../middlewares/auth')
const UsuarioServicio = require('./../services/usuario.service')
const MensajesServicio = require('./../services/mensajes.service')
const Usuario = require('./../models/usuario.model')

const usuarioServicio = new UsuarioServicio()
const mensajesServicio = new MensajesServicio()

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  Usuario.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/api/login'}), (req, res) => {
  req.session.facebookId = req.user.facebookId
  res.redirect(`/api/producto`)
})

router.get('/login', (req, res) => {
  let usuarioExistente = JSON.parse(req.query.ue || false)
  let passwordIncorrecto = JSON.parse(req.query.pi || false)
  res.render('login', { usuarioExistente, passwordIncorrecto } )
})

router.get('/register', (req, res) => {
  res.sendFile(`${path.join(__dirname, '..', '/public/register.html')}`)
})

router.get('/perfil', checkIsAuthenticated, async  (req, res) => {
  let perfil = await usuarioServicio.getUserByIdFacebook(req.session.facebookId)
  console.log({perfil})
  res.render('perfil', { perfil } )     
})

router.post('/register', async (req, res) => {
  let usuario = await usuarioServicio.getUserByName(req.body.usuario.toLowerCase())
  let ue = true
  if(usuario.length == 0) {
    ue = false
  
    let nuevoUsuario = { 
      usuario: req.body.usuario.toLowerCase(), 
      password: req.body.password, 
      email: req.body.email.toLowerCase()
    }
  
    await usuarioServicio.add(nuevoUsuario)
  }
  return res.redirect(`/api/login?ue=${ue}`)  
})

router.post('/ingresar', passport.authenticate('login', { failureRedirect: '/login?pi=true'}), async (req, res) => {
  try {
    res.redirect('/api/producto')
  } catch ( err ) { console.log(err) }
})

router.get('/salir', async (req, res) => {
  let usuarioDB = await usuarioServicio.getById(req.session.passport.user)
  
  req.session.destroy( () => {
    mensajesServicio.sendMailEthereal(usuarioDB, 'logout')
    res.redirect('/api/')
  })
})

module.exports = router