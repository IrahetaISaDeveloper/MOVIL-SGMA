document.addEventListener('DOMContentLoaded', () => {
    // Obtener el elemento donde se mostrará el nombre del usuario
    const userNameSpan = document.querySelector('.welcome-message span');

    // Recuperar el nombre del usuario desde localStorage
    const loggedInUserName = localStorage.getItem('loggedInUserName');

    if (userNameSpan && loggedInUserName) {
        // Si encontramos el span y hay un nombre guardado, lo mostramos
        userNameSpan.textContent = loggedInUserName;
    } else if (userNameSpan) {
        // Si no hay nombre guardado (ej: acceso directo sin login),
        // podrías mostrar un mensaje genérico o redirigir al login
        userNameSpan.textContent = 'Usuario'; // O cualquier texto por defecto
        console.warn('No se encontró el nombre de usuario en localStorage.');
        // Opcional: Redirigir al login si no hay sesión activa
        // window.location.href = 'login.html';
    }

    // Lógica para el botón de cerrar sesión (opcional, si no está en otro lugar)
    const logoutButton = document.querySelector('.back-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            // Limpia el nombre del usuario al cerrar sesión
            localStorage.removeItem('loggedInUserName');
            // La redirección ya la tienes en el HTML, pero si la haces aquí:
            // window.location.href = 'login.html';
        });
    }
});