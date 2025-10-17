import { me } from "./services/authServiceStudents.js";
// Elemento donde se mostrarán las tarjetas
const trabajosContainer = document.getElementById('trabajos-container');

// Función para mostrar tarjetas de carga
function mostrarTarjetasCargando(cantidad = 3) {
    trabajosContainer.innerHTML = '';
    for (let i = 0; i < cantidad; i++) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-cargando';
        tarjeta.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">...</h5>
                    <p class="card-text">...</p>
                    <p class="card-text">...</p>
                </div>
            </div>
        `;
        trabajosContainer.appendChild(tarjeta);
    }
}

// Función para renderizar tarjetas con datos reales
function renderizarTarjetas(vehiculos) {
    trabajosContainer.innerHTML = '';
    if (vehiculos.length === 0) {
        trabajosContainer.innerHTML = '<p>No hay trabajos para mostrar.</p>';
        return;
    }
    vehiculos.forEach(v => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-vehiculo';
        tarjeta.innerHTML = `
            <div class="card">
                <img src="${v.vehicleImage || 'placeholder.jpg'}" class="card-img-top" alt="Imagen del vehículo">
                <div class="card-body">
                    <h5 class="card-title">${v.brand} ${v.model}</h5>
                    <p class="card-text">Placa: ${v.plateNumber}</p>
                    <p class="card-text">Color: ${v.color}</p>
                    <p class="card-text">Propietario: ${v.ownerName}</p>
                </div>
            </div>
        `;
        trabajosContainer.appendChild(tarjeta);
    });
}

// Función principal para cargar los trabajos
async function cargarTrabajos() {
    mostrarTarjetasCargando();
    try {
        const usuario = await me();
        const studentId = usuario?.student?.id;
        if (!studentId) {
            trabajosContainer.innerHTML = '<p>No se pudo obtener el ID del estudiante.</p>';
            return;
        }

        const res = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/vehicles/getVehiclesByStudentId/${studentId}`, {
            credentials: 'include'
        });
        const data = await res.json();

        // ✅ Ajuste: el backend devuelve "vehiculos", no "vehicles"
        const vehiculos = data.data?.vehiculos?.filter(v => v.idStatus === 3) || [];
        renderizarTarjetas(vehiculos);

    } catch (error) {
        console.error(error);
        trabajosContainer.innerHTML = '<p>Error al cargar los trabajos.</p>';
    }
}


// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', cargarTrabajos);