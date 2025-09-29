document.addEventListener('DOMContentLoaded', () => {
    // Elementos del header
    const nombreUsuarioHeader = document.getElementById('nombreUsuarioHeader');
    const rolUsuarioHeader = document.getElementById('rolUsuarioHeader');
    const detalleUsuarioHeader = document.getElementById('detalleUsuarioHeader');
    const avatarUsuarioHeader = document.getElementById('avatarUsuarioHeader');

    // Elementos de estadísticas
    const totalVehiculos = document.getElementById('totalVehiculos');
    const trabajosActivos = document.getElementById('trabajosActivos');
    const trabajosCompletados = document.getElementById('trabajosCompletados');

    // Datos del usuario desde localStorage
    const loggedInUserName = localStorage.getItem('loggedInUserName');
    const loggedInUserPhoto = localStorage.getItem('loggedInUserPhoto');
    const loggedInUserRole = localStorage.getItem('loggedInUserRole') || 'Estudiante';
    const loggedInUserDetail = localStorage.getItem('loggedInUserDetail') || 'Taller Automotriz';

    // Configurar información del usuario en el header
    if (nombreUsuarioHeader) {
        nombreUsuarioHeader.textContent = loggedInUserName || 'Usuario';
    }
    if (rolUsuarioHeader) {
        rolUsuarioHeader.textContent = loggedInUserRole;
    }
    if (detalleUsuarioHeader) {
        detalleUsuarioHeader.textContent = loggedInUserDetail;
    }

    if (avatarUsuarioHeader && loggedInUserPhoto) {
        avatarUsuarioHeader.src = loggedInUserPhoto;
    } else if (avatarUsuarioHeader) {
        avatarUsuarioHeader.src = 'imgs/defaul-user.webp';
    }

    // Event listener para el perfil del usuario
    const perfilUsuarioNav = document.getElementById('perfilUsuarioNav');
    if (perfilUsuarioNav) {
        perfilUsuarioNav.addEventListener('click', () => {
            window.location.href = 'perfil.html';
        });
    }

    // Simular datos de estadísticas (aquí conectarías con tu base de datos)
    cargarEstadisticas();
    cargarCantidadVehiculos();
    cargarTrabajosEnProgreso();
    cargarTrabajosCompletados();

    // Animaciones de entrada
    animarElementos();
});

function cargarEstadisticas() {
    // Aquí puedes implementar la carga real de trabajos activos y completados si tienes endpoints.
    // Por ahora, no se generan datos aleatorios para vehículos.
}

function animarElementos() {
    // Observador para animaciones de entrada
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Observar elementos que necesitan animación
    const elementosAnimados = document.querySelectorAll('.tarjeta, .estadistica-item, .tarjeta-bienvenida');
    elementosAnimados.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'all 0.6s ease';
        observer.observe(elemento);
    });
}

function mostrarAyuda() {
    alert('¡Bienvenido al Sistema de Gestión del Taller de Mantenimiento Automotriz!\n\n' +
          'Aquí puedes:\n' +
          '• Registrar tus vehículos para mantenimiento\n' +
          '• Revisar el progreso de tus trabajos\n' +
          '• Actualizar tu perfil personal\n' +
          '• Ver el historial de tus trabajos\n\n' +
          'Si necesitas ayuda adicional, contacta con el Animador de la especialidad.');
}

// Funciones auxiliares para futuras implementaciones
function actualizarEstadisticas() {
    // Función para actualizar estadísticas en tiempo real
    cargarEstadisticas();
}

function notificarCambioEstado() {
    // Función para mostrar notificaciones cuando cambien los estados de los trabajos
    // Se puede implementar con toast notifications o similar
}

function cargarCantidadVehiculos() {
    const studentId = obtenerStudentIdDesdeCookie();
    if (!studentId) return;

    fetch(`https://sgma-66ec41075156.herokuapp.com/api/getVehiclesByStudentId/${studentId}`)
        .then(response => response.json())
        .then(data => {
            const totalVehiculos = document.getElementById('totalVehiculos');
            if (!totalVehiculos) return;
            if (data && data.data && data.data.vehicles) {
                totalVehiculos.textContent = data.data.vehicles.length;
            } else {
                totalVehiculos.textContent = '0';
            }
        })
        .catch(() => {
            const totalVehiculos = document.getElementById('totalVehiculos');
            if (totalVehiculos) totalVehiculos.textContent = '0';
        });
}

function cargarTrabajosEnProgreso() {
    const studentId = obtenerStudentIdDesdeCookie();
    if (!studentId) return;

    fetch(`https://sgma-66ec41075156.herokuapp.com/api/getWorkOrdersByStudentIdAndStatus2/${studentId}`)
        .then(response => response.json())
        .then(data => {
            const trabajosActivos = document.getElementById('trabajosActivos');
            if (!trabajosActivos) return;
            if (data && data.workOrders) {
                trabajosActivos.textContent = data.workOrders.length;
            } else {
                trabajosActivos.textContent = '0';
            }
        })
        .catch(() => {
            const trabajosActivos = document.getElementById('trabajosActivos');
            if (trabajosActivos) trabajosActivos.textContent = '0';
        });
}

function cargarTrabajosCompletados() {
    const studentId = obtenerStudentIdDesdeCookie();
    if (!studentId) return;

    fetch(`https://sgma-66ec41075156.herokuapp.com/api/getWorkOrdersByStudentIdAndStatus3/${studentId}`)
        .then(response => response.json())
        .then(data => {
            const trabajosCompletados = document.getElementById('trabajosCompletados');
            if (!trabajosCompletados) return;
            if (data && data.workOrders) {
                trabajosCompletados.textContent = data.workOrders.length;
            } else {
                trabajosCompletados.textContent = '0';
            }
        })
        .catch(() => {
            const trabajosCompletados = document.getElementById('trabajosCompletados');
            if (trabajosCompletados) trabajosCompletados.textContent = '0';
        });
}

// Obtiene el studentId del token de sesión en la cookie
function obtenerStudentIdDesdeCookie() {
    const nombreCookie = 'sessionToken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [nombre, valor] = cookie.trim().split('=');
        if (nombre === nombreCookie) {
            try {
                // Suponiendo que el token es un JWT y el studentId está en el payload
                const payload = JSON.parse(atob(valor.split('.')[1]));
                return payload.studentId;
            } catch {
                return null;
            }
        }
    }
    return null;
}