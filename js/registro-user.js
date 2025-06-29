document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro-form');
    const correoInput = document.getElementById('correo');
    const correoError = document.getElementById('correo-error');

    // --- Elementos del combobox personalizado ---
    const gradoCustomTrigger = document.getElementById('grado-custom-trigger');
    const selectedGradoText = document.getElementById('selected-grado-text');
    const gradoCustomOptions = document.getElementById('grado-custom-options');
    const gradoNativeSelect = document.getElementById('grado'); //ID

    // --- Elementos para la foto de perfil ---
    const fotoPerfilInput = document.getElementById('fotoPerfil');
    const previewFoto = document.getElementById('previewFoto');
    const fotoPerfilUrlInput = document.getElementById('fotoPerfilUrl'); // Campo oculto

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

    // Lógica para previsualizar la imagen seleccionada
    fotoPerfilInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewFoto.src = e.target.result;
                previewFoto.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewFoto.src = '#';
            previewFoto.style.display = 'none';
        }
    });

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
        const grado = gradoNativeSelect.value.trim(); // Mantener para el campo 'grado' si es necesario para MockAPI.io

        // Validaciones básicas adicionales
        if (!nombres || !apellidos || !password || !grado) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        let imageUrl = ''; // Variable para almacenar la URL de la imagen

        // Lógica para subir la imagen de perfil si se seleccionó una
        if (fotoPerfilInput.files.length > 0) {
            const fotoFile = fotoPerfilInput.files[0];
            const formData = new FormData();
            formData.append('image', fotoFile); // 'image' es el nombre del campo que tu API espera

            try {
                // Sube la imagen a la API de imágenes (ImgBB)
                const imgApiUrl = 'https://api.imgbb.com/1/upload?expiration=600&key=eaf6049b5324954d994475cb0c0a6156'; // Ejemplo

                const imgResponse = await fetch(imgApiUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (imgResponse.ok) {
                    const imgResult = await imgResponse.json();
                    console.log('Imagen subida exitosamente a ImgBB:', imgResult);
                    imageUrl = imgResult.data.url; // Asume que ImgBB devuelve la URL en imgResult.data.url
                    fotoPerfilUrlInput.value = imageUrl; // Guarda la URL en el campo oculto
                } else {
                    const errorData = await imgResponse.json();
                    console.error('Error al subir la imagen a ImgBB:', errorData);
                    alert('Error al subir la imagen de perfil: ' + (errorData.message || 'Ocurrió un problema.'));
                    return; // Detiene el registro si la imagen no se sube
                }
            } catch (error) {
                console.error('Error de red o del servidor al subir la imagen a ImgBB:', error);
                alert('Ocurrió un error inesperado al subir la imagen. Inténtalo de nuevo.');
                return;
            }
        }

        // Si la imagen se subió o no se seleccionó ninguna, procede con el registro del usuario
        const nuevoUsuario = {
            email: correo,
            password: password,
            fullName: `${nombres} ${apellidos}`, // Combina nombres y apellidos
            tbRoleId: "3", // Asigna el rol "3" (Estudiante) por defecto
            fotoPerfil: imageUrl // Incluye la URL de la imagen de perfil
            // Puedes mantener 'grado: grado' si tu API lo necesita además de los campos del login
            // Si 'grado' no es relevante para el login o tbUsers, puedes eliminarlo de aquí.
            // grado: grado // Si necesitas enviar el grado, descomenta esta línea
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