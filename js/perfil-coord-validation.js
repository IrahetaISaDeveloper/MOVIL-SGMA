document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formularioCambioContrasena');
    const contrasenaActual = document.getElementById('contrasenaActual');
    const nuevaContrasena = document.getElementById('nuevaContrasena');
    const confirmarNuevaContrasena = document.getElementById('confirmarNuevaContrasena');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        validateForm();
    });

    function validateForm() {
        const currentPass = contrasenaActual.value.trim();
        const newPass = nuevaContrasena.value.trim();
        const confirmNewPass = confirmarNuevaContrasena.value.trim();

        if (currentPass === '' || newPass === '' || confirmNewPass === '') {
            showErrorAlert('Todos los campos de contraseña son obligatorios.');
            return false;
        }

        if (newPass.length < 6) {
            showErrorAlert('La nueva contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        if (newPass !== confirmNewPass) {
            showErrorAlert('La nueva contraseña y la confirmación no coinciden.');
            return false;
        }

        showSuccessAlert('Contraseña actualizada con éxito.');
        form.reset();
        return true;
    }

    function showErrorAlert(message) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: message,
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button'
            }
        });
    }

    function showSuccessAlert(message) {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button'
            }
        });
    }
});