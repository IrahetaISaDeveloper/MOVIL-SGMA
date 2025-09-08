function agregarVehiculo(dataVehiculo) {
    fetch('http://localhost:8080/api/vehicles/addNewVehicle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataVehiculo)
    })
    .then(response => response.json())
    .then(result => {
        if (result && result.success) {
            alert('Vehículo registrado exitosamente');
        } else {
            alert('Error al registrar el vehículo');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    });
}

// Actualiza los campos placa/póliza según el checkbox
function actualizarCamposPlacaPoliza() {
    const polizaInput = document.getElementById('poliza');
    const placaInput = document.getElementById('placa');
    const polizaCheckbox = document.getElementById('casilla-poliza-opcional');
    if (polizaCheckbox.checked) {
        polizaInput.disabled = false;
        placaInput.disabled = true;
        placaInput.value = '';
    } else {
        polizaInput.disabled = true;
        polizaInput.value = '';
        placaInput.disabled = false;
    }
}

function cargarEstudiantes() {
    fetch('http://localhost:8080/api/students/getDataStudents')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('estudianteAsignado');
            if (select && Array.isArray(data)) {
                select.innerHTML = '<option value="">Seleccione un estudiante</option>';
                data.forEach(est => {
                    select.innerHTML += `<option value="${est.studentId}">${est.studentName} ${est.studentLastName}</option>`;
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar estudiantes:', error);
        });
}

window.addEventListener('DOMContentLoaded', function() {
    const polizaCheckbox = document.getElementById('casilla-poliza-opcional');
    if (polizaCheckbox) {
        polizaCheckbox.addEventListener('change', actualizarCamposPlacaPoliza);
        actualizarCamposPlacaPoliza();
    }
    const boton = document.getElementById('boton-enviar-solicitud');
    if (boton) {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            registrarVehiculoDesdeFormulario();
        });
    }
    cargarEstudiantes();
});

// Variable global para el id del usuario logueado
let studentId = null; // Asigna el valor real desde tu sistema de login, por ejemplo: localStorage.getItem('studentId')

function registrarVehiculoDesdeFormulario() {
    const polizaCheckbox = document.getElementById('casilla-poliza-opcional');
    let plateNumber = '';
    let policyNumber = null;
    if (polizaCheckbox.checked) {
        policyNumber = document.getElementById('poliza').value;
    } else {
        plateNumber = document.getElementById('placa').value;
    }
    const estudianteSelect = document.getElementById('estudianteAsignado');
    const estudianteId = estudianteSelect ? parseInt(estudianteSelect.value) : null;
    const dataVehiculo = {
        vehicleId: 0,
        plateNumber: plateNumber,
        hasPolicy: polizaCheckbox.checked ? 1 : 0,
        policyNumber: policyNumber,
        brand: document.getElementById('marca').value,
        model: document.getElementById('modelo').value,
        typeId: 1,
        color: document.getElementById('color').value,
        circulationCardNumber: document.getElementById('tarjetaCirculacion').value,
        ownerName: document.getElementById('dueñoVehiculo').value,
        ownerDui: document.getElementById('duiDueño').value,
        ownerPhone: document.getElementById('telDueño').value,
        vehicleImage: document.getElementById('foto1').value,
        studentId: estudianteId, // Usar el id seleccionado
        maintenanceEXPO: 0,
        idStatus: 1,
        typeName: document.getElementById('tipo').value,
        studentName: '',
        studentLastName: '',
    };
    agregarVehiculo(dataVehiculo);
}