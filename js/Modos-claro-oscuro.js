document.addEventListener('DOMContentLoaded', function() {
    const lightModeButton = document.getElementById('light-mode');
    const darkModeButton = document.getElementById('dark-mode');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            lightModeButton.classList.add('active');
            darkModeButton.classList.remove('active');
        } else {
            body.classList.remove('light-mode');
            darkModeButton.classList.add('active');
            lightModeButton.classList.remove('active');
        }
    }

    const storedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(storedTheme);

    lightModeButton.addEventListener('click', function() {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    });

    darkModeButton.addEventListener('click', function() {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    });
});