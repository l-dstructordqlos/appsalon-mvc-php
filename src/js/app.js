let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Muestra una seccion ni bien carga el documento, entuestro caso la seccon que tiene el paso 1
    tabs(); // Cambia tu seccion cuando se precionan los tabs
    botonesPaginador(); // Agrega o quita funciones del paginador
    paginaAnterior();
    paginaSiguiente();

    consultarAPI(); // Consulta la API en el backend de PHP
    idCliente();
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); //Añade la fecha de la cita en el objeto
    seleccionarHora(); //añade la hora de la cita en el objeto

    mostrarResumen();
}

function mostrarSeccion() {
    // Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la seccion con ek paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`)
    tab.classList.add('actual');
}

function tabs() {
    // Selecionamos todos los elemtos con la clase de tabs y button y los guardamos en la constante botones
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            //le asignamos a la variable de paso, el valor de nuestro selector personalizado 'data-paso: ' del elemto presionado y lo transformamos en entero
            paso = parseInt( e.target.dataset.paso );

            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');
    
    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        // mostrar resumen
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        if(paso <= pasoInicial) return;
        paso--;
    //console.log(paso);

        botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        if(paso >= pasoFinal) return;
        paso++;

        botonesPaginador();
    });
}

async function consultarAPI() {
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        // fucnion que se ejecutara tras hacer click
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

        //console.log(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;

    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    
    //Comprobar si un servicio ya fue agregado
    if( servicios.some( agregado => agregado.id === id ) ) {
        // Elliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id );
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        // toma una copia de lo que hay en el arreglo de servicios y agrego el nuevo objeto, eso crea un objeto con la informacion nueva y reescribimos en servicios
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    cita.id = document.querySelector('#id').value;
}
function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        // getUTCDay nos da los dias del calendario con numero, siendo 6 sabado y 0 domingo
        const dia = new Date(e.target.value).getUTCDay();

        if( [6, 0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario')
            console.log('sab y domingo no trabajamos');
        } else {
            cita.fecha = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    // comprueva que no haya niingun elemento conn la clase de alerta
    const alertaPrevia= document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    };

    // crea un div dentro del formulario y le asigna el mensaje y el tipo segun se refquiera
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    // elimina la alerta la transcurso de 3000 milisegundos
    if(desaparece) {
        setTimeout( () => {
            alerta.remove();
        }, 3000);
    }
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if(hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Hora no valida', 'error', '.formulario')
        } else {
            cita.hora = e.target.value;
            //console.log(cita);
        }
    });
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;
    }

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para Servicios en Resumen
    const headingServicio = document.createElement('H3');
    headingServicio.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicio);

    servicios.forEach(servicio => {
        const {id, precio, nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    // Heading para Cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;
    
    // Formatear la fecha en español, 1° CREAMOS UN OBJETO DE Date QUE ALMACENARA NUESTROS VALORES DE LA VARIABLE fecha
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2; // el +2 es debido al desfase de un dia menos que ocurre al usar New Date
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    // toLocaleDateString nos permite escribir un string referente a la fecha segun la localidad asignada 'es-MX' y apoyado de dtalles 'opciones'
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);


    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {

    const {nombre, fecha, hora, servicios, id} = cita;

    const idServicios = servicios.map( servicio => servicio.id );
    // console.log(idServicios);

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);
    
    try {
        // Peticion hacia la API
        const url = '/api/citas';
    
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();
        //console.log(resultado);

        if(resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
                button: "OK"
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        }     
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita"
          });        
    }
}