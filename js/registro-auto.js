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
            lanzarGlobos();
            lanzarFuegosArtificiales();
            alert('¡Solicitud enviada (simulado)! Las fotos y datos están listos para ser procesados.');
        }
    });

    casillaPoliza.addEventListener('change', actualizarEstadosPolizaYPlaca);
    aceptarTerminosCasilla.addEventListener('change', actualizarEstadoBotonEnviar);

    actualizarEstadosPolizaYPlaca();
    actualizarEstadoBotonEnviar();
});

const miEntrada = document.getElementById('placa');
const navegacionInferior = document.querySelector('.navegacion-inferior');

if (miEntrada && navegacionInferior) {
    // Se modificó la selección para excluir los checkboxes
    const todasLasEntradas = document.querySelectorAll('.mi-entrada:not([type="checkbox"])');

    todasLasEntradas.forEach(input => {
        input.addEventListener('focus', () => navegacionInferior.classList.add('oculto'));
        input.addEventListener('blur', () => navegacionInferior.classList.remove('oculto'));
    });
}

function lanzarConfeti() {
    const miLienzo = document.getElementById('lienzo-confeti');
    const instanciaConfeti = confetti.create(miLienzo, { resize: true, useWorker: true });
    instanciaConfeti({
        particleCount: 200,
        spread: 100,
        startVelocity: 40,
        gravity: 0.9,
        ticks: 200,
        scalar: 1.2,
        origin: { y: 0.3 },
        colors: ['#ffffff', '#ff007f', '#00ffff', '#ffff00', '#00ff00', '#ff4d00']
    });
}

function lanzarGlobos() {
    const contenedor = document.getElementById("contenedor-globos");
    for (let i = 0; i < 10; i++) {
        const globo = document.createElement("div");
        globo.className = "globo";
        globo.style.left = Math.random() * 90 + "%";
        globo.style.backgroundColor = obtenerColorAleatorio();
        globo.style.animationDelay = (Math.random() * 1) + "s";
        contenedor.appendChild(globo);
        setTimeout(() => contenedor.removeChild(globo), 6000);
    }
}
function obtenerColorAleatorio() {
    const colores = ["#ff0000", "#00ccff", "#ffff00", "#ff00ff", "#00ff00", "#ffa500"];
    return colores[Math.floor(Math.random() * colores.length)];
}
function lanzarFuegosArtificiales() {
    const lienzo = document.getElementById('lienzo-confeti');
    const instanciaConfeti = confetti.create(lienzo, { resize: true, useWorker: true });
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            instanciaConfeti({
                particleCount: 100,
                spread: 180,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.5
                },
                colors: ['#ffffff', '#ff4d00', '#ff00ff', '#00ffff', '#ffff00']
            });
        }, i * 500);
    }
}