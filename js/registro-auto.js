document.addEventListener('DOMContentLoaded', function () {
    const polizaCheckbox = document.getElementById('poliza-checkbox');
    const polizaInput = document.getElementById('poliza');
    const placaInput = document.getElementById('placa');
    const nivelAtencionCheckboxes = document.querySelectorAll('input[name="nivelAtencionRadio"]');
    const operacionesEfectuarSelect = document.getElementById('operacionesEfectuar1');
    const moduloRespuestaSelect = document.getElementById('moduloRespuesta');
    const acceptTermsCheckbox = document.getElementById('acceptTerms');
    const firmarBtn = document.getElementById('firmar-btn');
    const enviarSolicitudBtn = document.getElementById('enviar-solicitud-btn');

    const photoInputs = [
        { input: document.getElementById('foto1'), preview: document.getElementById('preview1') },
        { input: document.getElementById('foto2'), preview: document.getElementById('preview2') },
        { input: document.getElementById('foto3'), preview: document.getElementById('preview3') },
        { input: document.getElementById('foto4'), preview: document.getElementById('preview4') }
    ];

    function handlePhotoChange(event) {
        const input = event.target;
        const preview = photoInputs.find(item => item.input === input).preview;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };

            reader.readAsDataURL(input.files[0]);
        } else {
            preview.src = '#';
            preview.style.display = 'none';
        }
        updateSendButtonState();
    }

    photoInputs.forEach(item => {
        item.input.addEventListener('change', handlePhotoChange);
    });

    function areAllPhotosTaken() {
        return photoInputs.every(item => item.input.files && item.input.files.length > 0);
    }

    function updatePolizaAndPlacaStates() {
        if (polizaCheckbox.checked) {
            polizaInput.disabled = true;
            polizaInput.value = '';
            polizaInput.placeholder = 'No aplica';
            placaInput.disabled = true;
            placaInput.value = '';
            placaInput.placeholder = 'No aplica';
        } else {
            polizaInput.disabled = false;
            polizaInput.placeholder = 'N° de póliza';
            placaInput.disabled = false;
            placaInput.placeholder = 'N° de placa';
        }
    }

    function handleNivelAtencionCheckbox(event) {
        nivelAtencionCheckboxes.forEach(checkbox => {
            if (checkbox !== event.target) checkbox.checked = false;
        });

        const selectedNivel = event.target.value;
        moduloRespuestaSelect.innerHTML = '<option value="">Escribe</option>';

        switch (selectedNivel) {
            case '1er_anio':
                addOptions(moduloRespuestaSelect, ['Seguridad e Higiene Ocupacional', 'Mantenimiento Preventivo y Correctivo de Motores', 'Sistema de Suspensión y Dirección', 'Sistema de Frenos', 'Sistema Eléctrico Automotriz']);
                break;
            case '2do_anio':
                addOptions(moduloRespuestaSelect, ['Diagnóstico y Reparación de Sistemas de Inyección', 'Transmisiones Automáticas y Mecánicas', 'Mantenimiento de Sistemas de Climatización', 'Electrónica Automotriz Avanzada']);
                break;
            case '3er_anio':
                addOptions(moduloRespuestaSelect, ['Gestión de Taller y Servicio al Cliente', 'Mantenimiento de Vehículos Híbridos y Eléctricos', 'Sistemas de Confort y Seguridad', 'Mecatrónica Automotriz']);
                break;
        }
    }

    function addOptions(selectElement, options) {
        options.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            selectElement.appendChild(option);
        });
    }

    function updateButtonStates() {
        firmarBtn.disabled = !acceptTermsCheckbox.checked;
        enviarSolicitudBtn.disabled = true;
        firmarBtn.style.backgroundColor = acceptTermsCheckbox.checked ? '#881F1E' : '#555555';
        firmarBtn.style.cursor = acceptTermsCheckbox.checked ? 'pointer' : 'not-allowed';
        enviarSolicitudBtn.style.backgroundColor = '#555555';
        enviarSolicitudBtn.style.cursor = 'not-allowed';
    }

    function updateSendButtonState() {
        if (acceptTermsCheckbox.checked && firmarBtn.disabled && areAllPhotosTaken()) {
            enviarSolicitudBtn.disabled = false;
            enviarSolicitudBtn.style.backgroundColor = '#881F1E';
            enviarSolicitudBtn.style.cursor = 'pointer';
        } else {
            enviarSolicitudBtn.disabled = true;
            enviarSolicitudBtn.style.backgroundColor = '#555555';
            enviarSolicitudBtn.style.cursor = 'not-allowed';
        }
    }

    firmarBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (!firmarBtn.disabled) {
            firmarBtn.disabled = true;
            firmarBtn.style.backgroundColor = '#555555';
            firmarBtn.style.cursor = 'not-allowed';
            updateSendButtonState();
        }
    });

    enviarSolicitudBtn.addEventListener('click', function (event) {
        if (!enviarSolicitudBtn.disabled) {
            lanzarGlobos();
            lanzarFuegosArtificiales();
            alert('¡Solicitud enviada (simulado)! Las fotos y datos están listos para ser procesados.');
        }
    });

    polizaCheckbox.addEventListener('change', updatePolizaAndPlacaStates);
    nivelAtencionCheckboxes.forEach(checkbox => checkbox.addEventListener('change', handleNivelAtencionCheckbox));
    acceptTermsCheckbox.addEventListener('change', updateButtonStates);

    updatePolizaAndPlacaStates();
    updateButtonStates();
    moduloRespuestaSelect.innerHTML = '<option value="">Escribe</option>';
});

