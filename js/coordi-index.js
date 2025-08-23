// Espera a que todo el contenido del DOM (Document Object Model) esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {
    // Barra de navegación inferior
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    function setActiveNavItem() {
        const currentPath = window.location.pathname.split('/').pop();
        navItems.forEach(item => {
            item.classList.remove('active');
            const itemHref = item.getAttribute('href');
            if (itemHref && itemHref.includes(currentPath)) {
                item.classList.add('active');
            }
        });
    }
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const itemHref = this.getAttribute('href');
            if (itemHref && itemHref.includes('coordi-index.html')) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveNavItem();
            }
        });
    });
    setActiveNavItem();

    // Usuario y bienvenida
    const nombreUsuarioElemento = document.getElementById('nombreUsuario');
    const nombreUsuarioLogeado = localStorage.getItem('loggedInUserName');
    if (nombreUsuarioElemento && nombreUsuarioLogeado) {
        nombreUsuarioElemento.textContent = nombreUsuarioLogeado.toUpperCase();
    }

    // Conteos (dummy data, puedes conectar con backend)
    const conteoVehiculosRegistradosElemento = document.getElementById('conteoVehiculosRegistrados');
    const conteoAlumnosRegistradosElemento = document.getElementById('conteoAlumnosRegistrados');
    if (conteoVehiculosRegistradosElemento) {
        conteoVehiculosRegistradosElemento.textContent = '125';
    }
    if (conteoAlumnosRegistradosElemento) {
        conteoAlumnosRegistradosElemento.textContent = '340';
    }

    // Filtros de módulos
    const botonesFiltro = document.querySelectorAll('.boton-filtro');
    const elementosModulo = document.querySelectorAll('.elemento-modulo');
    function aplicarFiltroModulos(filtro) {
        elementosModulo.forEach(item => {
            const estado = item.dataset.status;
            if (filtro === 'all' || estado === filtro) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            botonesFiltro.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filtro = this.dataset.filter;
            aplicarFiltroModulos(filtro);
        });
    });
    const botonFiltroTodos = document.querySelector('.boton-filtro[data-filter="all"]');
    if (botonFiltroTodos) {
        botonFiltroTodos.classList.add('active');
        aplicarFiltroModulos('all');
    } else {
        aplicarFiltroModulos('all');
    }
});