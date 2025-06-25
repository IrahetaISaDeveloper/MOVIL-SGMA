// Espera a que el DOM (Document Object Model) esté completamente cargado antes de ejecutar el script.
// Esto asegura que todos los elementos HTML estén disponibles para ser manipulados.
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene una referencia al botón con el ID 'verSeguimientoBtn'.
    const verSeguimientoBtn = document.getElementById('verSeguimientoBtn');
    // Obtiene una referencia al campo de entrada con el ID 'placa'.
    const placaInput = document.getElementById('placa');

    // Verifica si ambos elementos (el botón y el campo de entrada) existen en la página.
    if (verSeguimientoBtn && placaInput) {
        // Añade un "escuchador de eventos" (event listener) al botón.
        // Cuando el botón es clicado, se ejecuta la función anónima.
        verSeguimientoBtn.addEventListener('click', function() {
            // Obtiene el valor del campo de entrada y elimina los espacios en blanco al inicio y al final.
            const placa = placaInput.value.trim();

            // Verifica si el campo de la placa tiene algún valor (no está vacío).
            if (placa) {
                // Si hay un valor, redirige al usuario a la página 'seguimiento.html'.
                // Se adjunta el valor de la placa como un parámetro de URL (query parameter)
                // para que pueda ser utilizado en la página de seguimiento.
                // 'encodeURIComponent' se usa para codificar el valor de la placa, asegurando
                // que caracteres especiales en la URL se manejen correctamente.
                window.location.href = `seguimiento.html?placa=${encodeURIComponent(placa)}`;
            } else {
                // Si el campo de la placa está vacío, muestra una alerta al usuario.
                alert('Por favor, ingresa tu número de placa, tarjeta de circulación o DUI.');
            }
        });
    } else {
        // Si el botón o el campo de entrada no se encuentran en el DOM,
        // registra un mensaje de error en la consola para depuración.
        console.error("Error: No se encontró el botón o el campo de entrada en el DOM.");
    }
});
