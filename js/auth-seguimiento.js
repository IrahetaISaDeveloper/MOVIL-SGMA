document.addEventListener('DOMContentLoaded', function() {
    const verSeguimientoBtn = document.getElementById('verSeguimientoBtn');
    const placaInput = document.getElementById('placa');

    if (verSeguimientoBtn && placaInput) {
        verSeguimientoBtn.addEventListener('click', function() {
            const placa = placaInput.value.trim();

            if (placa) {
                if (placa.length < 5) { 
                    Swal.fire({
                        title: 'Entrada Inválida',
                        text: 'El número de placa, tarjeta de circulación o DUI debe tener al menos 5 caracteres.',
                        icon: 'warning',
                        customClass: {
                            popup: 'swal-custom-popup',
                            title: 'swal-custom-title',
                            content: 'swal-custom-content',
                            confirmButton: 'swal-custom-confirm-button'
                        },
                        buttonsStyling: false
                    });
                    return; 
                }
                
                

                window.location.href = `seguimiento.html?placa=${encodeURIComponent(placa)}`;
            } else {
                Swal.fire({
                    title: 'Campo Vacío',
                    text: 'Por favor, ingresa tu número de placa, tarjeta de circulación o DUI.',
                    icon: 'error',
                    customClass: {
                        popup: 'swal-custom-popup',
                        title: 'swal-custom-title',
                        content: 'swal-custom-content',
                        confirmButton: 'swal-custom-confirm-button'
                    },
                    buttonsStyling: false
                });
            }
        });
    } else {
        console.error("Error: No se encontró el botón o el campo de entrada en el DOM.");
    }
});