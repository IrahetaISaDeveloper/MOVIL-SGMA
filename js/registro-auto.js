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
            Swal.fire({
                icon: 'success',
                title: 'Solicitud enviada',
                text: 'La solicitud se envió correctamente. Ahora debes esperar que los administradores la acepten para poder registrar la entrada y la orden de trabajo.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = 'mis-trabajos.html';
            });
        } else {
            Swal.fire('Error al registrar el vehículo', '', 'error');
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
            if (select && data && data.data && Array.isArray(data.data.content)) {
                select.innerHTML = '<option value="">Seleccione un estudiante</option>';
                data.data.content.forEach(est => {
                    select.innerHTML += `<option value="${est.studentId}">${est.firstName} ${est.lastName}</option>`;
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
    // Validaciones
    const ownerDui = document.getElementById('duiDueño').value;
    const brand = document.getElementById('marca').value;
    const model = document.getElementById('modelo').value;
    const circulationCardNumber = document.getElementById('tarjetaCirculacion').value;
    const vehicleImage = document.getElementById('foto1').value;
    // Usar SweetAlert para validaciones
    if (!ownerDui || !/^\d{8}-\d{1}$/.test(ownerDui)) {
        Swal.fire('Error', 'El DUI debe tener el formato 12345678-9.', 'error');
        return;
    }
    if (plateNumber && !/^[A-Z]{1,3}[0-9]{3,4}$/.test(plateNumber)) {
        Swal.fire('Error', 'La placa debe tener el formato ABC1234.', 'error');
        return;
    }
    if (brand.length < 3) {
        Swal.fire('Error', 'La marca debe tener al menos 3 caracteres.', 'error');
        return;
    }
    if (model.length < 3) {
        Swal.fire('Error', 'El modelo debe tener al menos 3 caracteres.', 'error');
        return;
    }
    if (circulationCardNumber.length < 8) {
        Swal.fire('Error', 'El número de tarjeta de circulación debe tener al menos 8 dígitos.', 'error');
        return;
    }
    if (!vehicleImage) {
        Swal.fire('Error', 'La imagen del vehículo es obligatoria.', 'error');
        return;
    }
    // Validar aceptación de términos y condiciones
    const terminosCheckbox = document.getElementById('aceptarTerminos');
    if (!terminosCheckbox || !terminosCheckbox.checked) {
        Swal.fire('Debes aceptar los términos y condiciones para continuar.', '', 'warning');
        return;
    }
    // Obtener valor de mantenimiento EXPO
    const mantenimientoExpoCheckbox = document.getElementById('mantenimientoExpo');
    const mantenimientoEXPO = (mantenimientoExpoCheckbox && mantenimientoExpoCheckbox.checked) ? 1 : 0;
    // Validar vehicleId
    const vehicleId = 1; // Debe ser mayor que 0, puedes ajustar según tu lógica
    const dataVehiculo = {
        vehicleId: vehicleId,
        plateNumber: plateNumber,
        hasPolicy: polizaCheckbox.checked ? 1 : 0,
        policyNumber: policyNumber,
        brand: brand,
        model: model,
        typeId: 1,
        color: document.getElementById('color').value,
        circulationCardNumber: circulationCardNumber,
        ownerName: document.getElementById('dueñoVehiculo').value,
        ownerDui: ownerDui,
        ownerPhone: document.getElementById('telDueño').value,
        vehicleImage: vehicleImage,
        studentId: estudianteId,
        maintenanceEXPO: mantenimientoEXPO,
        idStatus: 1,
        typeName: document.getElementById('tipo').value,
        studentName: '',
        studentLastName: '',
    };
    agregarVehiculo(dataVehiculo);
}