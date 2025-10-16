import { me } from './services/AuthInstructors/authInstructorService.js';

let allVehicles = [];
let userRole = null;
let selectedVehicleId = null;
let vehiculoSeleccionado = null;

// Obtiene información del usuario autenticado
async function getUserInfo() {
    try {
        const userInfo = await me();
        if (userInfo.authenticated && userInfo.instructor && userInfo.instructor.role) {
            userRole = userInfo.instructor.role;
            handleSidebarVisibility(); 
            updateSidebarTitle(); 
            return userInfo.instructor;
        }
        return null;
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        return null;
    }
}

// Actualiza el título del sidebar según el rol
function updateSidebarTitle() {
    const sidebarTitle = document.getElementById('sidebar-title');
    if (sidebarTitle && userRole) {
        if (userRole === 'Animador') {
            sidebarTitle.textContent = 'Pendientes de Revisión';
        } else if (userRole === 'Coordinador') {
            sidebarTitle.textContent = 'En Revisión';
        }
    }
}

// Controla la visibilidad del sidebar según el rol
function handleSidebarVisibility() {
    const sidebar = document.querySelector('.panel-lateral');
    const contenidoLayout = document.querySelector('.contenido-layout');
    
    if (userRole === 'Docente') {
        if (sidebar) {
            sidebar.style.display = 'none';
        }
        if (contenidoLayout) {
            contenidoLayout.style.display = 'block';
        }
    } else {
        if (sidebar) {
            sidebar.style.display = 'block';
        }
    }
}

// Convierte ID de estado a texto legible
function getStatusText(statusId) {
    switch(statusId) {
        case 1:
            return 'En espera de aprobación del animador';
        case 2:
            return 'En espera de aprobación del coordinador';
        case 3:
            return 'Vehículo aprobado';
        case 4:
            return 'Vehículo rechazado';
        default:
            return 'Estado desconocido';
    }
}

// Obtiene la clase de estilo para el badge
function getStatusClass(statusId) {
    switch(statusId) {
        case 1:
        case 2:
            return 'estado-pendiente';
        case 3:
            return 'estado-completado';
        case 4:
            return 'estado-rechazado';
        default:
            return 'estado-pendiente';
    }
}

