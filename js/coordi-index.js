// Espera a que todo el contenido del DOM (Document Object Model) esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene referencias a los elementos del menú de navegación.
    const hamburger = document.querySelector('.hamburger'); // El botón de hamburguesa.
    // CORRECCIÓN: Cambiado de '.navegacion-derecha' a '.nav-right' para coincidir con el HTML
    const navRight = document.querySelector('.nav-right'); // La lista de enlaces de navegación.
    const dropdowns = document.querySelectorAll('.dropdown'); // Todos los elementos con submenús.

    // Si el botón de hamburguesa y la navegación derecha existen, añade el evento de clic.
    if (hamburger && navRight) {
        hamburger.addEventListener('click', function() {
            // Alterna la clase 'active' en la navegación derecha para mostrar/ocultar el menú lateral.
            navRight.classList.toggle('active');
            // Alterna la clase 'open' en el botón de hamburguesa para su animación (convertir a 'X').
            hamburger.classList.toggle('open');
        });
    }

    // Cierra el menú móvil si se hace clic fuera de él.
    document.addEventListener('click', function(event) {
        // Comprueba si el clic ocurrió dentro del menú de navegación, el botón de hamburguesa,
        // o dentro de alguno de los submenús desplegables.
        const isClickInsideNav = navRight.contains(event.target) ||
                               hamburger.contains(event.target) ||
                               Array.from(dropdowns).some(dropdown => dropdown.contains(event.target));

        // Si el clic no fue dentro de los elementos del menú y el menú está activo, ciérralo.
        if (!isClickInsideNav && navRight.classList.contains('active')) {
            navRight.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });

    // Manejo del dropdown en móvil
    document.querySelectorAll('.navbar-mobile .dropdown > a').forEach(dropdownToggler => {
        dropdownToggler.addEventListener('click', function(e) {
            // Previene el comportamiento predeterminado del enlace solo si es un enlace de menú móvil.
            // Para el caso de `#seccion-modulos` u otros, aún debe hacer scroll.
            // La lógica aquí es más compleja: queremos que el dropdown se abra/cierre
            // pero que también el enlace #seccion-cursos o #seccion-modulos haga scroll.

            // Comprobamos si el padre es el contenedor de dropdowns y si estamos en una vista móvil
            const isMobileView = window.innerWidth <= 768; // O el breakpoint que uses en CSS

            if (isMobileView) {
                // Solo para el dropdown de "Cursos" (o cualquier otro que tenga un submenú real)
                // y no para enlaces que son solo anclas directas a secciones (como Módulos)
                // if (this.closest('.dropdown')) { // Esto ya lo sabemos porque estamos iterando sobre .dropdown > a
                if (this.getAttribute('href') === '#seccion-cursos') { // Asumiendo que 'Cursos' es el único dropdown que no es directamente a una sección.
                    e.preventDefault(); // Previene la navegación inmediata para permitir el toggle del dropdown.
                    this.parentElement.classList.toggle('active'); // Activa/desactiva el dropdown
                }
            }
        });
    });


    // Filtro de años para los módulos
    const botonesFiltro = document.querySelectorAll('.filtro-año');
    const tarjetasModulo = document.querySelectorAll('.tarjeta-modulo'); // Ya corregido en HTML

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            // Elimina la clase 'activo' de todos los botones y añade al clicado
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');

            const añoSeleccionado = this.dataset.año;

            // Muestra/oculta las tarjetas según el año seleccionado
            tarjetasModulo.forEach(tarjeta => {
                if (tarjeta.dataset.año === añoSeleccionado) {
                    tarjeta.style.display = 'flex'; // O 'block', 'grid', dependiendo de tu CSS original
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });

    // Simula un clic en el botón "1er Año" al cargar la página.
    const primerBoton = document.querySelector('.boton-filtro-año[data-año="1"]');
    if (primerBoton) {
        primerBoton.click(); // Simula un clic en el primer botón para activar el filtro inicial.
    }

    // Animación de desplazamiento suave al hacer clic en enlaces de anclaje de la barra de navegación.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Identifica si el enlace es el \"gatillo\" de un submenú desplegable en el *contexto anterior*.
            // Con el HTML actualizado, el dropdown para "Cursos" ya tiene su propia clase 'dropdown'.
            // La lógica para #seccion-modulos como un toggler de dropdown ya no es necesaria si solo "Cursos" tiene un submenú.
            // Si el enlace clicado es el que inicia un dropdown (ej. "Cursos"), y no es un elemento dentro del dropdown.
            const isDropdownToggler = this.closest('.dropdown') && this.getAttribute('href') === '#seccion-cursos';

            // Si no es el enlace principal de un submenú (es decir, es un enlace a una sección)
            // O si es un enlace dentro de un dropdown (e.g. 1er año, 2do año, que van a otra página)
            // No queremos prevenir el default si va a otra página (pending-registers.html)
            if (!isDropdownToggler && !this.getAttribute('href').endsWith('.html')) {
                e.preventDefault(); // Previene el comportamiento por defecto de desplazamiento instantáneo.

                // Cierra el menú móvil si está abierto.
                if (navRight.classList.contains('active')) {
                    navRight.classList.remove('active');
                    hamburger.classList.remove('open');
                }

                // Realiza un desplazamiento suave a la sección correspondiente.
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});