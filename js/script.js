document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const eyeIcon = this.querySelector('i'); // Get the <i> element within the span
            if (eyeIcon.classList.contains('fa-eye')) {
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            } else {
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', async function() {
            const usernameInput = document.getElementById('username-input');

            if (!usernameInput || !passwordInput) {
                console.error("Error: No se pudieron encontrar los campos de entrada de usuario o contraseña.");
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Interfaz',
                    text: 'Error en la interfaz. Por favor, recarga la página.',
                });
                return;
            }

            const email = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (email && password) {
                try {
                    const usersResponse = await fetch('https://685b5bb389952852c2d94520.mockapi.io/tbUsers');
                    if (!usersResponse.ok) {
                        throw new Error(`HTTP error! status: ${usersResponse.status}`);
                    }
                    const users = await usersResponse.json();

                    const foundUser = users.find(user => user.email === email && user.password === password);

                    if (foundUser) {
                        localStorage.setItem('loggedInUserName', foundUser.fullName);
                        if (foundUser.fotoPerfil) {
                            localStorage.setItem('loggedInUserPhoto', foundUser.fotoPerfil);
                        } else {
                            localStorage.removeItem('loggedInUserPhoto');
                        }

                        const rolesResponse = await fetch('https://685b5bb389952852c2d94520.mockapi.io/tbRoles');
                        if (!rolesResponse.ok) {
                            throw new Error(`HTTP error! status: ${rolesResponse.status}`);
                        }
                        const roles = await rolesResponse.json();

                        const userRole = roles.find(role => role.roleId === foundUser.tbRoleId);

                        if (userRole) {
                            switch(userRole.roleName) {
                                case 'Student':
                                    // Establece la bandera de éxito de inicio de sesión para el toast
                                    localStorage.setItem('loggedInSuccessfully', 'true'); //
                                    window.location.href = 'estudiante.html'; //
                                    break;
                                case 'Instructor':
                                case 'Coordinator':
                                    window.location.href = 'coordi-index.html'; //
                                    break;
                                default:
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Rol no reconocido',
                                        text: 'Rol de usuario no reconocido. Contacta al administrador.',
                                    });
                            }
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Rol no encontrado',
                                text: 'No se pudo determinar el rol del usuario.',
                            });
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Credenciales Incorrectas',
                            text: 'Por favor, verifica tu usuario y contraseña.',
                        });
                    }

                } catch (error) {
                    console.error("Error al conectar con la API:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Conexión',
                        text: 'Hubo un problema al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos Vacíos',
                    text: 'Por favor, ingresa tus credenciales completas (usuario y contraseña).',
                });
            }
        });
    } else {
        console.error("Error: Botón de inicio de sesión no encontrado.");
    }

    const vehicleTrackingButton = document.getElementById('vehicle-tracking-btn');
    if (vehicleTrackingButton) {
        vehicleTrackingButton.addEventListener('click', function() {
            window.location.href = 'auth-seguimiento.html';
        });
    }
});