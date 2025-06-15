document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro-form');
    const correoInput = document.getElementById('correo');
    const correoError = document.getElementById('correo-error');

    // --- Elementos del combobox personalizado ---
    const gradoCustomTrigger = document.getElementById('grado-custom-trigger');
    const selectedGradoText = document.getElementById('selected-grado-text');
    const gradoCustomOptions = document.getElementById('grado-custom-options');
    const gradoNativeSelect = document.getElementById('grado'); // El SELECT nativo oculto

    // Lógica para abrir/cerrar el combobox personalizado
    gradoCustomTrigger.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el clic se propague al document y cierre inmediatamente
        gradoCustomOptions.classList.toggle('open');
        gradoCustomTrigger.classList.toggle('active');
    });

    // Lógica para cerrar el combobox cuando se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (!gradoCustomTrigger.contains(event.target) && !gradoCustomOptions.contains(event.target)) {
            gradoCustomOptions.classList.remove('open');
            gradoCustomTrigger.classList.remove('active');
        }
    });

    // Lógica para manejar la selección de una opción
    gradoCustomOptions.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', function() {
            const value = this.dataset.value;
            const text = this.textContent;

            // Actualizar el texto visible del combobox
            selectedGradoText.textContent = text;

            // Actualizar el valor del SELECT nativo oculto
            gradoNativeSelect.value = value;

            // Eliminar la clase 'selected' de todas las opciones y añadirla a la seleccionada
            gradoCustomOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            // Cerrar el combobox
            gradoCustomOptions.classList.remove('open');
            gradoCustomTrigger.classList.remove('active');

            // Opcional: Disparar un evento 'change' en el select nativo si hay lógica dependiente de ello
            const event = new Event('change');
            gradoNativeSelect.dispatchEvent(event);
        });
    });

    // Inicializar el combobox personalizado con el valor por defecto si existe
    // Esto asegura que si el select nativo tiene un valor pre-seleccionado, se muestre
    // correctamente en el combobox personalizado al cargar la página.
    if (gradoNativeSelect.value) {
        const selectedOption = gradoCustomOptions.querySelector(`.custom-option[data-value="${gradoNativeSelect.value}"]`);
        if (selectedOption) {
            selectedGradoText.textContent = selectedOption.textContent;
            selectedOption.classList.add('selected');
        }
    } else {
        // Asegurarse de que el placeholder se muestre si no hay valor seleccionado
        selectedGradoText.textContent = gradoNativeSelect.querySelector('option[value=""]').textContent;
    }

    // --- Lógica de validación del formulario (se mantiene igual) ---
    registroForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe por defecto

        correoError.textContent = '';
        correoError.style.display = 'none';

        const correo = correoInput.value;
        const dominioPermitido = '@ricaldone.edu.sv';

        if (!correo.endsWith(dominioPermitido)) {
            correoError.textContent = 'Correo no permitido, por favor utiliza un correo de ' + dominioPermitido;
            correoError.style.display = 'block';
            return;
        }

        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const password = document.getElementById('password').value;
        const grado = gradoNativeSelect.value; // ¡Importante! Usar el valor del select nativo oculto

        // Validaciones básicas adicionales
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (grado === '') {
            alert('Por favor, selecciona tu año de estudio.');
            return;
        }

        const datosRegistro = {
            nombres: nombres,
            apellidos: apellidos,
            correo: correo,
            password: password,
            grado: grado
        };

        console.log('Datos listos para enviar:', datosRegistro);

        // --- Simulación de conexión a la API (descomentar cuando tengas tu API) ---
        /*
        try {
            const response = await fetch('URL_DE_TU_API_DE_REGISTRO', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosRegistro),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Registro exitoso:', result);
                alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                window.location.href = 'index.html';
            } else {
                const errorData = await response.json();
                console.error('Error en el registro:', errorData);
                alert('Error al crear la cuenta: ' + (errorData.message || 'Inténtalo de nuevo.'));
            }
        } catch (error) {
            console.error('Error de red o del servidor:', error);
            alert('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.');
        }
        */

        // --- Si no tienes API, puedes poner una alerta o redirección aquí para probar la UI ---
        alert('Cuenta creada con exito');
    });
});