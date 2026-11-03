//JavaScript Practice · Cine Mirador
const movies = [
    {
        id: 1, titulo: 'El valle de las luciérnagas', genero: 'Animación',
        duracion: 92, edad: 'TP', precio: 6.50, icono: '🦋',
        sesiones: [
            { hora: '16:00', ocupadas: ['C4', 'C5', 'D4', 'D5'] },
            { hora: '18:15', ocupadas: ['A1', 'A2'] },
        ],
    },
    {
        id: 2, titulo: 'Rumbo a la isla perdida', genero: 'Aventura',
        duracion: 118, edad: '+7', precio: 7.50, icono: '🏝️',
        sesiones: [
            { hora: '17:30', ocupadas: ['B3', 'B4', 'B5', 'E7'] },
            { hora: '20:00', ocupadas: [] },
        ],
    },
    {
        id: 3, titulo: 'Mi suegra y otras catástrofes', genero: 'Comedia',
        duracion: 101, edad: '+12', precio: 7.50, icono: '😂',
        sesiones: [
            { hora: '19:00', ocupadas: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] },
            { hora: '22:00', ocupadas: ['F8'] },
        ],
    },
    {
        id: 4, titulo: 'Cartas desde el faro', genero: 'Drama',
        duracion: 124, edad: '+12', precio: 7.50, icono: '✉️',
        sesiones: [
            { hora: '18:00', ocupadas: [] },
        ],
    },
    {
        id: 5, titulo: 'La casa del fondo del lago', genero: 'Terror',
        duracion: 97, edad: '+16', precio: 8.00, icono: '👻',
        sesiones: [
            { hora: '22:30', ocupadas: ['A4', 'A5', 'F1', 'F2'] },
        ],
    },
    {
        id: 6, titulo: 'Bigotes al rescate', genero: 'Animación',
        duracion: 88, edad: 'TP', precio: 6.50, icono: '🐱',
        sesiones: [
            { hora: '12:00', ocupadas: ['B1', 'B2', 'B3'] },
            { hora: '16:30', ocupadas: [] },
        ],
    },
    {
        id: 7, titulo: 'El último tren a Lisboa', genero: 'Drama',
        duracion: 110, edad: '+7', precio: 7.50, icono: '🚂',
        sesiones: [
            { hora: '20:30', ocupadas: ['C1', 'C2'] },
        ],
    },
    {
        id: 8, titulo: 'Operación tortilla', genero: 'Comedia',
        duracion: 95, edad: 'TP', precio: 7.00, icono: '🍳',
        sesiones: [
            { hora: '17:00', ocupadas: [] },
            { hora: '19:30', ocupadas: ['E3', 'E4'] },
        ],
    },
];

const FILAS = ['A', 'B', 'C', 'D', 'E', 'F'];
const BUTACAS_POR_FILA = 8;

const listaPeliculas = document.querySelector('#lista-peliculas');
const contador = document.querySelector('#contador');
const buscador = document.querySelector('#buscador');
const filtroGenero = document.querySelector('#filtro-genero');
const seccionCartelera = document.querySelector('#cartelera');
const seccionReserva = document.querySelector('#reserva');
const seccionEntrada = document.querySelector('#entrada');
const tituloReserva = document.querySelector('#titulo-reserva');
const selectSesion = document.querySelector('#sesion');
const sala = document.querySelector('#sala');
const resumen = document.querySelector('#resumen');
const formReserva = document.querySelector('#form-reserva');
const inputNombre = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const listaErrores = document.querySelector('#errores');
const botonCancelar = document.querySelector('#cancelar');

let peliculaElegida = null;
let seleccionadas = [];

function formatearPrecio(numero) {
    return numero.toFixed(2).replace('.', ',') + ' €';
}

function crearTarjeta(pelicula) {
    const tarjeta = document.createElement('article');
    tarjeta.classList.add('tarjeta');

    const icono = document.createElement('span');
    icono.classList.add('icono');
    icono.textContent = pelicula.icono;

    const titulo = document.createElement('h3');
    titulo.textContent = pelicula.titulo;

    const datos = document.createElement('p');
    datos.classList.add('datos');
    datos.textContent = `${pelicula.genero} · ${pelicula.duracion} min · ${pelicula.edad}`;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.textContent = formatearPrecio(pelicula.precio);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = 'Reservar';
    boton.addEventListener('click', () => abrirReserva(pelicula));

    tarjeta.append(icono, titulo, datos, precio, boton);
    return tarjeta;
}

function pintarCartelera(lista) {
    listaPeliculas.replaceChildren();
    lista.forEach(pelicula => listaPeliculas.append(crearTarjeta(pelicula)));

    if (lista.length === 0) {
        contador.textContent = 'No hay películas que coincidan con la búsqueda.';
    } else {
        contador.textContent = lista.length === 1 ? '1 película' : `${lista.length} películas`;
    }
}

