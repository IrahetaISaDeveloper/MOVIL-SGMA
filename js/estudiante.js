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

    // Animaciones de entrada
    animarElementos();
});

function cargarEstadisticas() {
    // Simular carga de datos desde la base de datos
    // En una implementación real, harías una petición AJAX/fetch a tu backend
    
    const estadisticasSimuladas = {
        vehiculos: Math.floor(Math.random() * 10) + 1,
        trabajosActivos: Math.floor(Math.random() * 5),
        trabajosCompletados: Math.floor(Math.random() * 15) + 5
    };

    // Animar los números
    animarContador('totalVehiculos', estadisticasSimuladas.vehiculos);
    animarContador('trabajosActivos', estadisticasSimuladas.trabajosActivos);
    animarContador('trabajosCompletados', estadisticasSimuladas.trabajosCompletados);
}

function animarContador(elementId, valorFinal) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;

    let valorActual = 0;
    const incremento = valorFinal / 50; // 50 pasos para la animación
    const intervalo = setInterval(() => {
        valorActual += incremento;
        if (valorActual >= valorFinal) {
            valorActual = valorFinal;
            clearInterval(intervalo);
        }
        elemento.textContent = Math.floor(valorActual);
    }, 30);
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