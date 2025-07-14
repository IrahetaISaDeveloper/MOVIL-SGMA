document.addEventListener('DOMContentLoaded', function () {
    let datosUsuario = {}; // Objeto para almacenar los datos del usuario cargados desde la API o localStorage

    // Obtiene referencias a los elementos del DOM donde se mostrarán los datos del usuario
    const nombreCompletoUsuarioElemento = document.getElementById('nombreCompletoUsuario');
    const correoUsuarioElemento = document.getElementById('correoUsuario');
    const fotoPerfilElemento = document.getElementById('fotoPerfil');
    const rolUsuarioElemento = document.getElementById('rolUsuario');

    // Obtiene referencias a los elementos del formulario de cambio de contraseña
    const formularioCambioContrasena = document.getElementById('formularioCambioContrasena');
    const campoContrasenaActual = document.getElementById('contrasenaActual');
    const campoNuevaContrasena = document.getElementById('nuevaContrasena');
    const campoConfirmarNuevaContrasena = document.getElementById('confirmarNuevaContrasena');
    const mensajeContrasena = document.getElementById('mensajeContrasena');

    // Clave para almacenar los datos del usuario en localStorage
    const LOCAL_STORAGE_USER_KEY = 'currentUser'; 

    // Función para mostrar mensajes de alerta al usuario
    function mostrarMensaje(mensaje, tipo) {
        mensajeContrasena.textContent = mensaje;
        mensajeContrasena.classList.remove('alerta-exito', 'alerta-error');
        mensajeContrasena.classList.add(`alerta-${tipo}`);
        mensajeContrasena.style.display = 'block';
    }

    // Función para guardar los datos del usuario en localStorage
    function guardarDatosUsuarioEnLocalStorage(usuario) {
        try {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(usuario)); // Convierte el objeto a JSON string antes de guardar
        } catch (e) {
            console.error("Error al guardar en localStorage:", e);
        }
    }

    // Función para cargar los datos del usuario desde localStorage
    function cargarDatosUsuarioDesdeLocalStorage() {
        try {
            const usuarioGuardado = localStorage.getItem(LOCAL_STORAGE_USER_KEY); // Obtiene el string JSON
            return usuarioGuardado ? JSON.parse(usuarioGuardado) : null; // Convierte el string JSON a objeto
        } catch (e) {
            console.error("Error al cargar desde localStorage:", e);
            return null;
        }
    }

    // Función asíncrona para cargar los datos del usuario y los roles desde las APIs o localStorage
    async function cargarDatosUsuarioYRoles() {
        // Primero intenta cargar desde localStorage
        datosUsuario = cargarDatosUsuarioDesdeLocalStorage();

        if (datosUsuario) {
            console.log("Usuario cargado desde localStorage:", datosUsuario);
            // Si hay datos en localStorage, procede a cargar los roles y actualizar el DOM
            await cargarRolesYActualizarDOM(datosUsuario);
        } else {
            // Si no hay datos en localStorage, cárgalos desde la API
            console.log("No hay usuario en localStorage, cargando desde la API...");
            try {
                // Cargar datos de usuarios desde la API
                const respuestaUsuarios = await fetch('https://685b5bb389952852c2d94520.mockapi.io/tbUsers');
                if (!respuestaUsuarios.ok) {
                    throw new Error(`Error al cargar usuarios: ${respuestaUsuarios.statusText}`);
                }
                const usuarios = await respuestaUsuarios.json();

                // Asumimos que el primer usuario de la lista es el que queremos mostrar
                // En una aplicación real, esto sería una lógica de autenticación o selección de usuario
                datosUsuario = usuarios[0]; 

                if (!datosUsuario) {
                    mostrarMensaje('No se encontraron datos de usuario.', 'error');
                    return;
                }

                // Guardar el usuario cargado de la API en localStorage
                guardarDatosUsuarioEnLocalStorage(datosUsuario);
                await cargarRolesYActualizarDOM(datosUsuario);

            } catch (error) {
                console.error('Error al cargar los datos desde la API:', error);
                mostrarMensaje(`Error al cargar los datos: ${error.message}`, 'error');
            }
        }
    }

    // Función para cargar roles y actualizar el DOM
    async function cargarRolesYActualizarDOM(usuario) {
        try {
            const respuestaRoles = await fetch('https://685b5bb389952852c2d94520.mockapi.io/tbRoles');
            if (!respuestaRoles.ok) {
                throw new Error(`Error al cargar roles: ${respuestaRoles.statusText}`);
            }
            const roles = await respuestaRoles.json();

            const mapeoRoles = {};
            roles.forEach(rol => {
                mapeoRoles[rol.id] = rol.name;
            });

            nombreCompletoUsuarioElemento.textContent = usuario.fullName;
            correoUsuarioElemento.textContent = usuario.email;
            
            if (usuario.fotoPerfil) {
                fotoPerfilElemento.src = usuario.fotoPerfil;
            } else {
                fotoPerfilElemento.src = "https://placehold.co/120x120/333333/FFFFFF?text=Sin+Foto";
            }

            if (rolUsuarioElemento) {
                rolUsuarioElemento.textContent = mapeoRoles[usuario.tbRoleId] || 'Desconocido';
            }
        } catch (error) {
            console.error('Error al cargar los roles o actualizar el DOM:', error);
            mostrarMensaje(`Error al cargar roles o mostrar datos: ${error.message}`, 'error');
        }
    }

    // Carga los datos del usuario y los roles al cargar la página
    cargarDatosUsuarioYRoles();

    // Manejador de evento para el envío del formulario de cambio de contraseña
    formularioCambioContrasena.addEventListener('submit', function (evento) {
        evento.preventDefault(); // Evita el envío por defecto del formulario

        mensajeContrasena.style.display = 'none'; // Oculta mensajes anteriores

        const contrasenaActual = campoContrasenaActual.value;
        const nuevaContrasena = campoNuevaContrasena.value;
        const confirmarNuevaContrasena = campoConfirmarNuevaContrasena.value;

        // Validar la contraseña actual (simulada con la contraseña cargada de la API/localStorage)
        if (!datosUsuario || contrasenaActual !== datosUsuario.password) { 
            mostrarMensaje('La contraseña actual es incorrecta.', 'error');
            return;
        }

        // Valida que las nuevas contraseñas coincidan
        if (nuevaContrasena !== confirmarNuevaContrasena) {
            mostrarMensaje('La nueva contraseña y la confirmación no coinciden.', 'error');
            return;
        }

        // Valida la longitud mínima de la nueva contraseña
        if (nuevaContrasena.length < 6) {
            mostrarMensaje('La nueva contraseña debe tener al menos 6 caracteres.', 'error');
            return;
        }

        console.log("Intentando cambiar contraseña para el usuario:", datosUsuario.id);
        console.log("Contraseña actual:", contrasenaActual);
        console.log("Nueva contraseña:", nuevaContrasena);

        // Simulación de llamada a la API para cambiar la contraseña
        // En un entorno real, aquí se haría un 'fetch' a la API para actualizar la contraseña en el backend
        setTimeout(() => {
            const exitoAPI = true; // Cambia a 'false' para simular un error

            if (exitoAPI) {
                // Si la actualización es exitosa en el backend, también actualiza en el objeto local y localStorage
                datosUsuario.password = nuevaContrasena;
                guardarDatosUsuarioEnLocalStorage(datosUsuario); // Actualiza localStorage con la nueva contraseña

                mostrarMensaje('¡Contraseña actualizada con éxito!', 'exito');
                campoContrasenaActual.value = '';
                campoNuevaContrasena.value = '';
                campoConfirmarNuevaContrasena.value = '';
            } else {
                mostrarMensaje('Error al actualizar la contraseña. Inténtalo de nuevo.', 'error');
            }
        }, 1500);
    });
});