document.addEventListener('DOMContentLoaded', () => {
    // Simulated user data loading
    document.getElementById('nombreCompletoUsuario').textContent = 'Javier Iraheta';
    document.getElementById('correoUsuario').textContent = '20230669@ricaldone.edu.sv';
    document.getElementById('rolUsuario').textContent = 'Estudiante';
    // You would typically fetch this data from an API

    const formularioCambioContrasena = document.getElementById('formularioCambioContrasena');
    const contrasenaActualInput = document.getElementById('contrasenaActual');
    const nuevaContrasenaInput = document.getElementById('nuevaContrasena');
    const confirmarNuevaContrasenaInput = document.getElementById('confirmarNuevaContrasena');
    const mensajeContrasenaDiv = document.getElementById('mensajeContrasena');

    formularioCambioContrasena.addEventListener('submit', function(event) {
        event.preventDefault();

        const contrasenaActual = contrasenaActualInput.value;
        const nuevaContrasena = nuevaContrasenaInput.value;
        const confirmarNuevaContrasena = confirmarNuevaContrasenaInput.value;

        let isValid = true;
        let errorMessage = '';

        // Reset previous error styles
        contrasenaActualInput.style.borderColor = '';
        nuevaContrasenaInput.style.borderColor = '';
        confirmarNuevaContrasenaInput.style.borderColor = '';
        mensajeContrasenaDiv.style.display = 'none';
        mensajeContrasenaDiv.className = 'mensaje-alerta';

        if (contrasenaActual === '') {
            isValid = false;
            errorMessage += 'La contraseña actual no puede estar vacía.<br>';
            contrasenaActualInput.style.borderColor = 'red';
        }

        if (nuevaContrasena === '') {
            isValid = false;
            errorMessage += 'La nueva contraseña no puede estar vacía.<br>';
            nuevaContrasenaInput.style.borderColor = 'red';
        } else if (nuevaContrasena.length < 6) {
            isValid = false;
            errorMessage += 'La nueva contraseña debe tener al menos 6 caracteres.<br>';
            nuevaContrasenaInput.style.borderColor = 'red';
        }

        if (confirmarNuevaContrasena === '') {
            isValid = false;
            errorMessage += 'La confirmación de la nueva contraseña no puede estar vacía.<br>';
            confirmarNuevaContrasenaInput.style.borderColor = 'red';
        } else if (nuevaContrasena !== confirmarNuevaContrasena) {
            isValid = false;
            errorMessage += 'La nueva contraseña y la confirmación no coinciden.<br>';
            nuevaContrasenaInput.style.borderColor = 'red';
            confirmarNuevaContrasenaInput.style.borderColor = 'red';
        }

        if (isValid) {
            Swal.fire({
                title: '¡Contraseña Actualizada!',
                text: 'Tu contraseña ha sido cambiada exitosamente.',
                icon: 'success',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                }
            }).then(() => {
                formularioCambioContrasena.reset(); // Clear the form
            });
        } else {
            Swal.fire({
                title: 'Error de Validación',
                html: errorMessage,
                icon: 'error',
                confirmButtonText: 'Entendido',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                }
            });
        }
    });
});