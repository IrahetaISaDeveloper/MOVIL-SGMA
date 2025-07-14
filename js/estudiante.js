document.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.querySelector('.welcome-message span');
    const userProfilePic = document.getElementById('user-profile-pic');

    const loggedInUserName = localStorage.getItem('loggedInUserName');
    const loggedInUserPhoto = localStorage.getItem('loggedInUserPhoto');

    if (userNameSpan && loggedInUserName) {
        userNameSpan.textContent = loggedInUserName;
    } else if (userNameSpan) {
        userNameSpan.textContent = 'Usuario';
        console.warn('No se encontró el nombre de usuario en localStorage.');
    }

    if (userProfilePic && loggedInUserPhoto) {
        userProfilePic.src = loggedInUserPhoto;
    } else if (userProfilePic) {
        userProfilePic.src = 'imgs/default-profile.png'; // Assuming default-profile.png is in imgs folder
    }

    const logoutButton = document.querySelector('.back-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            localStorage.removeItem('loggedInUserName');
            localStorage.removeItem('loggedInUserPhoto');
        });
    }
});