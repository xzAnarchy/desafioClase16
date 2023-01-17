// Establecemos la comunicacion del lado del cliente 
const socket = io.connect()

//-------------------------------------------------------------

//PRODUCTOS CON SOCKET.IO

// Selecciono el form completo y hacemos un preventDefault
const formAgregarProducto = document.getElementById("formAgregarProducto");
formAgregarProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleValue = document.querySelector("input[name=title]").value;
  const priceValue = document.querySelector("input[name=price]").value;
  const thumbnailValue = document.querySelector("input[name=thumbnail]").value;
  const newProduct = {
    title: titleValue,
    price: priceValue,
    thumbnail: thumbnailValue,
  };
  socket.emit('newProduct', newProduct)
});

// Renderizamos los productos en el html

socket.on("Products", async (productos) => {
    const htmlProductos = await makeHtmlTable(productos);
    document.getElementById("productos").innerHTML = htmlProductos;
  });
  
  function makeHtmlTable(productos) {
    return fetch("plantillas/tabla-productos.hbs")
      .then((respuesta) => respuesta.text())
      .then((plantilla) => {
        const template = Handlebars.compile(plantilla);
        const html = template({ productos });
        return html;
      });
  }

//* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
const authorSchema = new normalizr.schema.Entity('authors',{}, {idAttribute:"mail"});
const textSchema = new normalizr.schema.Entity('text');
const mensajeSchema = new normalizr.schema.Entity('messages', {
    author: authorSchema,
    text: [textSchema]
});


//-----------------------------------------------------
// PARTE CHAT WEBSOCKET
const inputEmail= document.getElementById("authorId")
const inputName = document.getElementById("authorName");
const inputLastName = document.getElementById("authorLastName");
const inputAge = document.getElementById("authorAge");
const inputUsername = document.getElementById("authorUsername");
const inputAvatar = document.getElementById("authorAvatar");
const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar = document.getElementById("btnEnviar");

// Selecciono el form completo y procedemos a hacer un prevent default
const formPublicarMensaje = document.getElementById("formPublicarMensaje");
formPublicarMensaje.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailValue = inputEmail.value;
    const nameValue = inputName.value;
    const lastNameValue = inputLastName.value;
    const ageValue = inputAge.value;
    const inputUsernameValue = inputUsername.value;
    const avatarValue = inputAvatar.value;
    const date = new Date().toLocaleDateString('es-ES')
    const time = new Date().toLocaleTimeString();
    const textValue = inputMensaje.value;
    const newMessage = {
      author: {
        mail: emailValue,
        name: nameValue,
        lastName: lastNameValue,
        age: ageValue,
        username: inputUsernameValue,
        avatar: avatarValue
      },
      text: textValue,
      date: date + " " + time
    };
    socket.emit("newMessage", newMessage);
    formPublicarMensaje.reset();
  });

  socket.on("message", mensajesN => {
    // Dernomalizamos los mensajes recibidos por el socket y los integramos al html
    let mensajesDenormalized = normalizr.denormalize(mensajesN.result, [mensajeSchema], mensajesN.entities)
    const html = makeHtmlList(mensajesDenormalized)
    document.getElementById('mensajes').innerHTML = html;
    
    // Guardamos el tamaño de la data y hacemos el porcentaje
    let mensajesNsize = JSON.stringify(mensajesN).length
    console.log(mensajesN, mensajesNsize);
    let mensajesDsize = JSON.stringify(mensajesDenormalized).length
    console.log(mensajesDenormalized, mensajesDsize);

    // Logica del porcentaje
    let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
    console.log(`Porcentaje de compresión ${porcentajeC}%`)
    document.getElementById('compresion-info').innerText = porcentajeC
  });
  
  // Funcion del html para integrar todos los datos de lo recibido por el socket
  function makeHtmlList(mensajes) {
    const html = mensajes
      .map((mensaje) => {
        return `<div style="margin-bottom: 10px;">
        <img src="${mensaje.author.avatar}" height="30px">
        <span style="color:brown;">
        ${mensaje.author.mail + " "}
        </span>
        <strong style="color:blue;">
        ${mensaje.author.name + " "}
        ${mensaje.author.lastName + " : "}
        </strong>
        <i style="color:green;">${mensaje.text}</i>
        </div>`;
      })
      .join(" ");
    return html;
  }
  
