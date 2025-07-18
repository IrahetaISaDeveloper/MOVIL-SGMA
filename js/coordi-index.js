// Espera a que todo el contenido del DOM (Document Object Model) esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene todas las anclas de la navegación inferior
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');

    // Función para establecer el elemento de navegación activo
    function setActiveNavItem() {
        const currentPath = window.location.pathname.split('/').pop(); // e.g., "coordi-index.html"
        const currentHash = window.location.hash; // e.g., "#inicio"

        navItems.forEach(item => {
            item.classList.remove('active');
            const itemHref = item.getAttribute('href');
            const itemTarget = item.getAttribute('data-target'); // For modals

            // Check if it's the current page's main section or a specific page
            if (currentPath === 'coordi-index.html' && (itemHref === 'coordi-index.html#inicio' || (itemHref === '#inicio' && !currentHash))) {
                item.classList.add('active');
            } else if (itemHref && itemHref.includes(currentPath) && currentPath !== 'coordi-index.html') {
                item.classList.add('active');
            } else if (itemTarget && $(itemTarget).hasClass('show')) { // Check if the modal is currently open
                 item.classList.add('active');
            }
        });
    }

    // Maneja el clic en los elementos de la navegación inferior
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const itemHref = this.getAttribute('href');
            const isModalTrigger = this.hasAttribute('data-toggle') && this.getAttribute('data-toggle') === 'modal';

            // For #inicio link on the same page
            if (itemHref.includes('coordi-index.html#inicio') || (itemHref === '#inicio' && !isModalTrigger)) {
                e.preventDefault(); // Prevent default link behavior
                const targetSection = document.querySelector('#inicio');
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
                setActiveNavItem(); // Set active after scroll
            } else if (!isModalTrigger) {
                // For direct page links (registros.html, reportes.html, admin.html)
                // Let the default link behavior happen (navigate to new page)
                // The setActiveNavItem will run on the new page's DOMContentLoaded
            }
            // For modal triggers, Bootstrap handles the opening, and the 'show.bs.modal' event handles active state
        });
    });

    // Initial active item setting on page load
    setActiveNavItem();

    // Re-evaluate active item on hash change (useful for #inicio on coordi-index.html)
    window.addEventListener('hashchange', setActiveNavItem);

    // --- New logic for Inicio page content ---
    const welcomeMessageElement = document.getElementById('welcomeMessage');
    const vehiclesRegisteredCountElement = document.getElementById('vehiclesRegisteredCount');
    const studentsRegisteredCountElement = document.getElementById('studentsRegisteredCount');

    // Personalized Welcome Message
    const loggedInUserName = localStorage.getItem('loggedInUserName'); // Assuming this is set on login
    if (welcomeMessageElement) {
        if (loggedInUserName) {
            welcomeMessageElement.textContent = `¡Bienvenido/a, ${loggedInUserName}!`;
        } else {
            welcomeMessageElement.textContent = `¡Bienvenido/a al SGMA!`;
        }
    }

    // Dummy data for dashboard cards (replace with actual data fetching from your backend)
    if (vehiclesRegisteredCountElement) {
        // In a real application, you'd fetch this from your database
        vehiclesRegisteredCountElement.textContent = '125'; // Example dummy count
    }
    if (studentsRegisteredCountElement) {
        // In a real application, you'd fetch this from your database
        studentsRegisteredCountElement.textContent = '340'; // Example dummy count
    }

    // --- Module Filtering Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const moduleItems = document.querySelectorAll('.module-item');

    // Function to apply the filter
    function applyModuleFilter(filter) {
        moduleItems.forEach(item => {
            const status = item.dataset.status;
            if (filter === 'all' || status === filter) {
                item.style.display = 'flex'; // Show item
            } else {
                item.style.display = 'none'; // Hide item
            }
        });
    }

    // Add click listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            this.classList.add('active');

            const filter = this.dataset.filter; // Get the filter value (e.g., 'in-process', 'finished', 'all')
            console.log('Filtro seleccionado:', filter); // Debug: Log selected filter
            applyModuleFilter(filter); // Apply the filter
        });
    });

    // Initial filter application on page load (show all modules by default)
    // Find the "Todos" button and simulate a click, or directly apply 'all' filter
    const allFilterButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterButton) {
        allFilterButton.classList.add('active'); // Set "Todos" as active
        applyModuleFilter('all'); // Apply "all" filter
    } else {
        // Fallback if "Todos" button is not found, apply 'all' filter
        applyModuleFilter('all');
    }
});