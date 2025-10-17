// Controlador para Órdenes de Trabajo
import {me} from '../services/authServiceStudents.js';

class OrdenesTrabajoController {
    constructor() {
        this.user = null;
        this.vehicles = [];
        this.workOrders = [];
        this.modules = [];
        this.modal = null;
        this.form = null;
    }

    async init() {
        try {
            await this.initializeAuth();
            this.initializeElements();
            this.bindEvents();
            await this.loadUserVehicles();
            await this.loadModules();
            await this.loadWorkOrders(); // Cargar órdenes de trabajo del estudiante
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
            this.showError('Error al cargar la aplicación');
        }
    }

    async initializeAuth() {
        try {
            this.user = await me();
            if (!this.user || !this.user.student) {
                throw new Error('Usuario no autenticado');
            }
        } catch (error) {
            console.error('Error de autenticación:', error);
            window.location.href = 'loginEstudiante.html';
            throw error;
        }
    }

    initializeElements() {
        this.modal = document.getElementById('modal-nueva-orden');
        this.form = document.getElementById('form-nueva-orden');
        this.vehiculoSelect = document.getElementById('vehiculo-select');
        this.moduloSelect = document.getElementById('modulo-select');
        this.listaVehiculos = document.getElementById('lista-vehiculos');
        this.listaOrdenes = document.getElementById('lista-ordenes');
        
        // Previsualización de imagen
        this.imagenInput = document.getElementById('imagen-trabajo');
        this.vistaPrevia = document.getElementById('vista-previa-imagen');
    }

    bindEvents() {
        // Botón nueva orden
        document.getElementById('btn-nueva-orden').addEventListener('click', () => {
            this.openModal();
        });

        // Cerrar modal
        document.getElementById('btn-cerrar-modal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('btn-cancelar-orden').addEventListener('click', () => {
            this.closeModal();
        });

