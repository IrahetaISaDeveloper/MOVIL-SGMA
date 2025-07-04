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

    // Función para mostrar los datos del perfil del usuario
    function displayUserProfile() {
        const profileContentDiv = document.getElementById('profile-content');
        if (profileContentDiv) {
            const userName = localStorage.getItem('loggedInUserName');
            const userPhoto = localStorage.getItem('loggedInUserPhoto');

            let profileHtml = '';
            if (userName) {
                profileHtml += `
                    <div class="profile-display">
                        ${userPhoto ? `<img src="${userPhoto}" alt="Foto de Perfil" class="profile-picture">` : `<i class="fas fa-user-circle default-profile-icon"></i>`}
                        <p class="user-name">${userName}</p>
                    </div>
                `;
            } else {
                profileHtml = '<p>No se encontraron datos de perfil. Por favor, inicia sesión.</p>';
            }
            profileContentDiv.innerHTML = profileHtml;
        }
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

    // Event listener for when the profile modal is shown
    $('#perfilModal').on('show.bs.modal', function (e) {
        displayUserProfile(); // Load profile data when modal is about to be shown
        setActiveNavItem(); // Set active for profile modal
    });

    // Event listener for when any modal is hidden
    $('.modal').on('hidden.bs.modal', function (e) {
        setActiveNavItem(); // Re-evaluate active item after modal closes
    });

    // Initial active item setting on page load
    setActiveNavItem();

    // Re-evaluate active item on hash change (useful for #inicio on coordi-index.html)
    window.addEventListener('hashchange', setActiveNavItem);
});