// NAV oculto con input
const myInput = document.getElementById('myInput');
const bottomNav = document.getElementById('bottomNav');
if (myInput && bottomNav) {
    myInput.addEventListener('focus', () => bottomNav.classList.add('hidden'));
    myInput.addEventListener('blur', () => bottomNav.classList.remove('hidden'));
}

// Modal Firma Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX || e.touches[0].clientX) - rect.left,
        y: (e.clientY || e.touches[0].clientY) - rect.top
    };
}
function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}
function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}
function stopDrawing(e) {
    e.preventDefault();
    isDrawing = false;
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

function abrirModal() {
    const modal = document.getElementById('modalFirma');
    const contenido = modal.querySelector('.modal-contenido');
    contenido.classList.remove('explosion');
    modal.style.display = 'block';
}
function cerrarModal() {
    const modal = document.getElementById('modalFirma');
    const contenido = modal.querySelector('.modal-contenido');
    contenido.classList.add('explosion');
    setTimeout(() => {
        modal.style.display = 'none';
        contenido.classList.remove('explosion');
    }, 600);
}
function enviarFirma() {
    lanzarConfeti();
    setTimeout(() => cerrarModal(), 2000);
}

function lanzarConfeti() {
    const myCanvas = document.getElementById('confettiCanvas');
    const confettiInstance = confetti.create(myCanvas, { resize: true, useWorker: true });
    confettiInstance({
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
    const container = document.getElementById("globos-container");
    for (let i = 0; i < 10; i++) {
        const globo = document.createElement("div");
        globo.className = "globo";
        globo.style.left = Math.random() * 90 + "%";
        globo.style.backgroundColor = getColorAleatorio();
        globo.style.animationDelay = (Math.random() * 1) + "s";
        container.appendChild(globo);
        setTimeout(() => container.removeChild(globo), 6000);
    }
}
function getColorAleatorio() {
    const colores = ["#ff0000", "#00ccff", "#ffff00", "#ff00ff", "#00ff00", "#ffa500"];
    return colores[Math.floor(Math.random() * colores.length)];
}
function lanzarFuegosArtificiales() {
    const canvas = document.getElementById('confettiCanvas');
    const confettiInstance = confetti.create(canvas, { resize: true, useWorker: true });
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            confettiInstance({
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