        // Click fuera del modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Submit del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateWorkOrder();
        });

        // Botón específico de crear orden
        document.getElementById('btn-crear-orden').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCreateWorkOrder();
        });

        // Previsualización de imagen
        this.imagenInput.addEventListener('change', (e) => {
            this.handleImagePreview(e);
        });
    }

    async loadUserVehicles() {
        try {
            const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/vehicles/getVehiclesByStudentId/${this.user.student.id}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Respuesta completa:', data);

            // Extraer vehículos según la estructura real del API
            let vehicles = [];
            
            if (data.success && data.data && data.data.vehiculos) {
                vehicles = data.data.vehiculos;
            }

            console.log('Vehículos extraídos:', vehicles);
            console.log('Cantidad de vehículos:', vehicles.length);
            
            // Debug: Mostrar IDs de vehículos
            if (vehicles.length > 0) {
                console.log('IDs de vehículos disponibles:', vehicles.map(v => v.vehicleId));
                console.log('Detalles de vehículos:', vehicles.map(v => ({
                    id: v.vehicleId,
                    placa: v.plateNumber,
                    studentId: v.studentId
                })));
            }

            this.vehicles = vehicles;
            this.displayVehicles(vehicles);
            this.populateVehicleSelect(vehicles);

        } catch (error) {
            console.error('Error al cargar vehículos:', error);
            this.showError('Error al cargar los vehículos');
            this.displayVehicles([]);
        }
    }

    displayVehicles(vehicles) {
        if (!Array.isArray(vehicles)) {
            console.error('vehicles no es un array:', vehicles);
            vehicles = [];
        }

        console.log('Mostrando vehículos:', vehicles);
        
        if (vehicles.length === 0) {
            this.listaVehiculos.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-car"></i>
                    <h3>No tienes vehículos registrados</h3>
                    <p>Para crear una orden de trabajo, primero debes registrar un vehículo.</p>
                    <a href="registro-auto.html" class="botones primario" style="margin-top: 15px; display: inline-block; text-decoration: none;">
                        <i class="fas fa-plus"></i>
                        Registrar Vehículo
                    </a>
                </div>
            `;
            return;
        }

        const vehiculosHTML = vehicles.map(vehicle => {
            console.log('Procesando vehículo:', vehicle);
            
            // Usar las propiedades correctas según la respuesta del API
            const placa = vehicle.plateNumber || 'Sin placa';
            const marca = vehicle.brand || 'Sin marca';
            const modelo = vehicle.model || 'Sin modelo';
            const tipo = vehicle.typeName || 'N/A';
            const color = vehicle.color || 'N/A';
            const tarjeta = vehicle.circulationCardNumber || 'N/A';
            const expo = vehicle.maintenanceEXPO === 1;
            
            return `
                <div class="vehiculo-card" data-id="${vehicle.vehicleId}">
                    ${vehicle.vehicleImage ? `
                        <div class="vehiculo-imagen">
                            <img src="${vehicle.vehicleImage}" alt="${placa}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                            <div class="vehiculo-icon-fallback" style="display: none;">
                                <i class="fas fa-car"></i>
                            </div>
                        </div>
                    ` : `
                        <div class="vehiculo-imagen">
                            <div class="vehiculo-icon-fallback">
                                <i class="fas fa-car"></i>
                            </div>
                        </div>
                    `}
                    <div class="vehiculo-info">
                        <div class="vehiculo-principal">
                            <div class="vehiculo-datos">
                                <h3>${placa}</h3>
                                <p>${marca} ${modelo}</p>
                            </div>
                        </div>
                        <div class="vehiculo-estado estado-disponible">
                            Disponible
                        </div>
                    </div>
                    <div class="vehiculo-detalles">
                        <div><strong>Tipo:</strong> ${tipo}</div>
                        <div><strong>Color:</strong> ${color}</div>
                        <div><strong>Tarjeta:</strong> ${tarjeta}</div>
                        <div><strong>Expo:</strong> ${expo ? 'Sí' : 'No'}</div>
                    </div>
                </div>
            `;
        }).join('');

        this.listaVehiculos.innerHTML = vehiculosHTML;
    }

    populateVehicleSelect(vehicles) {
        if (!Array.isArray(vehicles)) {
            vehicles = [];
        }

        console.log('Poblando select con vehículos:', vehicles);

        this.vehiculoSelect.innerHTML = '<option value="">Seleccione un vehículo...</option>';
        
        vehicles.forEach(vehicle => {
            console.log('Agregando vehículo al select:', vehicle);
            const option = document.createElement('option');
            option.value = vehicle.vehicleId;
            
            const placa = vehicle.plateNumber || 'Sin placa';
            const marca = vehicle.brand || 'Sin marca';
            const modelo = vehicle.model || '';
            
            option.textContent = `${placa} - ${marca} ${modelo}`.trim();
            this.vehiculoSelect.appendChild(option);
        });
    }

    async loadModules() {
        try {
            const response = await fetch('https://sgma-66ec41075156.herokuapp.com/api/modules/getAllModules', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Respuesta de módulos:', data);

            // Extraer módulos según la estructura del API
            let modules = [];
            
            if (data.success && data.data && data.data.content) {
                modules = data.data.content;
            }

            console.log('Módulos extraídos:', modules);
            this.modules = modules;
            this.populateModuleSelect(modules);

        } catch (error) {
            console.error('Error al cargar módulos:', error);
            this.showError('Error al cargar los módulos');
            this.populateModuleSelect([]);
        }
    }

    populateModuleSelect(modules) {
        if (!Array.isArray(modules)) {
            modules = [];
        }

        console.log('Poblando select con módulos:', modules);

        this.moduloSelect.innerHTML = '<option value="">Seleccione un módulo...</option>';
        
        if (modules.length === 0) {
            this.moduloSelect.innerHTML += '<option value="" disabled>No hay módulos disponibles</option>';
            return;
        }
        
        modules.forEach(module => {
            console.log('Agregando módulo al select:', module);
            const option = document.createElement('option');
            option.value = module.moduleId;
            
            const codigo = module.moduleCode || '';
            const nombre = module.moduleName || 'Sin nombre';
            const nivel = module.levelName || '';
            
            option.textContent = `${codigo} - ${nombre} (${nivel})`.trim();
            this.moduloSelect.appendChild(option);
        });
    }

    async loadWorkOrders() {
        try {
            console.log('Cargando órdenes de trabajo del estudiante:', this.user.student.id);
            
            const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/workOrders/getWorkOrdersByStudentId/${this.user.student.id}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Respuesta de órdenes de trabajo:', data);

            // Extraer órdenes según la estructura del API
            let orders = [];
            if (data.workOrders && Array.isArray(data.workOrders)) {
                orders = data.workOrders;
            }

            console.log('Órdenes extraídas:', orders);
            console.log('Cantidad de órdenes:', orders.length);
            
            this.workOrders = orders;
            this.displayWorkOrders(orders);

        } catch (error) {
            console.error('Error al cargar órdenes de trabajo:', error);
            this.showError('Error al cargar las órdenes de trabajo');
            this.displayWorkOrders([]);
        }
    }

    displayWorkOrders(orders) {
        if (orders.length === 0) {
            this.listaOrdenes.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <h3>Órdenes de Trabajo</h3>
                    <p>Una vez que crees órdenes de trabajo, aparecerán aquí.</p>
                    <p style="margin-top: 10px; font-size: 0.9em; color: #888;">
                        <i class="fas fa-info-circle"></i> 
                        Puedes crear una nueva orden haciendo clic en el botón +
                    </p>
                </div>
            `;
            return;
        }

        const ordenesHTML = orders.map(order => {
            console.log('Procesando orden:', order); // Debug para ver estructura real
            
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

            const statusText = getStatusText(order.idStatus);
            const statusClass = statusText.toLowerCase().replace(' ', '-');
            
            // Manejar campos que pueden ser null o undefined
            const vehiclePlate = order.vehiclePlateNumber || 'Vehículo no especificado';
            const moduleName = order.moduleName || 'Sin módulo asignado';
            const estimatedTime = order.estimatedTime ? `${order.estimatedTime} horas` : 'Tiempo no especificado';
            const hasImage = order.workOrderImage && 
                            order.workOrderImage !== 'sin_imagen' && 
                            order.workOrderImage !== null && 
                            order.workOrderImage.trim() !== '';

            return `
                <div class="orden-card" data-id="${order.workOrderId}">
                    <div class="orden-header">
                        <div class="orden-numero">Orden #${order.workOrderId}</div>
                        <div class="orden-estado estado-${statusClass}">
                            ${statusText}
                        </div>
                    </div>
                    <div class="orden-vehiculo">
                        <i class="fas fa-car"></i> ${vehiclePlate}
                    </div>
                    <div class="orden-modulo">
                        <i class="fas fa-book"></i> ${moduleName}
                    </div>
                    <div class="orden-meta">
                        <div class="orden-tiempo">
                            <i class="fas fa-clock"></i> ${estimatedTime}
                        </div>
                        <div class="orden-imagen">
                            <i class="fas fa-image"></i> ${hasImage ? 'Con imagen' : 'Sin imagen'}
                        </div>
                    </div>
                    ${hasImage ? `
                        <div class="orden-imagen-preview" style="margin-top: 10px;">
                            <img src="${order.workOrderImage}" alt="Imagen de orden" style="max-width: 100%; height: auto; border-radius: 8px; max-height: 200px; object-fit: cover;" onerror="this.style.display='none';" />
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        this.listaOrdenes.innerHTML = ordenesHTML;
    }

    openModal() {
        if (this.vehicles.length === 0) {
            this.showError('Debes tener al menos un vehículo registrado para crear una orden de trabajo');
            return;
        }
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.form.reset();
        this.vistaPrevia.style.display = 'none';
    }

    handleImagePreview(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.vistaPrevia.src = e.target.result;
                this.vistaPrevia.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            this.vistaPrevia.style.display = 'none';
        }
    }

    /**
     * Verifica si un vehículo existe y pertenece al estudiante
     * @param {number} vehicleId - ID del vehículo a verificar
     * @returns {Promise<boolean>} - true si el vehículo existe y es válido
     */
    async verifyVehicle(vehicleId) {
        try {
            const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/vehicles/getVehiclesByStudentId/${this.user.student.id}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            const vehicles = data.success && data.data && data.data.vehiculos ? data.data.vehiculos : [];
            
            const vehicleExists = vehicles.some(v => v.vehicleId === parseInt(vehicleId));
            console.log(`Verificación de vehículo ID ${vehicleId}:`, vehicleExists);
            
            return vehicleExists;
        } catch (error) {
            console.error('Error al verificar vehículo:', error);
            return false;
        }
    }

    /**
     * Verifica si un vehículo específico existe en el servidor (verificación directa)
     * @param {number} vehicleId - ID del vehículo a verificar
     * @returns {Promise<boolean>} - true si el vehículo existe en el servidor
     */
    async verifyVehicleInServer(vehicleId) {
        try {
            console.log(`Verificando vehículo ID ${vehicleId} en el servidor...`);
            
            // Intentar obtener el vehículo específico
            const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/vehicles/getVehicleById/${vehicleId}`, {
                credentials: 'include'
            });

            console.log(`Response status para vehículo ${vehicleId}:`, response.status);

            if (response.status === 404) {
                console.log(`Vehículo ${vehicleId} no encontrado (404)`);
                return false;
            }

            if (!response.ok) {
                console.log(`Error al verificar vehículo ${vehicleId}:`, response.status);
                return false;
            }

            const data = await response.json();
            console.log(`Datos del vehículo ${vehicleId}:`, data);

            // Verificar que el vehículo pertenece al estudiante actual
            if (data.success && data.data) {
                const vehicle = data.data;
                const belongsToStudent = vehicle.studentId === this.user.student.id;
                console.log(`Vehículo ${vehicleId} pertenece al estudiante ${this.user.student.id}:`, belongsToStudent);
                return belongsToStudent;
            }

            return false;
        } catch (error) {
            console.error(`Error al verificar vehículo ${vehicleId} en servidor:`, error);
            return false;
        }
    }

    /**
     * Verificación simple del vehículo antes de crear la orden
     * @param {number} vehicleId - ID del vehículo a verificar
     * @returns {Promise<Object|null>} - Datos del vehículo o null si no existe
     */
    async getVehicleDetails(vehicleId) {
        try {
            console.log(`Obteniendo detalles del vehículo ID ${vehicleId}...`);
            
            const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/vehicles/getVehicleById/${vehicleId}`, {
                credentials: 'include'
            });

            console.log(`Response status para getVehicleById ${vehicleId}:`, response.status);

            if (!response.ok) {
                console.log(`Error al obtener vehículo ${vehicleId}:`, response.status);
                return null;
            }

            const data = await response.json();
            console.log(`Datos completos del vehículo ${vehicleId}:`, data);

            if (data.success && data.data) {
                return data.data;
            }

            return null;
        } catch (error) {
            console.error(`Error al obtener detalles del vehículo ${vehicleId}:`, error);
            return null;
        }
    }

    /**
     * Sube una imagen a Cloudinary usando el endpoint backend
     * @param {File} archivo - Archivo de imagen a subir
     * @returns {Promise<string|null>} - URL de la imagen subida o null si falla
     */
    async subirImagen(archivo) {
        console.log('Iniciando subida de imagen:', archivo.name, archivo.size, 'bytes');
        
        const fd = new FormData();
        fd.append('image', archivo);
        fd.append('folder', 'workOrders');
        
        try {
            console.log('Enviando imagen a Cloudinary...');
            const res = await fetch('https://sgma-66ec41075156.herokuapp.com/api/images/upload-to-folder', {
                method: 'POST',
                credentials: 'include',
                body: fd
            });
            
            console.log('Respuesta de Cloudinary status:', res.status);
            
            if (!res.ok) {
                throw new Error(`Error HTTP ${res.status} en subida de imagen`);
            }
            
            const obj = await res.json();
            console.log('Respuesta de Cloudinary:', obj);
            
            if (obj.url) {
                console.log('URL de imagen obtenida:', obj.url);
                return obj.url;
            } else {
                throw new Error('URL de imagen no encontrada en la respuesta de Cloudinary.');
            }
        } catch (error) {
            console.error('Error detallado al subir imagen:', error);
            throw error; // Re-lanzar el error para manejarlo en handleCreateWorkOrder
        }
    }

    async handleCreateWorkOrder() {
        try {
            console.log('Iniciando creación de orden de trabajo...');
            
            const vehicleId = this.vehiculoSelect.value;
            const moduleId = this.moduloSelect.value;
            const descripcionElement = document.getElementById('descripcion-trabajo');
            const descripcion = descripcionElement ? descripcionElement.value : '';
            const tiempoEstimado = document.getElementById('tiempo-estimado').value;
            const imagenFile = this.imagenInput.files[0];

            console.log('Datos del formulario:', {
                vehicleId,
                moduleId,
                tiempoEstimado,
                tieneImagen: !!imagenFile,
                descripcionLength: descripcion.trim().length
            });

            // Validaciones
            console.log('Iniciando validaciones...');
            console.log('Usuario actual:', {
                id: this.user?.student?.id,
                email: this.user?.student?.email,
                fullName: this.user?.student?.fullName
            });
            
            if (!vehicleId) {
                console.log('Error: No se seleccionó vehículo');
                this.showError('Debe seleccionar un vehículo');
                return;
            }
            console.log('✓ Vehículo validado:', vehicleId);

            if (!moduleId) {
                console.log('Error: No se seleccionó módulo');
                this.showError('Debe seleccionar un módulo');
                return;
            }
            console.log('✓ Módulo validado:', moduleId);

            // Validar tiempo estimado (requerido por el DTO)
            if (!tiempoEstimado || parseFloat(tiempoEstimado) <= 0) {
                console.log('Error: Tiempo estimado inválido');
                this.showError('Debe especificar un tiempo estimado válido');
                return;
            }
            console.log('✓ Tiempo estimado validado:', tiempoEstimado, 'tipo:', typeof tiempoEstimado);

            console.log('✓ Todas las validaciones pasaron correctamente');

            // Mostrar alerta de carga
            Swal.fire({
                title: 'Creando orden de trabajo...',
                text: 'Por favor, espere mientras se procesa la solicitud.',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false,
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content'
                },
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            console.log('SweetAlert mostrado, procesando imagen...');

            // Subir imagen si existe
            let workOrderImage = null;
            if (imagenFile) {
                console.log('Subiendo imagen...');
                try {
                    workOrderImage = await this.subirImagen(imagenFile);
                    if (!workOrderImage) {
                        console.log('Falló la subida de imagen - sin URL');
                        Swal.close();
                        return;
                    }
                    console.log('Imagen subida exitosamente:', workOrderImage);
                } catch (error) {
                    console.error('Error en subida de imagen:', error);
                    Swal.close();
                    this.showError('Error al subir la imagen: ' + error.message);
                    return;
                }
            } else {
                console.log('No hay imagen para subir');
            }

            console.log('Preparando DTO de orden de trabajo...');

            // Validar que el vehículo seleccionado existe en la lista cargada
            console.log('Validando vehículo en lista local...');
            console.log('ID de vehículo seleccionado:', vehicleId, typeof vehicleId);
            console.log('Lista de vehículos disponibles:', this.vehicles.map(v => ({
                id: v.vehicleId,
                tipo: typeof v.vehicleId,
                placa: v.plateNumber
            })));
            
            const selectedVehicle = this.vehicles.find(v => v.vehicleId === parseInt(vehicleId));
            if (!selectedVehicle) {
                console.error('Vehículo no encontrado en lista local');
                console.error('Vehículo buscado:', parseInt(vehicleId));
                console.error('IDs disponibles:', this.vehicles.map(v => v.vehicleId));
                Swal.close();
                this.showError(`El vehículo con ID ${vehicleId} no se encuentra en su lista de vehículos. Por favor, actualice la página e intente nuevamente.`);
                return;
            }

            console.log('Vehículo validado:', selectedVehicle);

            // TEMPORAL: Comentar verificación en servidor para diagnosticar
            // console.log('Verificando vehículo en el servidor...');
            // const vehicleExists = await this.verifyVehicleInServer(parseInt(vehicleId));
            // if (!vehicleExists) {
            //     console.error('Vehículo no encontrado en el servidor');
            //     Swal.close();
            //     this.showError(`El vehículo con ID ${vehicleId} no existe en el servidor. Contacte al administrador.`);
            //     return;
            // }
            // console.log('Vehículo verificado en el servidor');

            // Crear el objeto de la orden de trabajo según el DTO esperado
            // IMPORTANTE: estimatedTime debe ser string según el DTO y workOrderImage debe tener valor
            const workOrderData = {
                vehicleId: parseInt(vehicleId),
                moduleId: parseInt(moduleId),
                estimatedTime: tiempoEstimado.toString(), // Convertir a string según DTO
                workOrderImage: workOrderImage || "sin_imagen", // Valor por defecto si no hay imagen
                idStatus: 1
            };

            console.log('DTO creado:', workOrderData);
            console.log('Verificando tipos de datos en DTO:');
            console.log('- vehicleId:', workOrderData.vehicleId, 'tipo:', typeof workOrderData.vehicleId);
            console.log('- moduleId:', workOrderData.moduleId, 'tipo:', typeof workOrderData.moduleId);
            console.log('- estimatedTime:', workOrderData.estimatedTime, 'tipo:', typeof workOrderData.estimatedTime);
            console.log('- workOrderImage:', workOrderData.workOrderImage, 'tipo:', typeof workOrderData.workOrderImage);
            console.log('- idStatus:', workOrderData.idStatus, 'tipo:', typeof workOrderData.idStatus);
            console.log('Iniciando petición HTTP...');
            console.log('Enviando orden de trabajo:', workOrderData);
            console.log('Detalles del vehículo seleccionado:', {
                vehicleId: selectedVehicle.vehicleId,
                plateNumber: selectedVehicle.plateNumber,
                studentId: selectedVehicle.studentId,
                currentUserId: this.user.student.id
            });

            const response = await fetch('https://sgma-66ec41075156.herokuapp.com/api/workOrders/newWorkOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(workOrderData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
            
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing JSON response:', parseError);
                result = { message: responseText };
            }
            
            console.log('Response data:', result);
            
            Swal.close();

            if (response.ok) {
                // Verificar diferentes formatos de respuesta exitosa
                if (result.Estado === 'Completado' || result.status === 'success' || result.success === true) {
                    this.showSuccess('Orden de trabajo creada exitosamente');
                    this.closeModal();
                    // Recargar la lista de órdenes para mostrar la nueva orden
                    await this.loadWorkOrders();
                } else {
                    throw new Error(result.message || result.Descripción || 'Respuesta inesperada del servidor');
                }
            } else {
                // Error del servidor - mostrar detalles específicos
                let errorMessage = `Error HTTP ${response.status}`;
                
                if (response.status === 400) {
                    // Error de validación
                    errorMessage = 'Error de validación: ';
                    if (result.detail && result.detail.includes('tiempo estimado')) {
                        errorMessage += 'El tiempo estimado es obligatorio y debe ser un valor válido.';
                    } else if (result.detail && result.detail.includes('imagen')) {
                        errorMessage += 'La imagen de la orden de trabajo es obligatoria.';
                    } else if (result.Descripción) {
                        errorMessage += result.Descripción;
                    } else {
                        errorMessage += result.message || 'Verifique que todos los campos requeridos estén completos.';
                    }
                } else if (response.status === 500) {
                    errorMessage = 'Error del servidor: ';
                    if (result.message && result.message.includes('vehiculo no encontrado')) {
                        errorMessage += `El vehículo con ID ${vehicleId} no fue encontrado en la base de datos. Verifique que el vehículo esté registrado correctamente.`;
                    } else {
                        errorMessage += result.message || result.Descripción || result.detail || 'Error interno del servidor';
                    }
                } else {
                    errorMessage = result.message || result.Descripción || result.detail || errorMessage;
                }
                
                throw new Error(errorMessage);
            }

        } catch (error) {
            Swal.close();
            console.error('Error al crear orden de trabajo:', error);
            
            let errorMessage = 'Error al crear la orden de trabajo';
            if (error.message) {
                errorMessage = error.message;
            }
            
            this.showError(errorMessage);
        }
    }

    showSuccess(message) {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: message,
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button'
            },
            confirmButtonText: 'Aceptar'
        });
    }

    showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button'
            },
            confirmButtonText: 'Aceptar'
        });
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    const controller = new OrdenesTrabajoController();
    await controller.init();
});