// Espera a que todo el contenido del DOM (Document Object Model) esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene referencias a los elementos del menú de navegación.
    const hamburger = document.querySelector('.menu-hamburguesa'); // El botón de hamburguesa.
    const navRight = document.querySelector('.navegacion-derecha'); // La lista de enlaces de navegación.
    const dropdowns = document.querySelectorAll('.menu-desplegable'); // Todos los elementos con submenús.

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

        // Si el clic no fue dentro de las áreas del menú y el menú móvil está activo, ciérralo.
        if (!isClickInsideNav && navRight.classList.contains('active')) {
            navRight.classList.remove('active'); // Oculta el menú lateral.
            hamburger.classList.remove('open'); // Restaura el icono de hamburguesa.
            // Opcional: Cierra cualquier submenú desplegable que pueda estar abierto.
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Maneja los submenús desplegables en modo móvil.
    dropdowns.forEach(dropdown => {
        // Selecciona el enlace dentro del submenú que se supone que abre/cierra el submenú.
        // En este caso, el enlace a "#seccion-modulos".
        const dropdownLink = dropdown.querySelector('a[href="#seccion-modulos"]'); 
        
        if (dropdownLink) {
            dropdownLink.addEventListener('click', function(e) {
                // Solo previene el comportamiento por defecto (desplazamiento a la sección)
                // y maneja el submenú si el menú móvil está activo y la pantalla es pequeña.
                if (window.innerWidth <= 768 && navRight.classList.contains('active')) {
                    e.preventDefault(); // Evita el desplazamiento inmediato.

                    // Cierra otros submenús si están abiertos (para tener solo uno abierto a la vez).
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });

                    // Alterna la clase 'active' en el submenú para mostrarlo/ocultarlo.
                    dropdown.classList.toggle('active'); 
                }
            });
        }
    });

    // Lógica para los filtros de año en la sección de módulos.
    const botonesFiltro = document.querySelectorAll('.boton-filtro-año'); // Botones de filtro de año.
    const tarjetasModulo = document.querySelectorAll('.tarjeta-modulo'); // Todas las tarjetas de módulos.

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            // Obtiene el año seleccionado del atributo 'data-año' del botón.
            const añoSeleccionado = this.getAttribute('data-año');

            // Remueve la clase 'activo' de todos los botones de filtro y la añade al botón clicado.
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            this.classList.add('activo');

            // Recorre todas las tarjetas de módulo.
            tarjetasModulo.forEach(tarjeta => {
                // Si el atributo 'data-año' de la tarjeta coincide con el año seleccionado, la muestra.
                if (tarjeta.getAttribute('data-año') === añoSeleccionado) {
                    tarjeta.style.display = 'flex'; // Muestra la tarjeta usando flex para un mejor layout.
                } else {
                    tarjeta.style.display = 'none'; // Oculta la tarjeta.
                }
            });
        });
    });

    // Asegura que el primer botón de filtro esté activo y las tarjetas correspondientes se muestren al cargar la página.
    const primerBoton = document.querySelector('.boton-filtro-año[data-año="1"]');
    if (primerBoton) {
        primerBoton.click(); // Simula un clic en el primer botón para activar el filtro inicial.
    }

    // Animación de desplazamiento suave al hacer clic en enlaces de anclaje de la barra de navegación.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Identifica si el enlace es el "gatillo" de un submenú desplegable.
            const parentDropdown = this.closest('.menu-desplegable');
            const isDropdownToggler = this.getAttribute('href') === '#seccion-modulos' && parentDropdown;

            // Si no es el enlace principal de un submenú (es decir, es un enlace a una sección).
            if (!isDropdownToggler) {
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
