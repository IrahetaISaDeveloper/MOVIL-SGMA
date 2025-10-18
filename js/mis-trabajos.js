import { me } from './services/authServiceStudents.js';

class MisTrabajosController {
    constructor() {
        this.user = null;
        this.workOrders = [];
        this.filteredOrders = [];
        this.container = null;
        // Propiedades de paginación
        this.currentPage = 1;
        this.ordersPerPage = 4;
        this.totalOrders = 0;
        // Propiedades de búsqueda
        this.searchTerm = '';
        this.searchInput = null;
    }

    async init() {
        try {
            await this.initializeAuth();
            this.initializeElements();
            this.bindEvents();
            await this.loadWorkOrders();
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
        this.container = document.getElementById('trabajos-container');
        this.searchInput = document.getElementById('search-orders');
    }

    bindEvents() {
        // Buscador de órdenes
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.currentPage = 1; // Resetear a primera página
                this.filterAndDisplayOrders();
            });
        }
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

            let orders = [];
            if (data.workOrders && Array.isArray(data.workOrders)) {
                orders = data.workOrders;
            }

            this.workOrders = orders;
            this.filterAndDisplayOrders();

        } catch (error) {
            console.error('Error al cargar órdenes de trabajo:', error);
            this.showError('Error al cargar las órdenes de trabajo');
            this.filterAndDisplayOrders();
        }
    }

    filterAndDisplayOrders() {
        // Filtrar órdenes según el término de búsqueda
        if (this.searchTerm === '') {
            this.filteredOrders = [...this.workOrders];
        } else {
            this.filteredOrders = this.workOrders.filter(order => {
                const vehiclePlate = (order.vehiclePlateNumber || '').toLowerCase();
                const moduleName = (order.moduleName || '').toLowerCase();
                const orderNumber = order.workOrderId.toString();
                const description = (order.description || '').toLowerCase();
                
                return vehiclePlate.includes(this.searchTerm) ||
                       moduleName.includes(this.searchTerm) ||
                       orderNumber.includes(this.searchTerm) ||
                       description.includes(this.searchTerm);
            });
        }

        this.totalOrders = this.filteredOrders.length;

        if (this.filteredOrders.length === 0) {
            if (this.searchTerm === '') {
                this.container.innerHTML = `
                    <div class="empty-work-orders">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No tienes órdenes de trabajo</h3>
                        <p>Aún no has creado ninguna orden de trabajo. Cuando crees una, aparecerá aquí con toda la información detallada.</p>
                        <a href="ordenes-trabajo.html" class="create-order-button">
                            <i class="fas fa-plus"></i>
                            Crear Primera Orden
                        </a>
                    </div>
                `;
            } else {
                this.container.innerHTML = `
                    <div class="empty-work-orders">
                        <i class="fas fa-search"></i>
                        <h3>No se encontraron resultados</h3>
                        <p>No hay órdenes que coincidan con "${this.searchTerm}"</p>
                        <button onclick="document.getElementById('search-orders').value=''; document.getElementById('search-orders').dispatchEvent(new Event('input'))" class="clear-search-button">
                            <i class="fas fa-times"></i>
                            Limpiar búsqueda
                        </button>
                    </div>
                `;
            }
            return;
        }

        // Calcular paginación
        const totalPages = Math.ceil(this.totalOrders / this.ordersPerPage);
        const startIndex = (this.currentPage - 1) * this.ordersPerPage;
        const endIndex = startIndex + this.ordersPerPage;
        const paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);

        // Generar HTML de las órdenes
        const ordenesHTML = paginatedOrders.map(order => this.createWorkOrderCard(order)).join('');
        
        // Generar HTML de paginación
        const paginationHTML = this.createPaginationHTML(totalPages);
        
        // Mostrar órdenes y paginación
        this.container.innerHTML = ordenesHTML + paginationHTML;
        
        // Agregar event listeners para paginación
        this.bindPaginationEvents();
    }

    createWorkOrderCard(order) {
        const statusText = this.getStatusText(order.idStatus);
        const statusClass = this.getStatusClass(order.idStatus);
        
        const vehiclePlate = order.vehiclePlateNumber || 'Sin placa';
        const moduleName = order.moduleName || 'Sin módulo';
        const estimatedTime = order.estimatedTime || 'No especificado';
        const description = order.description || '';
        const hasImage = order.workOrderImage && 
                         order.workOrderImage !== 'sin_imagen' && 
                         order.workOrderImage !== null && 
                         order.workOrderImage.trim() !== '';

        let actionButton = '';
        if (order.idStatus !== 5) {
            // Usar onclick con función global simple
            actionButton = `
                <a href="#" class="action-button" onclick="handleOrderDetails(${order.workOrderId}); return false;">
                    <i class="fas fa-eye"></i>
                    Ver Detalles
                </a>
            `;
        }

        return `
            <div class="work-order-card">
                <div class="work-order-header">
                    <div class="order-title-row">
                        <div class="order-number">
                            <i class="fas fa-hashtag"></i>
                            Orden ${order.workOrderId}
                        </div>
                        <div class="order-status status-${statusClass}">
                            ${statusText}
                        </div>
                    </div>
                    <div class="vehicle-info">
                        <i class="fas fa-car"></i>
                        <span>${vehiclePlate}</span>
                    </div>
                </div>

                <div class="work-order-content">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">
                                <i class="fas fa-book"></i>
                                Módulo
                            </div>
                            <div class="info-value">${moduleName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">
                                <i class="fas fa-clock"></i>
                                Tiempo Estimado
                            </div>
                            <div class="info-value">${estimatedTime} ${estimatedTime !== 'No especificado' ? 'horas' : ''}</div>
                        </div>
                    </div>

                    ${description ? `
                        <div class="description-section">
                            <div class="description-header">
                                <i class="fas fa-clipboard-list"></i>
                                Descripción del Trabajo
                            </div>
                            <div class="description-text">${description}</div>
                        </div>
                    ` : ''}

                    <div class="order-image-section">
                        ${hasImage ? `
                            <div class="order-image-container">
                                <img src="${order.workOrderImage}" alt="Imagen de orden" class="order-image" />
                                <div class="image-overlay-badge">
                                    <i class="fas fa-image"></i>
                                    Evidencia
                                </div>
                            </div>
                        ` : `
                            <div class="no-image-placeholder">
                                <i class="fas fa-image"></i>
                                <span>Sin imagen adjunta</span>
                            </div>
                        `}
                    </div>
                </div>

                <div class="work-order-footer">
                    <div class="time-info">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Creada recientemente</span>
                    </div>
                    ${actionButton}
                </div>
            </div>
        `;
    }

    createPaginationHTML(totalPages) {
        if (totalPages <= 1) return '';

        const startItem = (this.currentPage - 1) * this.ordersPerPage + 1;
        const endItem = Math.min(this.currentPage * this.ordersPerPage, this.totalOrders);

        let paginationHTML = `
            <div class="pagination-container">
                <button class="pagination-button" id="prev-page" ${this.currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                    Anterior
                </button>
                
                <div class="pagination-numbers">
        `;

        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<span class="page-number" data-page="1">1</span>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<span class="page-number ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</span>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<span class="page-number" data-page="${totalPages}">${totalPages}</span>`;
        }

        paginationHTML += `
                </div>
                
                <button class="pagination-button" id="next-page" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Siguiente
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div class="pagination-info">
                ${this.searchTerm ? `Mostrando ${startItem}-${endItem} de ${this.totalOrders} resultados para "${this.searchTerm}"` : `Mostrando ${startItem}-${endItem} de ${this.totalOrders} órdenes`}
            </div>
        `;

        return paginationHTML;
    }

    bindPaginationEvents() {
        const prevBtn = document.getElementById('prev-page');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.filterAndDisplayOrders();
                }
            });
        }

        const nextBtn = document.getElementById('next-page');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.totalOrders / this.ordersPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.filterAndDisplayOrders();
                }
            });
        }

        const pageNumbers = document.querySelectorAll('.page-number');
        pageNumbers.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page !== this.currentPage) {
                    this.currentPage = page;
                    this.filterAndDisplayOrders();
                }
            });
        });
    }

    getStatusText(idStatus) {
        switch(idStatus) {
            case 1: return 'En Aprobación del Animador';
            case 2: return 'En Aprobación del Coordinador';
            case 3: return 'Aprobado - En Progreso';
            case 4: return 'Completado';
            case 5: return 'Rechazado';
            case 6: return 'Atrasado';
            default: return 'Desconocido';
        }
    }

    getStatusClass(idStatus) {
        switch(idStatus) {
            case 1: return 'en-aprobacion-animador';
            case 2: return 'en-aprobacion-coordinador';
            case 3: return 'aprobado-progreso';
            case 4: return 'completado';
            case 5: return 'rechazado';
            case 6: return 'atrasado';
            default: return 'pendiente';
        }
    }

    showError(message) {
        console.error(message);
        if (this.container) {
            this.container.innerHTML = `
                <div class="empty-work-orders">
                    <i class="fas fa-exclamation-triangle" style="color: #f44336;"></i>
                    <h3>Error al cargar</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="create-order-button">
                        <i class="fas fa-refresh"></i>
                        Reintentar
                    </button>
                </div>
            `;
        } else {
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

    showOrderDetails(orderId) {
        const order = this.workOrders.find(o => o.workOrderId === orderId);
        if (!order) return;

        if (order.idStatus === 1 || order.idStatus === 2) {
            this.showApprovalMessage(order);
        } else if (order.idStatus === 3) {
            this.showProgressModal(order);
        } else if (order.idStatus === 4) {
            this.showCompletedModal(order);
        } else if (order.idStatus === 6) {
            this.showDelayedModal(order);
        }
    }

    showApprovalMessage(order) {
        const statusText = order.idStatus === 1 ? 'animador' : 'coordinadora';
        
        Swal.fire({
            icon: 'info',
            title: 'Orden en Proceso de Aprobación',
            html: `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-hourglass-half" style="font-size: 3em; color: #FFC107; margin-bottom: 15px;"></i>
                    <p>Tu orden de trabajo está en proceso de aprobación del <strong>${statusText}</strong>.</p>
                    <p>Espera a que el animador y el coordinador aprueben tu solicitud de orden de trabajo.</p>
                </div>
            `,
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button'
            },
            confirmButtonText: 'Entendido'
        });
    }

    showProgressModal(order) {
        Swal.fire({
            title: `Orden de Trabajo #${order.workOrderId}`,
            html: `
                <div style="text-align: left; padding: 10px;">
                    <div style="background: rgba(66, 165, 245, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #42A5F5; margin: 0 0 10px 0;"><i class="fas fa-car"></i> Detalles del Vehículo</h4>
                        <p><strong>Placa:</strong> ${order.vehiclePlateNumber || 'Sin placa'}</p>
                        <p><strong>Marca:</strong> ${order.vehicleBrand || 'No especificada'}</p>
                        <p><strong>Modelo:</strong> ${order.vehicleModel || 'No especificado'}</p>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                        <h4 style="color: #42A5F5; margin: 0 0 10px 0;"><i class="fas fa-clipboard-list"></i> Detalles de la Orden</h4>
                        <p><strong>Módulo:</strong> ${order.moduleName || 'Sin módulo'}</p>
                        <p><strong>Tiempo Estimado:</strong> ${order.estimatedTime || 'No especificado'} horas</p>
                        <p><strong>Estado:</strong> ${this.getStatusText(order.idStatus)}</p>
                        ${order.description ? `<p><strong>Descripción:</strong> ${order.description}</p>` : ''}
                    </div>
                </div>
            `,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Finalizar Orden',
            denyButtonText: 'Atrasar Orden',
            cancelButtonText: 'Cerrar',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button',
                cancelButton: 'swal-custom-cancel-button',
                denyButton: 'swal-custom-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.completeOrder(order.workOrderId);
            } else if (result.isDenied) {
                this.delayOrder(order.workOrderId);
            }
        });
    }

    showCompletedModal(order) {
        Swal.fire({
            icon: 'success',
            title: '¡Felicidades!',
            html: `
                <div style="text-align: center; padding: 20px;">
                    <p>Esta orden ya ha sido finalizada con éxito</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Ver Detalles de la Orden',
            cancelButtonText: 'Cerrar',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button',
                cancelButton: 'swal-custom-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.showOrderDetailsOnly(order);
            }
        });
    }

    showOrderDetailsOnly(order) {
        Swal.fire({
            title: `Orden de Trabajo #${order.workOrderId}`,
            html: `
                <div style="text-align: left; padding: 10px;">
                    <div style="background: rgba(66, 165, 245, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #42A5F5; margin: 0 0 10px 0;"><i class="fas fa-car"></i> Detalles del Vehículo</h4>
                        <p><strong>Placa:</strong> ${order.vehiclePlateNumber || 'Sin placa'}</p>
                        <p><strong>Marca:</strong> ${order.vehicleBrand || 'No especificada'}</p>
                        <p><strong>Modelo:</strong> ${order.vehicleModel || 'No especificado'}</p>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                        <h4 style="color: #42A5F5; margin: 0 0 10px 0;"><i class="fas fa-clipboard-list"></i> Detalles de la Orden</h4>
                        <p><strong>Módulo:</strong> ${order.moduleName || 'Sin módulo'}</p>
                        <p><strong>Tiempo Estimado:</strong> ${order.estimatedTime || 'No especificado'} horas</p>
                        <p><strong>Estado:</strong> ${this.getStatusText(order.idStatus)}</p>
                        ${order.description ? `<p><strong>Descripción:</strong> ${order.description}</p>` : ''}
                    </div>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button'
            }
        });
    }

    showDelayedModal(order) {
        Swal.fire({
            title: `Orden de Trabajo #${order.workOrderId}`,
            html: `
                <div style="text-align: left; padding: 10px;">
                    <div style="background: rgba(66, 165, 245, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <h4 style="color: #42A5F5; margin: 0 0 10px 0;"><i class="fas fa-car"></i> Detalles del Vehículo</h4>
                        <p><strong>Placa:</strong> ${order.vehiclePlateNumber || 'Sin placa'}</p>
                        <p><strong>Marca:</strong> ${order.vehicleBrand || 'No especificada'}</p>
                        <p><strong>Modelo:</strong> ${order.vehicleModel || 'No especificado'}</p>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                        <h4 style="color: #42A5F5; margin: 0 0 10px 0;"><i class="fas fa-clipboard-list"></i> Detalles de la Orden</h4>
                        <p><strong>Módulo:</strong> ${order.moduleName || 'Sin módulo'}</p>
                        <p><strong>Tiempo Estimado:</strong> ${order.estimatedTime || 'No especificado'} horas</p>
                        <p><strong>Estado:</strong> ${this.getStatusText(order.idStatus)}</p>
                        ${order.description ? `<p><strong>Descripción:</strong> ${order.description}</p>` : ''}
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Finalizar Orden',
            cancelButtonText: 'Cerrar',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button',
                cancelButton: 'swal-custom-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.completeOrder(order.workOrderId);
            }
        });
    }

    async delayOrder(orderId) {
        const result = await Swal.fire({
            icon: 'question',
            title: '¿Atrasar orden?',
            text: '¿Estás seguro de que quieres atrasar esta orden de trabajo?',
            showCancelButton: true,
            confirmButtonText: 'Sí, atrasar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button',
                cancelButton: 'swal-custom-cancel-button'
            }
        });

        if (result.isConfirmed) {
            try {
                await this.updateOrderStatus(orderId, 6);
                
                await Swal.fire({
                    icon: 'success',
                    title: '¡Orden atrasada!',
                    text: 'La orden de trabajo ha sido marcada como atrasada',
                    customClass: {
                        popup: 'swal-custom-popup',
                        title: 'swal-custom-title',
                        content: 'swal-custom-content',
                        confirmButton: 'swal-custom-confirm-button'
                    }
                });
                
                await this.loadWorkOrders();
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al atrasar la orden de trabajo: ' + error.message,
                    customClass: {
                        popup: 'swal-custom-popup',
                        title: 'swal-custom-title',
                        content: 'swal-custom-content',
                        confirmButton: 'swal-custom-confirm-button'
                    }
                });
            }
        }
    }

    async completeOrder(orderId) {
        const result = await Swal.fire({
            icon: 'question',
            title: '¿Finalizar orden?',
            text: '¿Estás seguro de que quieres finalizar esta orden de trabajo?',
            showCancelButton: true,
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button',
                cancelButton: 'swal-custom-cancel-button'
            }
        });

        if (result.isConfirmed) {
            try {
                await this.updateOrderStatus(orderId, 4);
                
                await Swal.fire({
                    icon: 'success',
                    title: '¡Orden finalizada!',
                    text: 'La orden de trabajo ha sido finalizada exitosamente',
                    customClass: {
                        popup: 'swal-custom-popup',
                        title: 'swal-custom-title',
                        content: 'swal-custom-content',
                        confirmButton: 'swal-custom-confirm-button'
                    }
                });
                
                await this.loadWorkOrders();
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al finalizar la orden de trabajo: ' + error.message,
                    customClass: {
                        popup: 'swal-custom-popup',
                        title: 'swal-custom-title',
                        content: 'swal-custom-content',
                        confirmButton: 'swal-custom-confirm-button'
                    }
                });
            }
        }
    }

    async updateOrderStatus(orderId, newStatus) {
        const response = await fetch(`https://sgma-66ec41075156.herokuapp.com/api/workOrders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Student-Id': this.user.student.id.toString()
            },
            credentials: 'include',
            body: JSON.stringify({ idStatus: newStatus })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el estado');
        }

        return response.json();
    }
}

// Variable global para el controlador
let controllerInstance = null;

// Función global simple para manejar detalles de orden
window.handleOrderDetails = function(orderId) {
    if (controllerInstance) {
        controllerInstance.showOrderDetails(orderId);
    } else {
        console.error('Controller not initialized');
    }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    controllerInstance = new MisTrabajosController();
    await controllerInstance.init();
});
