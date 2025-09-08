document.addEventListener('DOMContentLoaded', () => {
    const modalVehiculo = document.getElementById("modalVehiculo");
    // Abrir modal desde la sidebar y tabla
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.btn-opciones')) {
            if (modalVehiculo) {
                modalVehiculo.style.display = "flex";
            }
        }
    });
    // Cerrar modal
    const botonCerrarModalVehiculo = document.querySelector('.btn-cerrar-modal');
    if (botonCerrarModalVehiculo) {
        botonCerrarModalVehiculo.onclick = () => {
            modalVehiculo.style.display = "none";
        };
    }
    window.onclick = (e) => {
        if (e.target === modalVehiculo) {
            modalVehiculo.style.display = "none";
        }
    };


    function getAuthToken() {
        const match = document.cookie.match(/(^|;) *token=([^;]*)/);
        return match ? match[2] : null;
    }

    let vehiculoSeleccionado = null;

    function llenarModalVehiculo(vehiculo) {
        vehiculoSeleccionado = vehiculo;
        // Puedes personalizar el contenido del modal aquí
        const tabVehiculo = document.getElementById('tab-vehiculo');
        if (tabVehiculo) {
            tabVehiculo.innerHTML = `
                <ul style="list-style:none;padding:0;">
                    <li><b>Placa:</b> ${vehiculo.plateNumber || '-'}</li>
                    <li><b>Marca:</b> ${vehiculo.brand || '-'}</li>
                    <li><b>Modelo:</b> ${vehiculo.model || '-'}</li>
                    <li><b>Tipo:</b> ${vehiculo.typeName || '-'}</li>
                    <li><b>Estado:</b> ${vehiculo.idStatus || '-'}</li>
                    <li><b>Estudiante:</b> ${(vehiculo.studentName || '-') + ' ' + (vehiculo.studentLastName || '')}</li>
                    <li><b>Propietario:</b> ${vehiculo.ownerName || '-'}</li>
                    <li><b>Teléfono:</b> ${vehiculo.ownerPhone || '-'}</li>
                    <li><b>N° Tarjeta Circulación:</b> ${vehiculo.circulationCardNumber || '-'}</li>
                    <li><b>Color:</b> ${vehiculo.color || '-'}</li>
                    <li><b>Imagen:</b> <img src="${vehiculo.vehicleImage || 'imgs/default-car.png'}" style="width:60px;height:60px;border-radius:6px;border:1px solid #ccc;"></li>
                </ul>
            `;
        }
    }

    // Modificar para que al hacer click en un pendiente se llene el modal
    document.body.addEventListener('click', function(e) {
        const itemRegistro = e.target.closest('.item-registro');
        if (itemRegistro && itemRegistro.__vehiculoData) {
            llenarModalVehiculo(itemRegistro.__vehiculoData);
            if (modalVehiculo) modalVehiculo.style.display = 'flex';
        }
        // ...existing code for .btn-opciones...
    }, true);

    // Modificar renderSidebarPendingVehicles para guardar el objeto en el div
    function renderSidebarPendingVehicles(vehicles) {
        const lista = document.querySelector('.tarjeta-sidebar .lista-registros');
        const badge = document.querySelector('.tarjeta-sidebar .badge-contador');
        if (!lista) return;
        const pendientes = vehicles.filter(v => v.idStatus === 1);
        if (badge) badge.textContent = pendientes.length;
        lista.innerHTML = '';
        if (pendientes.length === 0) {
            lista.innerHTML = '<div style="text-align:center;color:#888;">No hay vehículos pendientes.</div>';
            return;
        }
        pendientes.forEach(vehicle => {
            const div = document.createElement('div');
            div.className = 'item-registro';
            div.__vehiculoData = vehicle;
            div.innerHTML = `
                <div class="icono-vehiculo"><i class="fas fa-car"></i></div>
                <div class="info-vehiculo">
                    <span class="placa-vehiculo">${vehicle.plateNumber || '-'}</span>
                    <span class="servicio-vehiculo">${vehicle.model || '-'}</span>
                    <span class="fecha-vehiculo">${vehicle.brand || ''}</span>
                </div>
                <div class="acciones-vehiculo">
                    <button class="btn-opciones" title="Más opciones"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            `;
            lista.appendChild(div);
        });
    }

    // Modificar showVehicleModal para llenar el modal
    window.showVehicleModal = function(vehicleId) {
        // Buscar el vehículo en la última lista cargada
        const tbody = document.querySelector('.tabla-moderna tbody');
        let vehiculo = null;
        if (tbody) {
            const rows = Array.from(tbody.children);
            for (const row of rows) {
                if (row.innerHTML.includes(`showVehicleModal(${vehicleId})`)) {
                    // Extraer datos de la fila si es necesario, pero mejor guardar la lista globalmente
                    // Aquí asumimos que tienes la lista global, si no, deberías guardarla
                }
            }
        }
        // Mejor: guardar la lista de vehículos globalmente
        if (window.__listaVehiculos) {
            vehiculo = window.__listaVehiculos.find(v => v.vehicleId === vehicleId);
        }
        if (vehiculo) {
            llenarModalVehiculo(vehiculo);
        }
        if (modalVehiculo) {
            modalVehiculo.style.display = 'flex';
        }
    }

    // Guardar la lista de vehículos globalmente al renderizar
    function renderVehiclesTable(vehicles) {
        window.__listaVehiculos = vehicles;
        const tbody = document.querySelector('.tabla-moderna tbody');
        // Ocultar el header de acciones si existe
        const thead = document.querySelector('.tabla-moderna thead tr');
        if (thead && thead.children.length >= 11) {
            thead.children[10].style.display = 'none';
        }
        if (!tbody) {
            console.error('No se encontró el tbody de la tabla de vehículos. Verifica que exista .tabla-moderna y su <tbody>.');
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
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="checkbox-row"></td>
                <td>${vehicle.plateNumber || '-'}</td>
                <td>${vehicle.brand || '-'}</td>
                <td>${vehicle.model || '-'}</td>
                <td>${vehicle.typeName || '-'}</td>
                <td>${vehicle.idStatus != null ? vehicle.idStatus : '-'}</td>
                <td>${estudiante.trim() || '-'}</td>
                <td>${vehicle.ownerName || '-'}</td>
                <td>${vehicle.ownerPhone || '-'}</td>
                <td><img src="${imgSrc}" alt="Imagen" class="vehiculo-img" style="width:40px;height:40px;border-radius:6px;border:1px solid #ccc;"></td>
                <td style="display:none;">
                    <div class="acciones-vehiculo" style="display:none;">
                        <button class="btn-opciones" title="Ver detalles" onclick="showVehicleModal(${vehicle.vehicleId})" style="display:none;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-opciones" title="Editar" style="display:none;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-opciones" title="Eliminar" style="display:none;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Aprobar vehículo
    const btnAprobar = document.querySelector('.btn-modal.primario');
    if (btnAprobar) {
        btnAprobar.onclick = function() {
            if (!vehiculoSeleccionado) return;
            const token = getAuthToken();
            fetch(`http://localhost:8080/api/vehicles/updateStatus/${vehiculoSeleccionado.vehicleId}?newStatus=2`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                // Refrescar la tabla y cerrar modal
                fetchAllVehicles();
                if (modalVehiculo) modalVehiculo.style.display = 'none';
            })
            .catch(err => {
                alert('Error al aprobar el vehículo');
            });
        }
    }

    function renderVehiclesTable(vehicles) {
        const tbody = document.querySelector('.tabla-moderna tbody');
        if (!tbody) {
            console.error('No se encontró el tbody de la tabla de vehículos. Verifica que exista .tabla-moderna y su <tbody>.');
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
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="checkbox-row"></td>
                <td>${vehicle.plateNumber || '-'}</td>
                <td>${vehicle.brand || '-'}</td>
                <td>${vehicle.model || '-'}</td>
                <td>${vehicle.typeName || '-'}</td>
                <td>${vehicle.idStatus != null ? vehicle.idStatus : '-'}</td>
                <td>${estudiante.trim() || '-'}</td>
                <td>${vehicle.ownerName || '-'}</td>
                <td>${vehicle.ownerPhone || '-'}</td>
                <td><img src="${imgSrc}" alt="Imagen" class="vehiculo-img" style="width:40px;height:40px;border-radius:6px;border:1px solid #ccc;"></td>
                <td style="display:none;">
                    <div class="acciones-vehiculo" style="display:none;">
                        <button class="btn-opciones" title="Ver detalles" onclick="showVehicleModal(${vehicle.vehicleId})" style="display:none;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-opciones" title="Editar" style="display:none;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-opciones" title="Eliminar" style="display:none;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderSidebarPendingVehicles(vehicles) {
        const lista = document.querySelector('.tarjeta-sidebar .lista-registros');
        const badge = document.querySelector('.tarjeta-sidebar .badge-contador');
        if (!lista) return;
        const pendientes = vehicles.filter(v => v.idStatus === 1);
        if (badge) badge.textContent = pendientes.length;
        lista.innerHTML = '';
        if (pendientes.length === 0) {
            lista.innerHTML = '<div style="text-align:center;color:#888;">No hay vehículos pendientes.</div>';
            return;
        }
        pendientes.forEach(vehicle => {
            const div = document.createElement('div');
            div.className = 'item-registro';
            div.__vehiculoData = vehicle;
            div.innerHTML = `
                <div class="icono-vehiculo"><i class="fas fa-car"></i></div>
                <div class="info-vehiculo">
                    <span class="placa-vehiculo">${vehicle.plateNumber || '-'}</span>
                    <span class="servicio-vehiculo">${vehicle.model || '-'}</span>
                    <span class="fecha-vehiculo">${vehicle.brand || ''}</span>
                </div>
                <div class="acciones-vehiculo">
                    <button class="btn-opciones" title="Más opciones"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            `;
            lista.appendChild(div);
        });
    }

    function fetchAllVehicles() {
        console.log('Ejecutando fetchAllVehicles...');
        const token = getAuthToken();
        fetch('http://localhost:8080/api/vehicles/getDataVehicles', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            console.log('Respuesta recibida de la API:', res);
            return res.json();
        })
        .then(data => {
            let vehicles = [];
            if (Array.isArray(data)) {
                vehicles = data;
            } else if (data && data.data && Array.isArray(data.data.content)) {
                vehicles = data.data.content;
            } else if (data && Array.isArray(data.content)) {
                vehicles = data.content;
            } else if (data && typeof data === 'object') {
                vehicles = [data];
            }
            if (!vehicles || vehicles.length === 0) {
                console.warn('No se encontraron vehículos en la respuesta.');
            }
            console.log('Datos procesados:', vehicles);
            renderVehiclesTable(vehicles);
            renderSidebarPendingVehicles(vehicles);
        })
        .catch(err => {
            console.error('Error al obtener vehículos:', err);
            renderVehiclesTable([]);
            renderSidebarPendingVehicles([]);
        });
    }

    document.getElementById('buscarRegistro').addEventListener('input', function(e) {
        const plate = e.target.value.trim();
        if (plate.length === 0) {
            fetchAllVehicles();
            return;
        }
        const token = getAuthToken();
        fetch(`http://localhost:8080/api/vehicles/plate/${plate}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
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
    });

    window.showVehicleModal = function(vehicleId) {
        if (modalVehiculo) {
            modalVehiculo.style.display = 'flex';
        }
    }

    
    // Ejecutar fetchAllVehicles al cargar la página
    fetchAllVehicles();
});