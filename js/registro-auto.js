document.addEventListener('DOMContentLoaded', function () {
    const casillaPoliza = document.getElementById('casilla-poliza');
    const entradaPoliza = document.getElementById('poliza');
    const entradaPlaca = document.getElementById('placa');
    const aceptarTerminosCasilla = document.getElementById('aceptarTerminos');
    const botonEnviarSolicitud = document.getElementById('boton-enviar-solicitud');

    
    const entradaMarca = document.getElementById('marca');
    const entradaModelo = document.getElementById('modelo');
    const entradaTipo = document.getElementById('tipo');
    const entradaColor = document.getElementById('color');
    const entradaTarjetaCirculacion = document.getElementById('tarjetaCirculacion');

   
    const entradaInstructorResponsable = document.getElementById('instructorResponsable');
    const entradaEstudianteAsignado = document.getElementById('estudianteAsignado');
    const entradaCarnet = document.getElementById('carnet');
    const entradaOperacionesEfectuar1 = document.getElementById('operacionesEfectuar1');
    const entradaModuloRespuesta = document.getElementById('moduloRespuesta');
    const checkboxTipoOperacion = document.querySelectorAll('input[name="tipoOperacion"]');
    const entradaTiempoEstimado = document.getElementById('tiempoEstimado');

    
    const entradaDueñoVehiculo = document.getElementById('dueñoVehiculo');
    const entradaDuiDueño = document.getElementById('duiDueño');
    const entradaTelDueño = document.getElementById('telDueño');

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
        actualizarEstadoBotonEnviar(); 
    }

    
    function validarCampos() {
        let valid = true;
        let errorMessage = [];

        
        if (!casillaPoliza.checked) {
            if (entradaPlaca.value.trim() === '') {
                valid = false;
                errorMessage.push('El campo "Placa" es obligatorio.');
            } else if (!/^[A-Z0-9]{1,}-[0-9]{3,}$/.test(entradaPlaca.value.trim())) { 
                valid = false;
                errorMessage.push('El formato de "Placa" no es válido (ej: P123-456).');
            }

            if (entradaPoliza.value.trim() === '') {
                valid = false;
                errorMessage.push('El campo "Póliza" es obligatorio.');
            } else if (!/^[A-Z0-9]{1,}-[0-9]{3,}$/.test(entradaPoliza.value.trim())) { 
                valid = false;
                errorMessage.push('El formato de "Póliza" no es válido (ej: P123-456).');
            }
        }
        
        if (entradaMarca.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Marca" es obligatorio.');
        }
        if (entradaModelo.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Modelo" es obligatorio.');
        }
        if (entradaTipo.value === '') {
            valid = false;
            errorMessage.push('Debe seleccionar un "Tipo" de vehículo.');
        }
        if (entradaColor.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Color" es obligatorio.');
        }
        if (entradaTarjetaCirculacion.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Tarjeta de circulación" es obligatorio.');
        } else if (!/^[0-9]\/[0-9]{8}$/.test(entradaTarjetaCirculacion.value.trim())) {
            valid = false;
            errorMessage.push('El formato de "Tarjeta de circulación" no es válido (ej: 0/12345678).');
        }


        
        if (entradaInstructorResponsable.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Instructor responsable" es obligatorio.');
        }
        if (entradaEstudianteAsignado.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Estudiante asignado" es obligatorio.');
        }
        if (entradaCarnet.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Carnet" es obligatorio.');
        } else if (!/^[0-9]{8}$/.test(entradaCarnet.value.trim())) { 
            valid = false;
            errorMessage.push('El formato de "Carnet" no es válido (ej: 20260669 - 8 dígitos numéricos).');
        }
        if (entradaOperacionesEfectuar1.value === '') {
            valid = false;
            errorMessage.push('Debe seleccionar al menos una "Operación a efectuar".');
        }
        if (entradaModuloRespuesta.value === '') {
            valid = false;
            errorMessage.push('Debe seleccionar un "Módulo al que da respuesta la práctica".');
        }
        let tipoOperacionChecked = Array.from(checkboxTipoOperacion).some(checkbox => checkbox.checked);
        if (!tipoOperacionChecked) {
            valid = false;
            errorMessage.push('Debe seleccionar al menos un "Tipo de Operación" (Preventivo o Correctivo).');
        }
        if (entradaTiempoEstimado.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Tiempo estimado del proceso" es obligatorio.');
        } else if (!/^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/.test(entradaTiempoEstimado.value.trim())) { 
            valid = false;
            errorMessage.push('El formato de "Tiempo estimado" no es válido (ej: 00:00 o 23:59).');
        }

       
        if (!estanTodasLasFotosTomadas()) {
            valid = false;
            errorMessage.push('Debe subir las 4 fotos del vehículo.');
        }

        
        if (entradaDueñoVehiculo.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Nombre del propietario del vehículo" es obligatorio.');
        }
        if (entradaDuiDueño.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Documento único de identidad" es obligatorio.');
        } else if (!/^[0-9]{7}-[0-9]$/.test(entradaDuiDueño.value.trim())) { 
            valid = false;
            errorMessage.push('El formato de "DUI" no es válido (ej: 0000000-0).');
        }
        if (entradaTelDueño.value.trim() === '') {
            valid = false;
            errorMessage.push('El campo "Teléfono del propietario del vehículo" es obligatorio.');
        } else if (!/^[0-9]{4}-[0-9]{4}$/.test(entradaTelDueño.value.trim())) { 
            valid = false;
            errorMessage.push('El formato de "Teléfono" no es válido (ej: 0000-0000).');
        }

        if (!aceptarTerminosCasilla.checked) {
            valid = false;
            errorMessage.push('Debe aceptar los términos y condiciones para enviar la solicitud.');
        }

        if (!valid) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Validación',
                html: errorMessage.join('<br>'),
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                }
            });
        }
        return valid;
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
            if (validarCampos()) {
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud enviada!',
                    text: 'Las fotos y datos están listos para ser procesados.',
                    customClass: {
                        popup: 'swal-custom-popup',
                        title: 'swal-custom-title',
                        content: 'swal-custom-content',
                        confirmButton: 'swal-custom-confirm-button'
                    }
                });
            }
        }
    });

    casillaPoliza.addEventListener('change', actualizarEstadosPolizaYPlaca);
    aceptarTerminosCasilla.addEventListener('change', actualizarEstadoBotonEnviar);


    const allFormInputs = [
        entradaPoliza, entradaPlaca, entradaMarca, entradaModelo, entradaTipo, entradaColor,
        entradaTarjetaCirculacion, entradaInstructorResponsable, entradaEstudianteAsignado,
        entradaCarnet, entradaOperacionesEfectuar1, entradaModuloRespuesta, entradaTiempoEstimado,
        entradaDueñoVehiculo, entradaDuiDueño, entradaTelDueño
    ];

    allFormInputs.forEach(input => {
        if (input) { 
            input.addEventListener('input', actualizarEstadoBotonEnviar);
        }
    });

    checkboxTipoOperacion.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarEstadoBotonEnviar);
    });

    


    actualizarEstadosPolizaYPlaca();
    actualizarEstadoBotonEnviar();
});

const navegacionInferior = document.querySelector('.bottom-nav'); 

if (navegacionInferior) {
    // Select all inputs with 'mi-entrada' that are NOT type 'checkbox' or 'file'
    // and also include 'select' elements that are not checkboxes
    // NOTE: This part is for the bottom navigation hiding, which might still be relevant.
    // The previous fix for updating button state uses specific IDs for broader coverage.
    const todasLasEntradasParaNav = document.querySelectorAll('.mi-entrada:not([type="checkbox"]):not([type="file"]), select.mi-entrada');

    todasLasEntradasParaNav.forEach(input => {
        input.addEventListener('focus', () => navegacionInferior.classList.add('oculto'));
        input.addEventListener('blur', () => navegacionInferior.classList.remove('oculto'));
    });
}


function obtenerColorAleatorio() {
    const colores = ["#ff0000", "#00ccff", "#ffff00", "#ff00ff", "#00ff00", "#ffa500"];
    return colores[Math.floor(Math.random() * colores.length)];
}