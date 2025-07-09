//NAV INFERIOR
// This script specifically handles the bottom navigation bar's active states and modal triggers.
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');

    function setActiveNavItem() {
        const currentPath = window.location.pathname.split('/').pop(); // e.g., "admin.html", "reportes.html"
        const currentHash = window.location.hash; // e.g., "#inicio"

        navItems.forEach(item => {
            item.classList.remove('active');
            const itemHref = item.getAttribute('href');
            const itemTarget = item.getAttribute('data-target'); // For modals

            // Prioritize direct page matches first
            if (itemHref && itemHref.includes(currentPath)) {
                // Special handling for coordi-index.html to ensure #inicio or no hash
                if (currentPath === 'coordi-index.html') {
                    if (itemHref.includes('coordi-index.html#inicio') || (itemHref === 'coordi-index.html' && !currentHash)) {
                        item.classList.add('active');
                    }
                } else {
                    item.classList.add('active');
                }
            }
            // Check for coordi-index.html#inicio when no specific path is matched yet
            else if (currentPath === 'coordi-index.html' && (itemHref === '#inicio' && !currentHash)) {
                 item.classList.add('active');
            }
            // Check if a modal is currently open and this item triggers it
            else if (itemTarget && $(itemTarget).hasClass('show')) {
                 item.classList.add('active');
            }
        });
    }

    // Handle clicks on navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const itemHref = this.getAttribute('href');
            const isModalTrigger = this.hasAttribute('data-toggle') && this.getAttribute('data-toggle') === 'modal'; // Corrected attribute check

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
                // For direct page links (1er-año.html, admin.html, reportes.html)
                // Let the default link behavior happen (navigate to new page)
                // The setActiveNavItem will run on the new page's DOMContentLoaded
            }
            // For modal triggers, Bootstrap handles the opening, and the 'show.bs.modal' event handles active state
        });
    });

    // Event listener for when any modal is shown (opened)
    $('.modal').on('show.bs.modal', function (e) {
        // Find the nav item that triggered this modal and set it active
        const modalTriggerNavItem = document.querySelector(`[data-target="#${this.id}"]`);
        if (modalTriggerNavItem) {
            navItems.forEach(item => item.classList.remove('active')); // Remove all active states first
            modalTriggerNavItem.classList.add('active');
        }
    });

    // Event listener for when any modal is hidden
    $('.modal').on('hidden.bs.modal', function (e) {
        // After any modal closes, re-evaluate active item based on the current URL
        setActiveNavItem();
    });

    // Initial active item setting on page load
    setActiveNavItem();

    // Re-evaluate active item on hash change (useful for #inicio on coordi-index.html if a hash is used)
    window.addEventListener('hashchange', setActiveNavItem);
});