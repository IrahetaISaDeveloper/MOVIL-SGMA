import { me } from "../services/authServiceStudents.js";

const API_BASE = "https://sgma-66ec41075156.herokuapp.com/api";

let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
    console.log('Iniciando registro de vehículo...');
    
    // Verificar autenticación
    try {
        const userInfo = await me();
        if (!userInfo.authenticated) {
            window.location.href = 'index.html';
            return;
        }
        currentUser = userInfo.user;
        console.log('Usuario autenticado:', currentUser);
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        window.location.href = 'index.html';
        return;
    }

    // Cargar tipos de vehículo
    await cargarTiposVehiculo();
    
    // Configurar previsualización de imagen
    configurarPrevisualización();
    
    // Configurar envío de formulario
    configurarFormulario();
});

async function cargarTiposVehiculo() {
    const selectTipo = document.getElementById('tipo');
    
    try {
        selectTipo.innerHTML = '<option value="">Cargando...</option>';
        
        const response = await fetch(`${API_BASE}/vehicleTypes/getAllVehiclesTypes`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        const tipos = data.data || [];
        
        selectTipo.innerHTML = '<option value="">Seleccionar tipo...</option>';
        
        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.vehicleTypeId;
            option.textContent = tipo.vehicleTypeName;
            selectTipo.appendChild(option);
        });
        
        console.log('Tipos de vehículo cargados:', tipos.length);
    } catch (error) {
        console.error('Error al cargar tipos:', error);
        selectTipo.innerHTML = '<option value="">Error al cargar</option>';
        Swal.fire('Error', 'No se pudieron cargar los tipos de vehículo', 'error');
    }
}

function configurarPrevisualización() {
    const fotoInput = document.getElementById('foto1');
    const vistaPrevia = document.getElementById('vista-previa-1');
    
    fotoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                vistaPrevia.src = e.target.result;
                vistaPrevia.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            vistaPrevia.src = '#';
            vistaPrevia.style.display = 'none';
        }
    });
}

function configurarFormulario() {
    const botonEnvio = document.getElementById('boton-enviar-solicitud');
    
    botonEnvio.addEventListener('click', async function(e) {
        e.preventDefault();
        await procesarRegistro();
    });
}

async function procesarRegistro() {
    // Obtener datos del formulario
    const placa = document.getElementById('placa').value.trim();
    const poliza = document.getElementById('poliza').value.trim();
    const polizaOpcional = document.getElementById('casilla-poliza-opcional').checked;
    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const tipo = document.getElementById('tipo').value;
    const color = document.getElementById('color').value.trim();
    const tarjeta = document.getElementById('tarjetaCirculacion').value.trim();
    const mantenimientoExpo = document.getElementById('mantenimientoExpo').checked;
    const fotoInput = document.getElementById('foto1');
    const aceptarTerminos = document.getElementById('aceptarTerminos').checked;
    const nombreProp = document.getElementById('dueñoVehiculo').value.trim();
    const duiProp = document.getElementById('duiDueño').value.trim();
    const telProp = document.getElementById('telDueño').value.trim();

    // Validaciones
    if (polizaOpcional && !poliza) {
        return Swal.fire('Error', 'Debe ingresar el número de póliza', 'error');
    }
    if (!polizaOpcional && !placa) {
        return Swal.fire('Error', 'Debe ingresar la placa del vehículo', 'error');
    }
    if (!marca) return Swal.fire('Error', 'Debe ingresar la marca', 'error');
    if (!modelo) return Swal.fire('Error', 'Debe ingresar el modelo', 'error');
    if (!tipo) return Swal.fire('Error', 'Debe seleccionar un tipo', 'error');
    if (!color) return Swal.fire('Error', 'Debe ingresar el color', 'error');
    if (!tarjeta) return Swal.fire('Error', 'Debe ingresar la tarjeta de circulación', 'error');
    if (!fotoInput.files[0]) return Swal.fire('Error', 'Debe subir una foto', 'error');
    if (!aceptarTerminos) return Swal.fire('Error', 'Debe aceptar los términos', 'error');
    if (!nombreProp || !duiProp || !telProp) {
        return Swal.fire('Error', 'Complete los datos del propietario', 'error');
    }

    // Mostrar loading
    Swal.fire({
        title: 'Registrando vehículo...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        // Subir imagen a Cloudinary
        const imageUrl = await subirImagen(fotoInput.files[0]);
        
        // Preparar datos del vehículo
        const vehicleData = {
            plateNumber: polizaOpcional ? null : placa,
            policyNumber: polizaOpcional ? poliza : null,
            brand: marca,
            model: modelo,
            vehicleType: { vehicleTypeId: parseInt(tipo) },
            color: color,
            circulationCard: tarjeta,
            vehicleImage: imageUrl,
            studentId: { studentId: currentUser.studentId },
            maintenanceExpo: mantenimientoExpo ? 1 : 0,
            status: 1,
            ownerName: nombreProp,
            ownerDui: duiProp,
            ownerPhone: telProp
        };

        console.log('Datos a enviar:', vehicleData);

        // Registrar vehículo
        const response = await fetch(`${API_BASE}/vehicles/newVehicle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(vehicleData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        Swal.close();
        
        if (result.data) {
            await Swal.fire('¡Éxito!', 'Vehículo registrado correctamente', 'success');
            window.location.href = 'estudiante.html';
        } else {
            throw new Error('No se recibió confirmación del registro');
        }

    } catch (error) {
        console.error('Error en el registro:', error);
        Swal.close();
        Swal.fire('Error', error.message || 'Error al registrar el vehículo', 'error');
    }
}

async function subirImagen(archivo) {
    try {
        const formData = new FormData();
        formData.append('image', archivo);
        formData.append('folder', 'vehicles');

        const response = await fetch(`${API_BASE}/cloudinary/upload-to-folder`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error al subir imagen: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.url) {
            throw new Error('No se recibió URL de la imagen');
        }

        return data.url;
    } catch (error) {
        throw new Error('Error al subir imagen: ' + error.message);
    }
}

