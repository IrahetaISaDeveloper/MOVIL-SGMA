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

// Función para renderizar tarjetas con datos reales de órdenes de trabajo
function renderizarTarjetas(ordenes) {
    trabajosContainer.innerHTML = '';
    if (ordenes.length === 0) {
        trabajosContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <h3>No hay órdenes de trabajo</h3>
                <p>Una vez que crees órdenes de trabajo, aparecerán aquí.</p>
                <a href="ordenes-trabajo.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Crear Nueva Orden
                </a>
            </div>
        `;
        return;
    }
    
    ordenes.forEach(orden => {
        // Mapear estado numérico a texto
        const getStatusText = (idStatus) => {
            switch(idStatus) {
                case 1: return 'Pendiente';
                case 2: return 'En Proceso';
                case 3: return 'Completado';
                case 4: return 'Cancelado';
                default: return 'Desconocido';
            }
        };

        const statusText = getStatusText(orden.idStatus);
        const statusClass = statusText.toLowerCase().replace(' ', '-');
        
        // Manejar campos que pueden ser null o undefined
        const vehiclePlate = orden.vehiclePlateNumber || 'Vehículo no especificado';
        const moduleName = orden.moduleName || 'Sin módulo asignado';
        const estimatedTime = orden.estimatedTime ? `${orden.estimatedTime} horas` : 'Tiempo no especificado';
        const hasImage = orden.workOrderImage && 
                        orden.workOrderImage !== 'sin_imagen' && 
                        orden.workOrderImage !== null && 
                        orden.workOrderImage.trim() !== '';

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-orden';
        tarjeta.innerHTML = `
            <div class="card orden-card">
                ${hasImage ? `
                    <img src="${orden.workOrderImage}" class="card-img-top" alt="Imagen de orden" 
                         style="height: 200px; object-fit: cover;" onerror="this.style.display='none';">
                ` : ''}
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">Orden #${orden.workOrderId}</h5>
                        <span class="badge estado-${statusClass}">${statusText}</span>
                    </div>
                    <p class="card-text">
                        <i class="fas fa-car"></i> <strong>Vehículo:</strong> ${vehiclePlate}
                    </p>
                    <p class="card-text">
                        <i class="fas fa-book"></i> <strong>Módulo:</strong> ${moduleName}
                    </p>
                    <p class="card-text">
                        <i class="fas fa-clock"></i> <strong>Tiempo estimado:</strong> ${estimatedTime}
                    </p>
                    <p class="card-text">
                        <i class="fas fa-image"></i> <strong>Imagen:</strong> ${hasImage ? 'Sí' : 'No'}
                    </p>
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

        console.log('Cargando órdenes de trabajo del estudiante:', studentId);
        
        const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/workOrders/getWorkOrdersByStudentId/${studentId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta de órdenes de trabajo:', data);

        // Extraer órdenes según la estructura del API
        let ordenes = [];
        if (data.workOrders && Array.isArray(data.workOrders)) {
            ordenes = data.workOrders;
        }

        console.log('Órdenes extraídas:', ordenes);
        console.log('Cantidad de órdenes:', ordenes.length);
        
        renderizarTarjetas(ordenes);

    } catch (error) {
        console.error('Error al cargar órdenes de trabajo:', error);
        trabajosContainer.innerHTML = '<p>Error al cargar las órdenes de trabajo.</p>';
    }
}


// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', cargarTrabajos);