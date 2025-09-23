import { login, me } from './Services/AuthEService.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const eyeIcon = this.querySelector('i');
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Interfaz',
                    text: 'Error en la interfaz. Por favor, recarga la página.',
                });
                return;
            }

            const correo = usernameInput.value.trim();
            const contrasena = passwordInput.value.trim();

            // Validación de campos vacíos
            if (!correo || !contrasena) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos Vacíos',
                    text: 'Por favor, ingresa tus credenciales completas (correo y contraseña).',
                });
                return;
            }

            // Validación de correo institucional
            if (!correo.endsWith('@ricaldone.edu.sv')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Correo inválido',
                    text: 'Debes ingresar tu correo institucional (@ricaldone.edu.sv).',
                });
                return;
            }

            try {
                await login({ correo, contrasena });
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Bienvenido al sistema.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'estudiante.html';
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: error.message || 'Credenciales incorrectas.',
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

    // Ejemplo: consulta autenticada usando la cookie creada por el backend
    async function obtenerDatosEstudiante() {
        try {
            const data = await me();
            if (data.authenticated) {
                console.log('Datos del estudiante:', data.student);
            } else {
                console.log('No autenticado');
            }
        } catch (error) {
            console.error('Error obteniendo datos del estudiante:', error);
        }
    }
    // obtenerDatosEstudiante();
});