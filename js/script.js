document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-btn');

    if (loginButton) {
        loginButton.addEventListener('click', async function() { // Marcamos la función como 'async'
            const usernameInput = document.getElementById('username-input');
            const passwordInput = document.getElementById('password-input');

            if (!usernameInput || !passwordInput) {
                console.error("Error: No se pudieron encontrar los campos de entrada de usuario o contraseña.");
                alert("Error en la interfaz. Por favor, recarga la página.");
                return;
            }

            const email = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (email && password) {
                try {
                    // 1. Obtener todos los usuarios de la API
                    const usersResponse = await fetch('https://685b5bb389952852c2d94520.mockapi.io/tbUsers');
                    if (!usersResponse.ok) {
                        throw new Error(`HTTP error! status: ${usersResponse.status}`);
                    }
                    const users = await usersResponse.json();

                    // 2. Buscar el usuario por email y password
                    const foundUser = users.find(user => user.email === email && user.password === password);

                    if (foundUser) {

                        localStorage.setItem('loggedInUserName', foundUser.fullName);
                        // 3. Obtener los roles de la API
                        const rolesResponse = await fetch('https://685b5bb389952852c2d94520.mockapi.io/tbRoles');
                        if (!rolesResponse.ok) {
                            throw new Error(`HTTP error! status: ${rolesResponse.status}`);
                        }
                        const roles = await rolesResponse.json();

                        // 4. Encontrar el nombre del rol del usuario
                        const userRole = roles.find(role => role.roleId === foundUser.tbRoleId);

                        if (userRole) {
                            // Redirigir según el rol
                            switch(userRole.roleName) {
                                case 'Student':
                                    window.location.href = 'estudiante.html';
                                    break;
                                case 'Instructor': // Asumiendo que 'Maestro' se mapea a 'Instructor' o 'Coordinator'
                                case 'Coordinator':
                                    window.location.href = 'coordi-index.html';
                                    break;
                                default:
                                    alert('Rol de usuario no reconocido. Contacta al administrador.');
                            }
                        } else {
                            alert('No se pudo determinar el rol del usuario.');
                        }
                    } else {
                        alert('Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.');
                    }

                } catch (error) {
                    console.error("Error al conectar con la API:", error);
                    alert('Hubo un problema al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
                }
            } else {
                alert('Por favor, ingresa tus credenciales completas (usuario y contraseña).');
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