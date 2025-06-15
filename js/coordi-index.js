// Funcionalidad del menú de hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navRight = document.querySelector('.nav-right');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (hamburger && navRight) {
        hamburger.addEventListener('click', function() {
            navRight.classList.toggle('active');
            hamburger.classList.toggle('open');
        });
    }

    // Cerrar el menú si se hace clic fuera de él en dispositivos móviles
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navRight.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navRight.classList.contains('active')) {
            navRight.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });

    // Manejar dropdowns en móvil
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a[href="#seccion-cursos"]'); // El link principal del dropdown
        if (dropdownLink) {
            dropdownLink.addEventListener('click', function(e) {
                // Solo prevenir el default si el menú móvil está activo
                if (window.innerWidth <= 768 && navRight.classList.contains('active')) {
                    e.preventDefault(); // Evita que se desplace a la sección inmediatamente
                    dropdown.classList.toggle('active'); // Muestra/oculta el dropdown
                }
            });
        }
    });

    // Filtros en los registros pendientes
    const botonesFiltro = document.querySelectorAll('.filtro-año');
    const tarjetasRegistro = document.querySelectorAll('.registro-tarjeta');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            const añoSeleccionado = this.getAttribute('data-año');

            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            this.classList.add('activo');

            tarjetasRegistro.forEach(tarjeta => {
                if (tarjeta.getAttribute('data-año') === añoSeleccionado) {
                    tarjeta.style.display = 'flex'; // Cambiado a flex para un mejor control del layout en móviles
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });

    // Asegurarse de que el primer botón esté activo y las tarjetas del primer año se muestren inicialmente
    const primerBoton = document.querySelector('.filtro-año[data-año="1"]');
    if (primerBoton) {
        primerBoton.click(); // Simula un clic para activar el primer filtro al cargar
    }

    // Animacion clic nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Cerrar el menú móvil si está abierto
            if (navRight.classList.contains('active')) {
                navRight.classList.remove('active');
                hamburger.classList.remove('open');
            }

            // Desplazamiento suave
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    /*
    // --- CÓDIGO PARA MOSTRAR EL NOMBRE DE USUARIO EN EL NAVBAR ---
    // (Descomenta y ajusta si necesitas esta funcionalidad)
    // 1. Intentar obtener el nombre de usuario guardado en localStorage.
    const savedUserName = localStorage.getItem('userNameToDisplay');

    // 2. Encontrar el elemento del navbar donde queremos mostrar el nombre.
    const userNameNavElement = document.getElementById('nombre-usuario-nav');

    // 3. Si encontramos el nombre de usuario guardado y el elemento en el navbar...
    if (savedUserName && userNameNavElement) {
        // ...entonces mostramos el nombre.
        userNameNavElement.textContent = `Ing. ${savedUserName}`; // Añadimos "Ing." como en tu imagen
    }
    */
});

// Nota sobre el carrusel: Tu código HTML ya incluye el carrusel de Bootstrap,
// lo cual es ideal para responsividad. El JS original de tu carrusel
// personalizado (carouselContainer, carouselSlides, etc.) es redundante
// si usas el de Bootstrap. He dejado solo los scripts de Bootstrap en el HTML
// para el carrusel y he eliminado tu JS custom para el mismo en este archivo.
// Si deseas usar un carrusel 100% custom, tendrías que adaptar su lógica para
// ser responsiva o simplemente usar el de Bootstrap que ya lo es.