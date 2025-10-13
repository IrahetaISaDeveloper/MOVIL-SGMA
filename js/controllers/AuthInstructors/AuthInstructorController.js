import { loginInstructor, meInstructor } from '../services/AuthInstructors/AuthInstructorsService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('authInstructor');

    // Maneja el submit del formulario de login.
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtención de campos del formulario
        const emailInstructor = (document.querySelector('#emailInstructor, [name=emailInstructor], input[type=text]')?.value || '').trim();
        const passwordInstructor = document.querySelector('#passwordInstructor, [name=passwordInstructor], input[type=passwordInstructor]')?.value || '';

        // Validación básica
        if (!emailInstructor || !passwordInstructor) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor completa todos los campos'
            });
            return;
        }

        // Referencia y estado del botón "Iniciar Sesión"
        const authBtn = document.getElementById("authBtn");
        let originalText;

        try {
            // Desactiva botón para evitar reenvíos múltiples y muestra feedback de carga
            if (authBtn) {
                originalText = authBtn.innerHTML;
                authBtn.setAttribute("disabled", "disabled");
                authBtn.innerHTML = 'Ingresando…';
            }

            // Llama al servicio de login (envía credenciales, espera cookie de sesión)
            await loginInstructor({ emailInstructor, passwordInstructor });

            // Verifica sesión con /meInstructor para confirmar que la cookie quedó activa
            const info = await meInstructor();
            console.log("Información de sesión:", info); // Agrega este registro
            if (info?.authenticated) {

                // Redirección a la página principal si autenticado
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Inicio de sesión exitoso',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    console.log("Redirigiendo a coordi-index.html"); // Agrega este registro
                    window.location.replace('coordi-index.html');
                });
            } else {

                // Si no se refleja autenticación, alerta de cookie/sesión
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de Cookie o sesión no válida'
                });
            }
        } catch (err) {
            // Muestra mensaje de error de backend/red o fallback genérico
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err?.message || 'No fue posible iniciar sesión.'
            });
        } finally {
            // Restaura estado del botón (habilita y devuelve texto original)
            if (authBtn) {
                authBtn.removeAttribute("disabled");
                if (originalText) authBtn.innerHTML = originalText;
            }
        }
    });

    // Funcionalidad del toggle de contraseña
    const togglePassword = document.getElementById('togglePassword');
    const passwordInstructor = document.getElementById('passwordInstructor');

    if (togglePassword && passwordInstructor) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInstructor.type === 'password' ? 'text' : 'password';
            passwordInstructor.type = type;

            const icon = this.querySelector('i');
            if (icon) {
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
        });
    }
});
