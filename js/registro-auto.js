document.addEventListener('DOMContentLoaded', function () {
    const casillaPoliza = document.getElementById('casilla-poliza');
    const entradaPoliza = document.getElementById('poliza');
    const entradaPlaca = document.getElementById('placa');
    const aceptarTerminosCasilla = document.getElementById('aceptarTerminos');
    const botonEnviarSolicitud = document.getElementById('boton-enviar-solicitud');

    const entradasFoto = [
        { entrada: document.getElementById('foto1'), vistaPrevia: document.getElementById('vista-previa-1') },
        { entrada: document.getElementById('foto2'), vistaPrevia: document.getElementById('vista-previa-2') },
        { entrada: document.getElementById('foto3'), vistaPrevia: document.getElementById('vista-previa-3') },
        { entrada: document.getElementById('foto4'), vistaPrevia: document.getElementById('vista-previa-4') }
    ];

    function manejarCambioFoto(evento) {
        const entrada = evento.target;
        const vistaPrevia = entradasFoto.find(item => item.entrada === entrada).vistaPrevia;

        if (entrada.files && entrada.files[0]) {
            const lector = new FileReader();

            lector.onload = function (e) {
                vistaPrevia.src = e.target.result;
                vistaPrevia.style.display = 'block';
            };

            lector.readAsDataURL(entrada.files[0]);
        } else {
            vistaPrevia.src = '#';
            vistaPrevia.style.display = 'none';
        }
        actualizarEstadoBotonEnviar();
    }

    entradasFoto.forEach(item => {
        item.entrada.addEventListener('change', manejarCambioFoto);
    });

    function estanTodasLasFotosTomadas() {
        return entradasFoto.every(item => item.entrada.files && item.entrada.files.length > 0);
    }

    function actualizarEstadosPolizaYPlaca() {
        if (casillaPoliza.checked) {
            entradaPoliza.disabled = true;
            entradaPoliza.value = '';
            entradaPoliza.placeholder = 'No aplica';
            entradaPlaca.disabled = true;
            entradaPlaca.value = '';
            entradaPlaca.placeholder = 'No aplica';
        } else {
            entradaPoliza.disabled = false;
            entradaPoliza.placeholder = 'N° de póliza';
            entradaPlaca.disabled = false;
            entradaPlaca.placeholder = 'N° de placa';
        }
    }

    function actualizarEstadoBotonEnviar() {
        if (aceptarTerminosCasilla.checked && estanTodasLasFotosTomadas()) {
            botonEnviarSolicitud.disabled = false;
            botonEnviarSolicitud.style.backgroundColor = '#881F1E';
            botonEnviarSolicitud.style.cursor = 'pointer';
        } else {
            botonEnviarSolicitud.disabled = true;
            botonEnviarSolicitud.style.backgroundColor = '#555555';
            botonEnviarSolicitud.style.cursor = 'not-allowed';
        }
    }

    botonEnviarSolicitud.addEventListener('click', function (evento) {
        if (!botonEnviarSolicitud.disabled) {
            // Uncomment these lines if you have the functions defined elsewhere for effects
            // lanzarGlobos();
            // lanzarFuegosArtificiales();
            alert('¡Solicitud enviada! Las fotos y datos están listos para ser procesados.');
        }
    });

    casillaPoliza.addEventListener('change', actualizarEstadosPolizaYPlaca);
    aceptarTerminosCasilla.addEventListener('change', actualizarEstadoBotonEnviar);

    actualizarEstadosPolizaYPlaca();
    actualizarEstadoBotonEnviar();
});

const navegacionInferior = document.querySelector('.navegacion-inferior');

if (navegacionInferior) {
    // Select all inputs with 'mi-entrada' that are NOT type 'checkbox' or 'file'
    // and also include 'select' elements that are not checkboxes
    const todasLasEntradas = document.querySelectorAll('.mi-entrada:not([type="checkbox"]):not([type="file"]), select.mi-entrada');

    todasLasEntradas.forEach(input => {
        input.addEventListener('focus', () => navegacionInferior.classList.add('oculto'));
        input.addEventListener('blur', () => navegacionInferior.classList.remove('oculto'));
    });
}


function obtenerColorAleatorio() {
    const colores = ["#ff0000", "#00ccff", "#ffff00", "#ff00ff", "#00ff00", "#ffa500"];
    return colores[Math.floor(Math.random() * colores.length)];
}