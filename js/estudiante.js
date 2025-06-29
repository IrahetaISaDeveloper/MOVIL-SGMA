document.addEventListener('DOMContentLoaded', () => {
    // Obtener el elemento donde se mostrará el nombre del usuario
    const userNameSpan = document.querySelector('.welcome-message span');
    // Obtener el elemento de la imagen de perfil
    const userProfilePic = document.getElementById('user-profile-pic');

    // Recuperar el nombre del usuario desde localStorage
    const loggedInUserName = localStorage.getItem('loggedInUserName');
    // Recuperar la URL de la foto de perfil desde localStorage
    const loggedInUserPhoto = localStorage.getItem('loggedInUserPhoto');

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

    // Mostrar la foto de perfil si existe
    if (userProfilePic && loggedInUserPhoto) {
        userProfilePic.src = loggedInUserPhoto;
    } else if (userProfilePic) {
        // Si no hay foto en localStorage, asegúrate de que muestre la imagen por defecto
        userProfilePic.src = 'img/default-profile.png';
    }

    // Lógica para el botón de cerrar sesión (opcional, si no está en otro lugar)
    const logoutButton = document.querySelector('.back-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            // Limpia el nombre del usuario y la foto de perfil al cerrar sesión
            localStorage.removeItem('loggedInUserName');
            localStorage.removeItem('loggedInUserPhoto');
            // La redirección ya la tienes en el HTML, pero si la haces aquí:
            // window.location.href = 'login.html';
        });
    }
});