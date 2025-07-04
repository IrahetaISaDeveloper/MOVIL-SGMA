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

    // Function to display user profile for the modal
    function displayUserProfileForModal() {
        const profileContentDiv = document.getElementById('profile-content');
        if (profileContentDiv) {
            let profileHtml = '';
            if (loggedInUserName) {
                profileHtml += `
                    <div class="profile-display">
                        ${loggedInUserPhoto ? `<img src="${loggedInUserPhoto}" alt="Foto de Perfil" class="profile-picture">` : `<i class="fas fa-user-circle default-profile-icon"></i>`}
                        <p class="user-name">${loggedInUserName}</p>
                    </div>
                `;
            } else {
                profileHtml = '<p>No se encontraron datos de perfil. Por favor, inicia sesión.</p>';
            }
            profileContentDiv.innerHTML = profileHtml;
        }
    }

    // Event listener for when the profile modal is shown (using jQuery for Bootstrap events)
    $('#perfilModal').on('show.bs.modal', function (e) {
        displayUserProfileForModal(); // Load profile data when modal is about to be shown
    });
});