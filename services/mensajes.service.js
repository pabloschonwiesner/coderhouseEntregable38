const nodemailer = require("nodemailer");
const { process } = require('./env.service')
const clienteTwilio = require('twilio')(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN)

class MensajesServicio {

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'evie57@ethereal.email',
        pass: 'jZ8mCUm4cTRqsRudRU'
    }
  });

  transporterGmail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.MAIL_GMAIL,
        pass: process.env.PASS_GMAIL
    }
  });

  mailOptions = {
    from: 'Servidor Node.js',
    to: 'evie57@ethereal.email',
    subject: 'Mail de prueba',
    html: '<h1 style="color: blue;"> prueba </h1>'
  }

  mailOptionsGmail = {
    from: 'Servidor Node.js',
    to: process.env.MAIL_GMAIL,
    subject: 'Mail de prueba',
    html: '<h1 style="color: blue;"> prueba </h1>'
  }


  async sendMailEthereal (usuario, accion) {
    let options = Object.assign({}, this.mailOptions)
    let mensaje = `${accion} usuario ${usuario.usuario} ${Date()}`
  
    options.subject = mensaje
    options.html = `<h1 style="color: blue;"> ${mensaje} </h1>`
  
    this.transporter.sendMail(options, (err, info) => {
      if(err) {
        console.log(err);
        return err
      }
      console.log(info);
      return
    })
  }

  async sendMailGmail (usuario) {
    let options = Object.assign({}, this.mailOptionsGmail)
    let mensaje = `login usuario ${usuario.usuario} ${Date()}`
  
    options.subject = mensaje
    options.to = usuario.email
    options.html = `<h1 style="color: blue;"> ${mensaje} </h1>
    <div><img src=${usuario.picture} width="100" height="100"/></div>
    `
  
    this.transporterGmail.sendMail(options, (err, info) => {
      if(err) {
        console.log(err);
        return err
      }
      console.log(info);
    })
  }

  async sendSMS (mensaje) {
    clienteTwilio.messages.create({
      body: mensaje,
      from: '+13236760277',
      to: '+5491140430759'
    })
    .then( message => console.log({message}))
    .catch ( err => console.log({err}))
  }

}

module.exports = MensajesServicio