function filtrarPeliculas() {
    const texto = buscador.value.trim().toLowerCase();
    const genero = filtroGenero.value;
    const resultado = peliculas.filter(pelicula => {
        const coincideTexto = pelicula.titulo.toLowerCase().includes(texto);
        const coincideGenero = genero === 'todos' || pelicula.genero === genero;
        return coincideTexto && coincideGenero;
    });

    pintarCartelera(resultado);
}

function sesionElegida() {
    return peliculaElegida.sesiones[Number(selectSesion.value)];
}

function actualizarResumen() {
    const cantidad = seleccionadas.length;
    const total = cantidad * peliculaElegida.precio;
    const texto = cantidad === 1 ? 'butaca' : 'butacas';
    resumen.textContent = `${cantidad} ${texto} · ${formatearPrecio(total)}`;
}

function alternarButaca(butaca, codigo) {
    butaca.classList.toggle('seleccionada');

    if (seleccionadas.includes(codigo)) {
        seleccionadas = seleccionadas.filter(asiento => asiento !== codigo);
    } else {
        seleccionadas.push(codigo);
    }

    actualizarResumen();
}

function pintarSala() {
    sala.replaceChildren();
    seleccionadas = [];
    const ocupadas = sesionElegida().ocupadas;

    FILAS.forEach(fila => {
        for (let numero = 1; numero <= BUTACAS_POR_FILA; numero++) {
            const codigo = fila + numero;
            const butaca = document.createElement('button');
            butaca.type = 'button';
            butaca.classList.add('butaca');
            butaca.textContent = codigo;
            butaca.setAttribute('aria-label', `Butaca ${codigo}`);

            if (ocupadas.includes(codigo)) {
                butaca.classList.add('ocupada');
                butaca.disabled = true;
            } else {
                butaca.addEventListener('click', () => alternarButaca(butaca, codigo));
            }

            sala.append(butaca);
        }
    });

    actualizarResumen();
}

function abrirReserva(pelicula) {
    peliculaElegida = pelicula;
    tituloReserva.textContent = pelicula.titulo;
    selectSesion.replaceChildren();

    pelicula.sesiones.forEach((sesion, indice) => {
        const opcion = document.createElement('option');
        opcion.value = indice;
        opcion.textContent = sesion.hora;
        selectSesion.append(opcion);
    });

    mostrarErrores([]);
    formReserva.reset();
    pintarSala();
    seccionEntrada.hidden = true;
    seccionCartelera.hidden = true;
    seccionReserva.hidden = false;
}

function volverACartelera() {
    seccionReserva.hidden = true;
    seccionEntrada.hidden = true;
    seccionCartelera.hidden = false;
}

function validarReserva() {
    const errores = [];
    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();

    if (nombre.length < 3) {
        errores.push('Escribe tu nombre (mínimo 3 letras).');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errores.push('Escribe un email válido, por ejemplo ana@correo.com.');
    }
    if (seleccionadas.length === 0) {
        errores.push('Elige al menos una butaca.');
    }

    return errores;
}

function mostrarErrores(errores) {
    listaErrores.replaceChildren();
    errores.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        listaErrores.append(li);
    });
    listaErrores.hidden = errores.length === 0;
}

function confirmarReserva() {
    const sesion = sesionElegida();
    const total = seleccionadas.length * peliculaElegida.precio;
    sesion.ocupadas.push(...seleccionadas);

    const titulo = document.createElement('h2');
    titulo.textContent = '🎟️ Tu entrada';

    const pelicula = document.createElement('p');
    pelicula.textContent = `${peliculaElegida.titulo} · sesión de las ${sesion.hora}`;

    const butacas = document.createElement('p');
    butacas.textContent = `Butacas: ${seleccionadas.join(', ')}`;

    const importe = document.createElement('p');
    importe.textContent = `Total: ${formatearPrecio(total)}`;

    const cliente = document.createElement('p');
    cliente.append('A nombre de ');
    const datosCliente = document.createElement('span');
    datosCliente.textContent = `${inputNombre.value.trim()} (${inputEmail.value.trim()})`;
    cliente.append(datosCliente);

    const otraReserva = document.createElement('button');
    otraReserva.type = 'button';
    otraReserva.textContent = 'Hacer otra reserva';
    otraReserva.addEventListener('click', volverACartelera);

    seccionEntrada.replaceChildren(titulo, pelicula, butacas, importe, cliente, otraReserva);
    formReserva.reset();
    seleccionadas = [];
    seccionReserva.hidden = true;
    seccionEntrada.hidden = false;
}

buscador.addEventListener('input', filtrarPeliculas);
filtroGenero.addEventListener('change', filtrarPeliculas);
selectSesion.addEventListener('change', pintarSala);
botonCancelar.addEventListener('click', volverACartelera);
formReserva.addEventListener('submit', evento => {
    evento.preventDefault();
    const errores = validarReserva();
    mostrarErrores(errores);

    if (errores.length === 0) {
        confirmarReserva();
    }
});

pintarCartelera(peliculas);
