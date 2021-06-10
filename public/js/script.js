let usuario = document.querySelector('#usuario')
let password = document.querySelector('#password')
let email = document.querySelector('#email')
let title = document.querySelector('#title')
let price = document.querySelector('#price')
let thumbnail = document.querySelector('#thumbnail')
let eliminar = document.querySelector('#eliminar')
let guardar = document.querySelector('#guardar')
let select = document.querySelectorAll('.select')
let id_producto = document.querySelector('#id_producto')
let btnRegistrarse = document.querySelector('#registrarse')
let btnSalir = document.querySelector('#salir')
let btnEnviar = document.querySelector('#enviar')
let enviarMensaje = document.querySelector('#enviarMensaje')

let emailChat = document.querySelector('#emailChat')

if(emailChat) {
  emailChat.addEventListener('input', validarEmail)
}

if(enviarMensaje) {
  enviarMensaje.addEventListener('click', sendMessage)
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});

eliminar.addEventListener('click', eliminarProducto)
guardar.addEventListener('click', guardarProducto)


function salir ()  {
  console.log('salir')
  fetch('http://localhost:3232/api/sesion/salir', {
    method: 'GET',
  }).then( result => result.json())
    .then( () => window.location.replace('http://localhost:3232/'))
    .catch( err => console.log(err))
    
}

function deshabilitarBotonRegistro () {
  if(usuario.value != '' && password.value != '' && email.value != '') {
    btnRegistrarse.removeAttribute('disabled')
  } else {
    btnRegistrarse.setAttribute('disabled', true)
  }
}

function deshabilitarBotonEnviar () {
  if(title.value != '' && price.value != '' && thumbnail.value != '') {
    btnEnviar.removeAttribute('disabled')
  } else {
    btnEnviar.setAttribute('disabled', true)
  }
}

function validarEmail() {
  let format = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  if (format.test(emailChat.value)) {
    enviarMensaje.disabled = false
  } else {
    enviarMensaje.disabled = true
  }
}

function sendMessage (event) {
  event.preventDefault()
  socket.emit('message', {
    author: {
      email: emailChat.value,
      nombre: nombre.value,
      apellido: apellido.value,
      edad: edad.value,
      alias: alias.value,
      avatar: avatar.value
    },
    text: message.value
  })
  message.value = ''
}

function crearMensaje ( mensaje ) {
  mensaje = JSON.parse(mensaje)
  console.log({mensaje})
  let li = document.createElement('li')
  let spanEmail = document.createElement('span')
  let spanFechaHora = document.createElement('span')
  let spanMensaje = document.createElement('span')
  spanEmail.innerText = mensaje.author.email + ' -   '
  spanEmail.className = 'emailStyle'
  // spanFechaHora.innerText = mensaje.author.fechaHora
  // spanFechaHora.className = 'fechaHoraStyle'
  spanMensaje.innerText = mensaje.text
  spanMensaje.className = 'mensajeStyle'

  li.appendChild(spanEmail)
  li.appendChild(spanFechaHora)
  li.appendChild(spanMensaje)

  lista.appendChild(li)
}

let socket = io()
let sessionID = null

socket.on('connect', () => {
  console.log('conectado')



  socket.on('disconnect', () => {
    console.log('desconectado')
  })
  

  socket.on('message', (data) => {
    console.log(data)
    crearMensaje(data)
  })

  socket.on('todosLosMensajes', (data) => {
    let mensajes = JSON.parse(data)
    console.log({mensajes})
    
    // crearMensaje(data)
  })
})

function seleccionarProducto ( fila ) {
  let columnas = fila.getElementsByTagName('td')

  id_producto.value = columnas[0].innerText
  title.value = columnas[1].innerText
  price.value = columnas[2].innerText
  let src = columnas[3].getElementsByTagName('img')[0].src

  let selectWrapper = select[0].getElementsByClassName('dropdown-content')
  console.log(selectWrapper[0])
  let itemsLista = selectWrapper[0].getElementsByTagName('li')

  for(let i = 0 ; i < itemsLista.length ; i++) {
    itemsLista[i].classList.remove('selected')
    let imgList = itemsLista[i].getElementsByTagName('img')

    if(imgList.src == src ) {
      itemsLista[i].classList.add('selected')
    }

  }

}

function eliminarProducto (evt) {
  evt.preventDefault()
  console.log('eliminar')
  fetch(`http://localhost:3232/api/producto/${id_producto.value}`, {
    method: 'DELETE',
  }).then( result => result.json())
    .then( (data) => window.location.replace('http://localhost:3232/api/producto')
    )
    .catch( err => console.log(err))
}

function guardarProducto (evt) {
  evt.preventDefault()

  if(id_producto.value == "") {


    let query = `
      mutation addProducto($title: String, $price: Float, $thumbnail: String) {
        addProducto(title: $title, price: $price, thumbnail: $thumbnail) {
          id_producto,
          title,
          price,
          thumbnail
        }
      }
    
    `

    let variables = {
      "title": title.value,
      "price": Number(price.value),
      "thumbnail": thumbnail.value
    }

    fetch(`http://localhost:3232/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    }).then( result => result.json())
      .then( () => window.location.replace('http://localhost:3232/api/producto'))
      .catch( err => console.log(err))
  } else {
    fetch(`http://localhost:3232/api/producto`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_producto: id_producto.value, title: title.value, price: price.value, thumbnail: thumbnail.value })
    }).then( result => result.json())
      .then( (data) => window.location.replace('http://localhost:3232/api/producto')
      )
      .catch( err => console.log(err))
  }

}