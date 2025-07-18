document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');

    // Get the bottom navigation menu element
    const bottomNav = document.querySelector('.bottom-nav'); // Add this line

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sideMenu.classList.add('active');
        });
    }

    closeMenu.addEventListener('click', () => {
        sideMenu.classList.remove('active');
    });

    const menuLinks = sideMenu.querySelectorAll('ul li a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const level = event.target.dataset.level;

            let redirectPage = '';

            switch (level) {
                case 'primer':
                    redirectPage = 'primer-año.html';
                    break;
                case 'segundo':
                    redirectPage = 'segundo-año.html';
                    break;
                case 'tercero':
                    redirectPage = 'tercer-año.html';
                    break;
                default:
                    console.warn('Nivel no reconocido:', level);
                    return;
                case 'volver':
                    redirectPage = 'coordi-index.html';
                    break;
            }

            if (redirectPage) {
                window.location.href = redirectPage;
            }

            sideMenu.classList.remove('active');
        });
    });

    const vehicleModal = document.getElementById("vehicleModal");
    const openVehicleModalBtns = document.querySelectorAll(".record-item .more-options i.fa-ellipsis-v");
    const closeVehicleModalBtn = vehicleModal.querySelector(".close-btn");

    if (vehicleModal) {
        vehicleModal.style.display = "none";
    }

    openVehicleModalBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            if (vehicleModal) {
                vehicleModal.style.display = "flex";
                if (bottomNav) { // Check if bottomNav exists before adding class
                    bottomNav.classList.add('hidden-nav'); // Add class to hide bottom nav smoothly
                }
            }
        };
    });

    closeVehicleModalBtn.onclick = () => {
        vehicleModal.style.display = "none";
        if (bottomNav) { // Check if bottomNav exists before removing class
            bottomNav.classList.remove('hidden-nav'); // Remove class to show bottom nav smoothly
        }
    };

    window.onclick = (e) => {
        if (e.target === vehicleModal) {
            vehicleModal.style.display = "none";
            if (bottomNav) { // Check if bottomNav exists before removing class
                bottomNav.classList.remove('hidden-nav'); // Remove class to show bottom nav smoothly
            }
        }
    };

    const perfilModal = document.getElementById("perfilModal");
    const openPerfilModalBtn = document.getElementById("profileIconTrigger");
    const closePerfilModalBtn = perfilModal ? perfilModal.querySelector(".close") : null;

    if (perfilModal) {
        perfilModal.style.display = "none";
    }

    if (openPerfilModalBtn) {
        openPerfilModalBtn.addEventListener('click', () => {
            if (perfilModal) {
                perfilModal.style.display = "flex";
                displayUserProfile();
                if (bottomNav) { // Also hide bottom nav when profile modal opens
                    bottomNav.classList.add('hidden-nav');
                }
            }
        });
    }

    if (closePerfilModalBtn) {
        closePerfilModalBtn.addEventListener('click', () => {
            if (perfilModal) {
                perfilModal.style.display = "none";
                if (bottomNav) { // Show bottom nav when profile modal closes
                    bottomNav.classList.remove('hidden-nav');
                }
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === perfilModal) {
            perfilModal.style.display = "none";
            if (bottomNav) { // Show bottom nav when clicking outside profile modal
                bottomNav.classList.remove('hidden-nav');
            }
        }
    });

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