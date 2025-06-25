document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro-form');
    const correoInput = document.getElementById('correo');
    const correoError = document.getElementById('correo-error');

    // --- Elementos del combobox personalizado ---
    const gradoCustomTrigger = document.getElementById('grado-custom-trigger');
    const selectedGradoText = document.getElementById('selected-grado-text');
    const gradoCustomOptions = document.getElementById('grado-custom-options');
    const gradoNativeSelect = document.getElementById('grado'); //ID

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
    gradoCustomOptions.querySelectorAll('.opcion-personalizada').forEach(option => {
        option.addEventListener('click', function() {
            const value = this.dataset.value;
            const text = this.textContent;

            // Actualizar el texto visible del combobox
            selectedGradoText.textContent = text;

            // Actualizar el valor del SELECT nativo oculto
            gradoNativeSelect.value = value;

            // Eliminar la clase 'selected' de todas las opciones y añadirla a la seleccionada
            gradoCustomOptions.querySelectorAll('.opcion-personalizada').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            // Cerrar el combobox
            gradoCustomOptions.classList.remove('open');
            gradoCustomTrigger.classList.remove('active');

            const event = new Event('change');
            gradoNativeSelect.dispatchEvent(event);
        });
    });

    // Inicializar el combobox personalizado con el valor por defecto si existe
    if (gradoNativeSelect.value) {
        const selectedOption = gradoCustomOptions.querySelector(`.opcion-personalizada[data-value="${gradoNativeSelect.value}"]`);
        if (selectedOption) {
            selectedGradoText.textContent = selectedOption.textContent;
            selectedOption.classList.add('selected');
        }
    } else {
        // Asegurarse de que el placeholder se muestre si no hay valor seleccionado
        selectedGradoText.textContent = gradoNativeSelect.querySelector('option[value=""]').textContent;
    }


    registroForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe por defecto

        correoError.textContent = '';
        correoError.style.display = 'none';

        const correo = correoInput.value.trim();
        const dominioPermitido = '@ricaldone.edu.sv';

        if (!correo.endsWith(dominioPermitido)) {
            correoError.textContent = 'Correo no permitido, por favor utiliza un correo de ' + dominioPermitido;
            correoError.style.display = 'block';
            return;
        }

        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const password = document.getElementById('password').value.trim();
        const grado = gradoNativeSelect.value.trim(); // Asegúrate de que este ID tenga un valor válido, o ajusta la lógica si no es necesario para la API de usuarios.

        // Validaciones básicas adicionales
        if (!nombres || !apellidos || !password || !grado) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (grado === '') {
            alert('Por favor, selecciona tu año de estudio.');
            return;
        }

        // Mapea los datos del formulario a la estructura de la API tbUsers
        const nuevoUsuario = {
            email: correo,
            password: password,
            fullName: `${nombres} ${apellidos}`, // Combina nombres y apellidos
            tbRoleId: "3" // Asumimos que el registro es para un estudiante (roleId "3")
            // El 'id' será generado automáticamente por MockAPI.io al hacer POST
        };

        console.log('Datos listos para enviar a la API:', nuevoUsuario);

        try {
            const response = await fetch('https://685b5bb389952852c2d94520.mockapi.io/tbUsers', {
                method: 'POST', // Método HTTP para crear un recurso
                headers: {
                    'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud es JSON
                },
                body: JSON.stringify(nuevoUsuario), // Convierte el objeto JavaScript a una cadena JSON
            });

            if (response.ok) { // Verifica si la respuesta fue exitosa (status 2xx)
                const result = await response.json();
                console.log('Registro exitoso:', result);
                alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                window.location.href = 'login.html'; // Redirige al usuario a la página de inicio de sesión
            } else {
                const errorData = await response.json(); // Intenta leer el error de la respuesta
                console.error('Error en el registro:', errorData);
                alert('Error al crear la cuenta: ' + (errorData.message || 'Ocurrió un problema. Inténtalo de nuevo.'));
            }
        } catch (error) {
            console.error('Error de red o del servidor:', error);
            alert('Ocurrió un error inesperado al intentar crear la cuenta. Por favor, inténtalo de nuevo más tarde.');
        }
    });
});