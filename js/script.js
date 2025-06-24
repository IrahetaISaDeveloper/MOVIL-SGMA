// Espera a que todo el contenido del DOM (Document Object Model) esté completamente cargado
// antes de ejecutar cualquier script. Esto asegura que todos los elementos HTML estén disponibles.
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene una referencia al botón de inicio de sesión por su ID.
    const loginButton = document.getElementById('login-btn');

    // Verifica si el botón de inicio de sesión existe en la página.
    if (loginButton) {
        // Añade un "escuchador de eventos" (event listener) al botón.
        // Cuando el botón es clicado, se ejecuta la función anónima.
        loginButton.addEventListener('click', function() {
            // Obtiene referencias a los campos de entrada de usuario y contraseña por sus IDs.
            const usernameInput = document.getElementById('username-input');
            const passwordInput = document.getElementById('password-input');

            // Verifica si los campos de entrada existen antes de intentar obtener sus valores.
            // Esto previene errores si los elementos no se encuentran en el HTML.
            if (!usernameInput || !passwordInput) {
                // Muestra un error en la consola del navegador para depuración.
                console.error("Error: No se pudieron encontrar los campos de entrada de usuario o contraseña.");
                // Alerta al usuario sobre el problema.
                alert("Error en la interfaz. Por favor, recarga la página.");
                return; // Detiene la ejecución de la función.
            }

            // Obtiene los valores de los campos de entrada y usa .trim() para eliminar
            // espacios en blanco al inicio y al final de las cadenas.
            const email = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Verifica si ambos campos (correo y contraseña) tienen valores.
            if (email && password) {
                let role = ''; // Variable para almacenar el rol del usuario.

                // Define patrones de expresiones regulares para identificar el rol del usuario
                // basándose en el formato del correo electrónico institucional de Ricaldone.
                const studentRegex = /^\d+@ricaldone\.edu\.sv$/;        // Ej: 12345@ricaldone.edu.sv (números al inicio)
                const leaderRegex = /^_.*@ricaldone\.edu\.sv$/;         // Ej: _lider@ricaldone.edu.sv (inicia con guion bajo)
                const coordinatorRegex = /^[^_]+_.*@ricaldone\.edu\.sv$/; // Ej: juan_coordinador@ricaldone.edu.sv (contiene guion bajo pero no inicia con él)

                // Comprueba el correo electrónico contra los patrones para determinar el rol.
                if (studentRegex.test(email)) {
                    role = 'student'; // Si coincide con el patrón de estudiante.
                } else if (leaderRegex.test(email)) {
                    role = 'leader'; // Si coincide con el patrón de líder.
                } else if (coordinatorRegex.test(email)) {
                    role = 'coordinator'; // Si coincide con el patrón de coordinador.
                } else {
                    // Si el correo no coincide con ningún rol conocido, alerta al usuario.
                    alert('Rol no reconocido. Por favor, verifica tu usuario.');
                    return; // Detiene la ejecución.
                }

                // Simula un inicio de sesión exitoso con una verificación de contraseña "ficticia".
                if (password === "password123") { // Contraseña de ejemplo para demostración.
                    // Redirige al usuario a la página correspondiente según su rol.
                    switch(role) {
                        case 'student':
                            window.location.href = 'estudiante.html'; // Página de inicio para estudiantes.
                            break;
                        case 'leader':
                            window.location.href = 'coordi-index.html'; // Página de inicio para líderes.
                            break;
                        case 'coordinator':
                            window.location.href = 'coordi-index.html'; // Página de inicio para coordinadores.
                            break;
                        default:
                            // Mensaje de error para un caso inesperado de rol.
                            alert('Un error inesperado ocurrió.');
                    }
                } else {
                    // Alerta si la contraseña es incorrecta para el usuario de demostración.
                    alert('Credenciales incorrectas. Por favor, verifica tu contraseña.');
                }
            } else {
                // Alerta si los campos de usuario o contraseña están vacíos.
                alert('Por favor, ingresa tus credenciales completas (usuario y contraseña).');
            }
        });
    } else {
        // Muestra un error en la consola si el botón de inicio de sesión no se encuentra.
        console.error("Error: Botón de inicio de sesión no encontrado.");
    }

    // Funcionalidad opcional: Añade un escuchador de eventos para el botón "seguimiento de vehículo".
    const vehicleTrackingButton = document.getElementById('vehicle-tracking-btn');
    if (vehicleTrackingButton) {
        vehicleTrackingButton.addEventListener('click', function() {
            // Redirige a la página de autenticación de seguimiento.
            window.location.href = 'auth-seguimiento.html';
        });
    }
});
