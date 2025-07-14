document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');

    function setActiveNavItem() {
        const currentPath = window.location.pathname.split('/').pop(); // e.g., "registro-auto.html"
        const currentHash = window.location.hash;

        navItems.forEach(item => {
            item.classList.remove('active');
            const itemHref = item.getAttribute('href');
            const itemTarget = item.getAttribute('data-target'); // For modals

            if (currentPath === 'estudiante.html' && (itemHref.includes('estudiante.html#inicio') || (itemHref === '#inicio' && !currentHash) || itemHref === 'estudiante.html')) {
                item.classList.add('active');
            } else if (itemHref && itemHref.includes(currentPath) && currentPath !== 'estudiante.html') {
                item.classList.add('active');
            } else if (itemTarget && $(itemTarget).hasClass('show')) {
                 item.classList.add('active');
            }
        });
    }

    // Handle clicks on navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const itemHref = this.getAttribute('href');
            const isModalTrigger = this.hasAttribute('data-toggle') && this.getAttribute('data-toggle') === 'modal';

            if (itemHref.includes('estudiante.html#inicio') || (itemHref === '#inicio' && !isModalTrigger) || itemHref === 'estudiante.html') {
                // If navigating back to estudiante.html#inicio, prevent default and let the
                // browser handle the navigation which will reload estudiante.html.
                // The setActiveNavItem will then correctly mark 'Inicio' on estudiante.html
            } else if (!isModalTrigger) {
                // For direct page links (e.g., mis-trabajos.html, admin.html)
                // Let the default link behavior happen (navigate to new page)
                // The setActiveNavItem will run on the new page's DOMContentLoaded
            }
            // For modal triggers, Bootstrap handles the opening, and the 'show.bs.modal' event handles active state
        });
    });

    // Initial active item setting on page load
    setActiveNavItem();
});