// Renderiza la tabla de vehículos
function renderVehiclesTable(vehicles) {
    window.__listaVehiculos = vehicles;
    const tbody = document.querySelector('.tabla-moderna tbody');
    
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla de vehículos.');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;">No se encontraron vehículos.</td></tr>`;
        return;
    }
    
    vehicles.forEach(vehicle => {
        const estudiante = (vehicle.studentName || '-') + ' ' + (vehicle.studentLastName || '');
        let imgSrc = vehicle.vehicleImage;
        if (!imgSrc || imgSrc === 'null' || imgSrc === null) {
            imgSrc = 'imgs/default-car.png';
        }
        
        const statusText = getStatusText(vehicle.idStatus);
        const statusClass = getStatusClass(vehicle.idStatus);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="checkbox-row"></td>
            <td>${vehicle.plateNumber || '-'}</td>
            <td>${vehicle.brand || '-'}</td>
            <td>${vehicle.model || '-'}</td>
            <td>${vehicle.typeName || '-'}</td>
            <td><span class="estado-badge ${statusClass}">${statusText}</span></td>
            <td>${estudiante.trim() || '-'}</td>
            <td>${vehicle.ownerName || '-'}</td>
            <td>${vehicle.ownerPhone || '-'}</td>
            <td><img src="${imgSrc}" alt="Imagen" class="vehiculo-img"></td>
            <td>
                <div class="acciones-vehiculo">
                    <button class="btn-accion" title="Ver detalles" onclick="showVehicleModal(${vehicle.vehicleId})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Renderiza vehículos pendientes en la lista lateral
function renderSidebarPendingVehicles(vehicles) {
    const lista = document.querySelector('.tarjeta-sidebar .lista-registros');
    const badge = document.querySelector('.tarjeta-sidebar .badge-contador');
    if (!lista) return;
    
    let pendientes = [];
    if (userRole === 'Animador') {
        pendientes = vehicles.filter(v => v.idStatus === 1);
    } else if (userRole === 'Coordinador') {
        pendientes = vehicles.filter(v => v.idStatus === 2);
    } else {
        pendientes = vehicles.filter(v => v.idStatus === 1);
    }
    
    if (badge) badge.textContent = pendientes.length;
    lista.innerHTML = '';
    
    if (pendientes.length === 0) {
        lista.innerHTML = '<div style="text-align:center;color:#888;">No hay vehículos pendientes.</div>';
        return;
    }
    
    pendientes.forEach(vehicle => {
        let imgSrc = vehicle.vehicleImage;
        if (!imgSrc || imgSrc === 'null' || imgSrc === null) {
            imgSrc = 'imgs/default-car.png';
        }
        
        const div = document.createElement('div');
        div.className = 'item-registro';
        div.__vehiculoData = vehicle;
        div.innerHTML = `
            <img src="${imgSrc}" alt="Vehículo" class="vehiculo-imagen" onerror="this.src='imgs/default-car.png'">
            <div class="info-vehiculo">
                <span class="placa-vehiculo">${vehicle.plateNumber || 'Sin placa'}</span>
                <span class="servicio-vehiculo">${vehicle.model || 'Modelo no especificado'}</span>
                <span class="fecha-vehiculo">${vehicle.brand || 'Marca no especificada'}</span>
            </div>
            <div class="acciones-vehiculo">
                <button class="btn-opciones" title="Más opciones">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;
        
        div.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-opciones')) {
                showVehicleModal(vehicle.vehicleId);
            }
        });
        
        lista.appendChild(div);
    });
}

// Obtiene todos los vehículos - usando la API correcta
function fetchAllVehicles() {
    console.log('Ejecutando fetchAllVehicles...');
    
    fetch('https://sgma-66ec41075156.herokuapp.com/api/vehicles/getAllVehicles', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        console.log('Respuesta recibida de la API:', res);
        return res.json();
    })
    .then(data => {
        let vehicles = [];
        if (data && data.data && Array.isArray(data.data.content)) {
            vehicles = data.data.content;
        } else if (Array.isArray(data)) {
            vehicles = data;
        } else if (data && Array.isArray(data.content)) {
            vehicles = data.content;
        } else if (data && typeof data === 'object') {
            vehicles = [data];
        }
        
        if (!vehicles || vehicles.length === 0) {
            console.warn('No se encontraron vehículos en la respuesta.');
        }
        
        console.log('Datos procesados:', vehicles);
        allVehicles = vehicles;
        applyFilters();
        renderSidebarPendingVehicles(vehicles);
    })
    .catch(err => {
        console.error('Error al obtener vehículos:', err);
        allVehicles = [];
        renderVehiclesTable([]);
        renderSidebarPendingVehicles([]);
    });
}

// Muestra el modal de detalles del vehículo
window.showVehicleModal = function(vehicleId) {
    const modal = document.getElementById('modalVehiculo');
    modal.classList.add('activo');
    selectedVehicleId = vehicleId;
    
    const vehicle = allVehicles.find(v => v.vehicleId === vehicleId) || 
                   (window.__listaVehiculos && window.__listaVehiculos.find(v => v.vehicleId === vehicleId));
    
    vehiculoSeleccionado = vehicle;
    const tabVehiculo = document.getElementById('tab-vehiculo');
    
    // Restablece pestañas a la primera
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('activo'));
    document.querySelector('.tab-btn[data-tab="vehiculo"]').classList.add('activo');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('activo'));
    document.getElementById('tab-vehiculo').classList.add('activo');

    if (vehicle && tabVehiculo) {
        const imageSrc = vehicle.vehicleImage && vehicle.vehicleImage !== 'null' ? vehicle.vehicleImage : 'imgs/default-car.png';
        const statusText = getStatusText(vehicle.idStatus);
        tabVehiculo.innerHTML = ` 
            <div class="modal-vehiculo-imagen-container">
                <h4>Imagen del Vehículo</h4>
                <img src="${imageSrc}" class="modal-vehiculo-imagen imagen-vehiculo" alt="Imagen del vehículo">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px;">
                <div>
                    <div class="detalle-item"><strong>Placa:</strong> <div class="detalle-valor">${vehicle.plateNumber || '-'}</div></div>
                    <div class="detalle-item"><strong>Marca:</strong> <div class="detalle-valor">${vehicle.brand || '-'}</div></div>
                    <div class="detalle-item"><strong>Modelo:</strong> <div class="detalle-valor">${vehicle.model || '-'}</div></div>
                    <div class="detalle-item"><strong>Tipo:</strong> <div class="detalle-valor">${vehicle.typeName || '-'}</div></div>
                </div>
                <div>
                    <div class="detalle-item"><strong>Estado:</strong> <div class="detalle-valor">${statusText}</div></div>
                    <div class="detalle-item"><strong>Estudiante:</strong> <div class="detalle-valor">${(vehicle.studentName || '-') + ' ' + (vehicle.studentLastName || '')}</div></div>
                    <div class="detalle-item"><strong>Propietario:</strong> <div class="detalle-valor">${vehicle.ownerName || '-'}</div></div>
                    <div class="detalle-item"><strong>Tel. Propietario:</strong> <div class="detalle-valor">${vehicle.ownerPhone || '-'}</div></div>
                </div>
            </div>
        `;
    } else if (tabVehiculo) {
        tabVehiculo.innerHTML = '<div style="color:#888;text-align:center;">No se encontraron datos del vehículo.</div>';
    }
}

// Lógica de filtrado
function applyFilters() {
    const searchInput = document.getElementById('buscarRegistro');
    const statusFilter = document.getElementById('filtroEstado');
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const statusValue = statusFilter ? statusFilter.value : 'all';
    
    let filteredVehicles = allVehicles.filter(vehicle => {
        const matchesSearch = 
            (vehicle.plateNumber && vehicle.plateNumber.toLowerCase().includes(searchTerm)) ||
            (vehicle.brand && vehicle.brand.toLowerCase().includes(searchTerm)) ||
            (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm)) ||
            (vehicle.studentName && vehicle.studentName.toLowerCase().includes(searchTerm)) ||
            (vehicle.studentLastName && vehicle.studentLastName.toLowerCase().includes(searchTerm)) ||
            (vehicle.ownerName && vehicle.ownerName.toLowerCase().includes(searchTerm)) ||
            (vehicle.idStatus && getStatusText(vehicle.idStatus).toLowerCase().includes(searchTerm));
            
        const matchesStatus = 
            statusValue === 'all' || 
            statusValue.split(',').map(s => parseInt(s)).includes(vehicle.idStatus);

        return matchesSearch && matchesStatus;
    });
    
    renderVehiclesTable(filteredVehicles);
}

// Búsqueda por placa específica
function searchByPlate(plate) {
    if (plate.length === 0) {
        fetchAllVehicles();
        return;
    }
    
    fetch(`https://sgma-66ec41075156.herokuapp.com/api/vehicles/plate/${plate}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        let vehicles = [];
        if (Array.isArray(data)) {
            vehicles = data;
        } else if (data && data.data && Array.isArray(data.data.content)) {
            vehicles = data.data.content;
        } else if (data) {
            vehicles = [data];
        }
        renderVehiclesTable(vehicles);
    })
    .catch(err => {
        console.error('Error en búsqueda por placa:', err);
        renderVehiclesTable([]);
    });
}

// Vincula los manejadores de eventos
function bindEventListeners() {
    // Cierre del Modal
    document.querySelectorAll('.btn-cerrar-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('modalVehiculo').classList.remove('activo');
        });
    });

    const modalOverlay = document.getElementById('modalVehiculo');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('activo');
            }
        });
    }
    
    // Tabs del Modal
    document.querySelectorAll('.modal-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('activo'));
            
            this.classList.add('activo');
            const tabId = this.getAttribute('data-tab');
            const contentElement = document.getElementById('tab-' + tabId);
            if (contentElement) {
                contentElement.classList.add('activo');
            }
        });
    });
    
    // Botón de imprimir
    const printButton = document.getElementById('btn-imprimir-reporte');
    if (printButton) {
        printButton.addEventListener('click', window.imprimirReporteVehiculo);
    }
    
    // Checkbox de selección global
    const checkboxAll = document.querySelector('.checkbox-all');
    if (checkboxAll) {
        checkboxAll.addEventListener('change', function() {
            document.querySelectorAll('.checkbox-row').forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // Botón de aprobar
    const btnAprobar = document.querySelector('.btn-modal.primario');
    if (btnAprobar) {
        btnAprobar.addEventListener('click', async function() {
            if (!vehiculoSeleccionado) return;
            
            try {
                // Get user info to ensure we have proper authentication
                const userInfo = await getUserInfo();
                if (!userInfo) {
                    alert('Error: No se pudo verificar la autenticación');
                    return;
                }
                
                const newStatus = userRole === 'Animador' ? 2 : 3;
                
                const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/vehicles/updateStatus/${vehiculoSeleccionado.vehicleId}?newStatus=${newStatus}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('No tienes permisos para aprobar este vehículo');
                    } else if (response.status === 401) {
                        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
                    } else {
                        throw new Error(`Error del servidor: ${response.status}`);
                    }
                }
                
                // Check if response has content
                const contentType = response.headers.get('content-type');
                let data = {};
                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                }
                
                console.log('Approval response:', data);
                alert('Vehículo aprobado exitosamente');
                await fetchAllVehicles();
                document.getElementById('modalVehiculo').classList.remove('activo');
                
            } catch (err) {
                console.error('Error al aprobar el vehículo:', err);
                alert('Error al aprobar el vehículo: ' + err.message);
            }
        });
    }

    // Botón de rechazar
    const btnRechazar = document.querySelector('.btn-modal.secundario');
    if (btnRechazar) {
        btnRechazar.addEventListener('click', async function() {
            if (!vehiculoSeleccionado) return;
            
            try {
                // Get user info to ensure we have proper authentication
                const userInfo = await getUserInfo();
                if (!userInfo) {
                    alert('Error: No se pudo verificar la autenticación');
                    return;
                }
                
                const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/vehicles/updateStatus/${vehiculoSeleccionado.vehicleId}?newStatus=4`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('No tienes permisos para rechazar este vehículo');
                    } else if (response.status === 401) {
                        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
                    } else {
                        throw new Error(`Error del servidor: ${response.status}`);
                    }
                }
                
                // Check if response has content
                const contentType = response.headers.get('content-type');
                let data = {};
                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                }
                
                console.log('Rejection response:', data);
                alert('Vehículo rechazado exitosamente');
                await fetchAllVehicles();
                document.getElementById('modalVehiculo').classList.remove('activo');
                
            } catch (err) {
                console.error('Error al rechazar el vehículo:', err);
                alert('Error al rechazar el vehículo: ' + err.message);
            }
        });
    }
}

// Función para generar e imprimir el reporte
window.imprimirReporteVehiculo = function() {
    const vehicle = vehiculoSeleccionado || allVehicles.find(v => v.vehicleId === selectedVehicleId);
    if (!vehicle) return; 
    
    const currentDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const imageSrc = vehicle.vehicleImage && vehicle.vehicleImage !== 'null' ? vehicle.vehicleImage : 'imgs/default-car.png';
    const statusText = getStatusText(vehicle.idStatus);
    
    const printContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Reporte de Vehículo - ${vehicle.plateNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .vehicle-info { margin: 20px 0; }
                .detail { margin: 10px 0; }
                .vehicle-image { max-width: 300px; height: auto; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Reporte de Vehículo</h1>
                <p>Fecha: ${currentDate}</p>
            </div>
            <div class="vehicle-info">
                <div class="detail"><strong>Placa:</strong> ${vehicle.plateNumber || '-'}</div>
                <div class="detail"><strong>Marca:</strong> ${vehicle.brand || '-'}</div>
                <div class="detail"><strong>Modelo:</strong> ${vehicle.model || '-'}</div>
                <div class="detail"><strong>Estado:</strong> ${statusText}</div>
                <div class="detail"><strong>Estudiante:</strong> ${(vehicle.studentName || '') + ' ' + (vehicle.studentLastName || '')}</div>
                <div class="detail"><strong>Propietario:</strong> ${vehicle.ownerName || '-'}</div>
                <img src="${imageSrc}" class="vehicle-image" alt="Imagen del vehículo">
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 100);
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
    } else {
        alert('Por favor, permita ventanas emergentes para imprimir el reporte.');
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    bindEventListeners();
    
    // Inicializa la funcionalidad de búsqueda
    const searchInput = document.getElementById('buscarRegistro');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            applyFilters();
        });
    }
    
    // Inicializa la funcionalidad de filtro
    const statusFilter = document.getElementById('filtroEstado');
    if (statusFilter) {
        statusFilter.addEventListener('change', function(e) {
            applyFilters();
        });
    }

    // Inicialización de datos
    getUserInfo().then(() => {
        fetchAllVehicles();
    });
});