//NAV INFERIOR
// This script specifically handles the bottom navigation bar's active states and modal triggers.
document.addEventListener('DOMContentLoaded', function() {
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
        item.addEventListener('click', function(e) {
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