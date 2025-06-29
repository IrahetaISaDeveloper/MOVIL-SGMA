document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle'); // Asegúrate de tener este elemento en tu HTML para abrir el menú
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');

    // Function to open the menu (assuming menuToggle exists)
    if (menuToggle) { // Asegúrate de que el elemento existe antes de añadir el event listener
        menuToggle.addEventListener('click', () => {
            sideMenu.classList.add('active');
        });
    }

    // Function to close the menu
    closeMenu.addEventListener('click', () => {
        sideMenu.classList.remove('active');
    });

    // Handle clicks on menu items to redirect to a page
    const menuLinks = sideMenu.querySelectorAll('ul li a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Previene el comportamiento por defecto del enlace (que es recargar la misma página si href="#")

            const level = event.target.dataset.level; // Obtiene el valor del atributo data-level

            let redirectPage = ''; // Variable para almacenar la URL de la página a redirigir

            switch (level) {
                case 'primer':
                    redirectPage = 'primer-año.html'; // Redirige a 'primer-año.html'
                    break;
                case 'segundo':
                    redirectPage = 'segundo-año.html'; // Redirige a 'segundo-año.html'
                    break;
                case 'tercero':
                    redirectPage = 'tercer-año.html'; // Redirige a 'tercer-año.html'
                    break;
                default:
                    console.warn('Nivel no reconocido:', level);
                    return; // Sale de la función si el nivel no es reconocido
            }

            // Realiza la redirección
            if (redirectPage) {
                window.location.href = redirectPage;
            }

            sideMenu.classList.remove('active'); // Cierra el menú después de la selección
        });
    });
});
