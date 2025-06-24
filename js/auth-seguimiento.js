document.addEventListener('DOMContentLoaded', function() {
    const verSeguimientoBtn = document.getElementById('verSeguimientoBtn');
    const placaInput = document.getElementById('placa'); 

    if (verSeguimientoBtn && placaInput) {
        verSeguimientoBtn.addEventListener('click', function() {
            const placa = placaInput.value.trim();

            if (placa) {
                window.location.href = `seguimiento.html?placa=${encodeURIComponent(placa)}`;
            } else {
                alert('Por favor, ingresa tu número de placa, tarjeta de circulación o DUI.');
            }
        });
    } else {
        console.error("Error: Button or input element not found in the DOM.");
    }
});
