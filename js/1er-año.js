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
                case 'volver':
                    redirectPage = 'coordi-index.html'; // Redirige a 'tercer-año.html'
                    break;
            }

            // Realiza la redirección
            if (redirectPage) {
                window.location.href = redirectPage;
            }

            sideMenu.classList.remove('active'); // Cierra el menú después de la selección
        });
    });

    //Evento para modal
    const vehicleModal = document.getElementById("vehicleModal");
    // Get all elements that could open the vehicle modal (the three dots icon)
    const openVehicleModalBtns = document.querySelectorAll(".record-item .more-options i.fa-ellipsis-v");
    const closeVehicleModalBtn = vehicleModal.querySelector(".close-btn");

    if (vehicleModal) {
        vehicleModal.style.display = "none"; // Ensure it's hidden initially
    }

    // Add click listener to each "more options" icon
    openVehicleModalBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation(); // Prevent event from bubbling up if parent has a listener
            if (vehicleModal) {
                vehicleModal.style.display = "flex"; // Use flex to center the modal
            }
        };
    });

    closeVehicleModalBtn.onclick = () => {
        vehicleModal.style.display = "none";
    };

    // Cierra el modal si se hace clic fuera del contenido
    window.onclick = (e) => {
        if (e.target === vehicleModal) {
            vehicleModal.style.display = "none";
        }
    };

    // EVENTO PARA MOSTRAR EL PERFIL (CORRECTED REFERENCES)
    // CORRECTED: Get the profile modal element by its ID "perfilModal"
    const perfilModal = document.getElementById("perfilModal");
    // CORRECTED: Get the profile icon element by its new ID "profileIconTrigger"
    const openPerfilModalBtn = document.getElementById("profileIconTrigger");
    // Get the close button inside the profile modal (assuming it has class "close")
    const closePerfilModalBtn = perfilModal ? perfilModal.querySelector(".close") : null;

    // Ensure the profile modal is hidden initially
    if (perfilModal) {
        perfilModal.style.display = "none";
    }

    // Open profile modal when the icon is clicked
    if (openPerfilModalBtn) {
        openPerfilModalBtn.addEventListener('click', () => {
            if (perfilModal) {
                perfilModal.style.display = "flex"; // Use flex to center the modal
                displayUserProfile(); // Call the function to display user profile data
            }
        });
    }

    // Close profile modal when the close button is clicked
    if (closePerfilModalBtn) {
        closePerfilModalBtn.addEventListener('click', () => {
            if (perfilModal) {
                perfilModal.style.display = "none";
            }
        });
    }

    // Close profile modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === perfilModal) {
            perfilModal.style.display = "none";
        }
    });

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

});