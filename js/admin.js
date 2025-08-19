document.addEventListener('DOMContentLoaded', function () {
    // --- NAV INFERIOR ---
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');

    function setActiveNavItem() {
        const currentPath = window.location.pathname.split('/').pop(); // e.g., "admin.html"
        const currentHash = window.location.hash; // e.g., "#inicio"

        navItems.forEach(item => {
            item.classList.remove('active');
            const itemHref = item.getAttribute('href');
            const itemTarget = item.getAttribute('data-target'); // For modals

            // Check if it's the current page's main section (coordi-index.html#inicio or just coordi-index.html)
            if (currentPath === 'coordi-index.html' && (itemHref.includes('coordi-index.html#inicio') || (itemHref === '#inicio' && !currentHash) || itemHref === 'coordi-index.html')) {
                item.classList.add('active');
            }
            // Check for direct page links (e.g., 1er-año.html, admin.html)
            else if (itemHref && itemHref.includes(currentPath) && currentPath !== 'coordi-index.html') {
                item.classList.add('active');
            }
            // Check if the modal is currently open
            else if (itemTarget && $(itemTarget).hasClass('show')) {
                item.classList.add('active');
            }
        });
    }

    // Handle clicks on navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            const itemHref = this.getAttribute('href');
            const isModalTrigger = this.hasAttribute('data-toggle') && this.getAttribute('data-toggle') === 'modal';

            // For #inicio link on the same page OR for a full page navigation to coordi-index.html
            if (itemHref === 'coordi-index.html' || itemHref.includes('coordi-index.html#inicio') || (itemHref === '#inicio' && !isModalTrigger)) {
                // If the link is for 'coordi-index.html' and we are not already there, navigate.
                if (window.location.pathname.split('/').pop() !== 'coordi-index.html' || (itemHref.includes('#inicio') && window.location.hash !== '#inicio')) {
                    window.location.href = itemHref; // Navigate to coordi-index.html
                }
                e.preventDefault(); // Prevent default link behavior if we are handling navigation or hash scroll
                const targetSection = document.querySelector('.content-section'); // Or a specific ID if you add one to the main content
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
                setActiveNavItem(); // Set active after potential scroll/navigation
            } else if (!isModalTrigger) {
                // For direct page links (1er-año.html, admin.html)
                // Let the default link behavior happen (navigate to new page)
                // The setActiveNavItem will run on the new page's DOMContentLoaded
            }
            // For modal triggers, Bootstrap handles the opening, and the 'show.bs.modal' event handles active state
        });
    });

    // --- LOGIN Y DASHBOARD ---
    // Redirección si ya hay nombre guardado (solo en index/login)
    if (window.location.pathname.endsWith('index.html') && localStorage.nombre) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Login (solo en index/login)
    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            const nombre = document.getElementById("nombre").value.trim();
            const tema = document.getElementById("tema").value;
            if (nombre) {
                localStorage.setItem("nombre", nombre);
                localStorage.setItem("tema", tema);
                window.location.href = 'dashboard.html';
            } else {
                alert("Ingrese su nombre");
            }
        });
    }

    // Dashboard: saludo y tema
    const saludo = document.getElementById("saludo");
    const appCard = document.getElementById("appCard");
    const btnLogout = document.getElementById("btnLogout");
    if (saludo && appCard && btnLogout) {
        const nombre = localStorage.getItem("nombre");
        const tema = localStorage.getItem("tema");
        if (!nombre || !tema) {
            window.location.href = "index.html";
        } else {
            saludo.textContent = `¡Hola de nuevo, ${nombre} 👽👻`;
        }
        btnLogout.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "index.html";
        });
    }

    // --- TEMA: Manejo de botones de tema ---
    const lightModeBtn = document.getElementById("light-mode");
    const darkModeBtn = document.getElementById("dark-mode");

    // Aplica el tema guardado al cargar la página
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "dark") {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        if (appCard) {
            appCard.classList.add("dark-mode");
            appCard.classList.remove("light-mode");
        }
    } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
        if (appCard) {
            appCard.classList.add("light-mode");
            appCard.classList.remove("dark-mode");
        }
    }

    // Listeners para los botones de tema
    if (lightModeBtn) {
        lightModeBtn.addEventListener("click", () => {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
            if (appCard) {
                appCard.classList.add("light-mode");
                appCard.classList.remove("dark-mode");
            }
            localStorage.setItem("tema", "light"); // <-- Guarda el tema seleccionado
        });
    }
    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", () => {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
            if (appCard) {
                appCard.classList.add("dark-mode");
                appCard.classList.remove("light-mode");
            }
            localStorage.setItem("tema", "dark"); // <-- Guarda el tema seleccionado
        });
    }

    // Initial active item setting on page load
    setActiveNavItem();

    // Re-evaluate active item on hash change (useful for #inicio on coordi-index.html if a hash is used)
    window.addEventListener('hashchange', setActiveNavItem);
});

