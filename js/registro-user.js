document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro-form');
    const correoInput = document.getElementById('correo');
    const correoError = document.getElementById('correo-error');

    // --- Elementos del combobox personalizado ---
    const gradoCustomContainer = document.querySelector('.grupo-entrada:has(#grado)'); // Contenedor del grupo de entrada del grado
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

    // Nueva lógica para validar el correo y ocultar/mostrar el campo de año
    correoInput.addEventListener('input', () => {
        const correo = correoInput.value.trim();
        const dominioPermitido = '@ricaldone.edu.sv';
        const patronMaestro = /^[a-zA-Z0-9.]+_[a-zA-Z0-9.]+@ricaldone\.edu\.sv$/; // Patrón para maestros (ej: nombre_apellido@ricaldone.edu.sv)

        correoError.textContent = '';
        correoError.style.display = 'none';

        if (!correo.endsWith(dominioPermitido)) {
            correoError.textContent = 'Correo no permitido, por favor utiliza un correo de ' + dominioPermitido;
            correoError.style.display = 'block';
            gradoCustomContainer.style.display = 'block'; // Asegurarse de que el campo de grado se muestre si el correo es inválido
            gradoNativeSelect.required = true;
            return;
        }

        if (patronMaestro.test(correo)) {
            // Es un correo de maestro, ocultar campo de año
            gradoCustomContainer.style.display = 'none';
            gradoNativeSelect.removeAttribute('required'); // Ya no es requerido para maestros
        } else {
            // Es un correo de alumno, mostrar campo de año
            gradoCustomContainer.style.display = 'block';
            gradoNativeSelect.setAttribute('required', 'true');
        }
    });


    registroForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe por defecto

        correoError.textContent = '';
        correoError.style.display = 'none';

        const correo = correoInput.value.trim();
        const dominioPermitido = '@ricaldone.edu.sv';
        const patronMaestro = /^[a-zA-Z0-9.]+_[a-zA-Z0-9.]+@ricaldone\.edu\.sv$/; // Patrón para maestros

        if (!correo.endsWith(dominioPermitido)) {
            correoError.textContent = 'Correo no permitido, por favor utiliza un correo de ' + dominioPermitido;
            correoError.style.display = 'block';
            return;
        }

        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const password = document.getElementById('password').value.trim();
        
        let tbRoleId;
        let grado = ''; // Por defecto vacío, solo se llenará para alumnos

        if (patronMaestro.test(correo)) {
            tbRoleId = "2"; // Rol de Maestro
            gradoCustomContainer.style.display = 'none'; // Asegurarse de que esté oculto en el submit
            gradoNativeSelect.removeAttribute('required');
        } else {
            tbRoleId = "3"; // Rol de Alumno
            grado = gradoNativeSelect.value.trim(); // Obtener el valor del grado solo para alumnos
            if (!grado) { // Validar si el grado está vacío para alumnos
                Swal.fire({
                    icon: "error",
                    title: "Error de Validación",
                    text: "Por favor, selecciona tu año."
                });
                return;
            }
            gradoCustomContainer.style.display = 'block'; // Asegurarse de que esté visible en el submit
            gradoNativeSelect.setAttribute('required', 'true');
        }

        // Validaciones básicas adicionales
        if (!nombres || !apellidos || !password) {
            Swal.fire({
                icon: "error",
                title: "Error de Validación",
                text: "Por favor, completa todos los campos."
            });
            return;
        }

        if (password.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Contraseña Inválida",
                text: "La contraseña debe tener al menos 6 caracteres."
            });
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
                    Swal.fire({
                        icon: "error",
                        title: "Error al Subir Imagen",
                        text: 'Error al subir la imagen de perfil: ' + (errorData.message || 'Ocurrió un problema.'),
                    });
                    return; // Detiene el registro si la imagen no se sube
                }
            } catch (error) {
                console.error('Error de red o del servidor al subir la imagen a ImgBB:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: 'Ocurrió un error inesperado al subir la imagen. Inténtalo de nuevo.',
                });
                return;
            }
        }

        // Si la imagen se subió o no se seleccionó ninguna, procede con el registro del usuario
        const nuevoUsuario = {
            email: correo,
            password: password,
            fullName: `${nombres} ${apellidos}`, // Combina nombres y apellidos
            tbRoleId: tbRoleId, // Asigna el rol dinámicamente
            fotoPerfil: imageUrl // Incluye la URL de la imagen de perfil
        };

        // Solo añade el grado si es un alumno
        if (tbRoleId === "3") {
            nuevoUsuario.grado = grado;
        }

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
                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: "¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = 'login.html'; // Redirige al usuario a la página de inicio de sesión
                });
            } else {
                const errorData = await response.json(); // Intenta leer el error de la respuesta
                console.error('Error en el registro:', errorData);
                Swal.fire({
                    icon: "error",
                    title: "Error al Crear Cuenta",
                    text: 'Error al crear la cuenta: ' + (errorData.message || 'Ocurrió un problema. Inténtalo de nuevo.'),
                });
            }
        } catch (error) {
            console.error('Error de red o del servidor:', error);
            Swal.fire({
                icon: "error",
                title: "Error de Conexión",
                text: 'Ocurrió un error inesperado al intentar crear la cuenta. Por favor, inténtalo de nuevo más tarde.',
            });
        }
    });

    // Disparar el evento 'input' al cargar la página para aplicar la lógica inicial de visibilidad del grado
    correoInput.dispatchEvent(new Event('input'));
});