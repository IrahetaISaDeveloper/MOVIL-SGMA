// Elemento donde se mostrarán las tarjetas
const trabajosContainer = document.getElementById('trabajos-container');

// Obtener el ID del usuario logueado (ajusta según tu sistema de autenticación)
const studentId = localStorage.getItem('studentId');

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
        const res = await fetch('http://localhost:8080/api/vehicles/getDataVehicles');
        const data = await res.json();
        // Filtrar por idStatus = 3 y studentId del usuario logueado
        const vehiculos = data.filter(v => v.idStatus === 3 && v.studentId == studentId);
        renderizarTarjetas(vehiculos);
    } catch (error) {
        trabajosContainer.innerHTML = '<p>Error al cargar los trabajos.</p>';
    }
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', cargarTrabajos);