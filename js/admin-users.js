// Coloca tu endpoint de MockAPI para usuarios
const API_URL = 'https://685b5bb389952852c2d94520.mockapi.io/tbUsers';
// Coloca tu endpoint de MockAPI para roles
const ROLES_API_URL = 'https://685b5bb389952852c2d94520.mockapi.io/tbRoles';

// Coloca tu endpoint de ImgBB
// NOTA: Reemplaza 'YOUR_IMGBB_API_KEY' con tu clave real de ImgBB.
// Si no tienes una, regístrate en imgbb.com para obtener una.
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=eaf6049b5324954d994475cb0c0a6156';

const form = document.getElementById('user-form'); // Formulario principal
const fullNameEl = document.getElementById('fullName'); // Campo de nombre completo
const emailEl = document.getElementById('email'); // Campo de email
const passwordEl = document.getElementById('password'); // Campo de contraseña
const tbRoleIdEl = document.getElementById('tbRoleId'); // Selector de rol
const fotoPerfilFileEl = document.getElementById('fotoPerfil-file'); // Input de archivo (foto de perfil)
const fotoPerfilUrlEl = document.getElementById('fotoPerfil-url'); // Campo oculto con URL de la imagen
const fotoPerfilPreviewEl = document.getElementById('fotoPerfil-preview'); // Elemento <img> para previsualización
const userIdEl = document.getElementById('userId'); // Campo oculto con ID del usuario
const cancelBtn = document.getElementById('btn-cancel'); // Botón para cancelar edición
const submitBtn = document.getElementById('btn-submit'); // Botón para agregar/actualizar
const tbody = document.getElementById('users-tbody'); // Cuerpo de la tabla de registros

let roles = []; // Para almacenar los roles y hacer lookup de nombres

// Función para cargar los roles desde la API y poblar el selector
async function CargarRoles() {
    try {
        const res = await fetch(ROLES_API_URL);
        roles = await res.json();
        tbRoleIdEl.innerHTML = ''; // Limpiar opciones existentes
        // Añadir una opción predeterminada o un placeholder si lo deseas
        // const defaultOption = document.createElement('option');
        // defaultOption.value = '';
        // defaultOption.textContent = 'Selecciona un rol';
        // defaultOption.disabled = true;
        // defaultOption.selected = true;
        // tbRoleIdEl.appendChild(defaultOption);

        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.roleId;
            option.textContent = role.roleName;
            tbRoleIdEl.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los roles:', error);
        alert('No se pudieron cargar los roles. Intenta de nuevo más tarde.');
    }
}

// Función para obtener el nombre del rol dado su ID
function getRoleNameById(roleId) {
    const role = roles.find(r => r.roleId === roleId);
    return role ? role.roleName : 'Desconocido';
}

async function CargarUsuarios() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        CargarTabla(data);
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        alert('No se pudieron cargar los usuarios. Intenta de nuevo más tarde.');
    }
}

function CargarTabla(users) {
    tbody.innerHTML = '';
    users.forEach(user => {
        tbody.innerHTML += `
        <tr>
            <td><img src="${user.fotoPerfil || 'https://i.ibb.co/N6fL89pF/yo.jpg'}" alt="Foto de ${user.fullName}" class="profile-thumb" /></td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${getRoleNameById(user.tbRoleId)}</td>
            <td>
                <button onclick="CargarParaEditarUsuario('${user.id}')">Editar</button>
                <button onclick="BorrarUsuario('${user.id}')">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

// Carga inicial de roles y usuarios
window.addEventListener('DOMContentLoaded', async () => {
    await CargarRoles();
    await CargarUsuarios();
});

async function BorrarUsuario(id) {
    const confirmacion = confirm('¿Eliminar este usuario?');

    if (confirmacion) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            CargarUsuarios();
            alert("El registro fue eliminado.");
        } catch (error) {
            console.error('Error al borrar usuario:', error);
            alert('No se pudo eliminar el usuario.');
        }
    } else {
        alert("Se canceló la acción.");
    }
}

async function CargarParaEditarUsuario(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const user = await res.json();

        fullNameEl.value = user.fullName;
        emailEl.value = user.email;
        passwordEl.value = user.password; // Note: For security, never pre-fill passwords in real apps
        tbRoleIdEl.value = user.tbRoleId;
        fotoPerfilUrlEl.value = user.fotoPerfil;
        fotoPerfilPreviewEl.src = user.fotoPerfil || 'https://i.ibb.co/N6fL89pF/yo.jpg'; // Show preview
        fotoPerfilFileEl.value = ''; // Limpiar el input de archivo
        userIdEl.value = user.id;

        submitBtn.textContent = 'Actualizar Usuario';
        cancelBtn.hidden = false;
    } catch (error) {
            console.error('Error al cargar usuario para editar:', error);
        alert('No se pudo cargar la información del usuario para editar.');
    }
}

// Event listener para previsualizar la imagen seleccionada
fotoPerfilFileEl.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotoPerfilPreviewEl.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        fotoPerfilPreviewEl.src = fotoPerfilUrlEl.value || 'https://i.ibb.co/N6fL89pF/yo.jpg'; // Fallback to existing or default
    }
});


cancelBtn.addEventListener('click', () => {
    form.reset();
    userIdEl.value = '';
    submitBtn.textContent = 'Agregar Usuario';
    cancelBtn.hidden = true;
    fotoPerfilFileEl.value = ''; // Ensure file input is cleared
    fotoPerfilPreviewEl.src = ''; // Clear image preview
});

async function subirImagen(file) {
    const fd = new FormData();
    fd.append('image', file);
    try {
        const res = await fetch(IMG_API_URL, { method: 'POST', body: fd });
        const obj = await res.json();
        if (obj.data && obj.data.url) {
            return obj.data.url;
        } else {
            throw new Error('URL de imagen no encontrada en la respuesta de ImgBB.');
        }
    } catch (error) {
        console.error('Error al subir imagen:', error);
        alert('No se pudo subir la imagen. Intenta de nuevo.');
        return null; // Retornar null en caso de error
    }
}

form.addEventListener('submit', async e => {
    e.preventDefault();

    let fotoUrl = fotoPerfilUrlEl.value; // Usar la URL existente por defecto
    if (fotoPerfilFileEl.files.length > 0) {
        // Si hay un nuevo archivo, subirlo
        const newFotoUrl = await subirImagen(fotoPerfilFileEl.files[0]);
        if (newFotoUrl) {
            fotoUrl = newFotoUrl;
        } else {
            // Si la subida falla, no continuar con el submit
            return;
        }
    } else if (!fotoUrl) {
        // Si no hay archivo nuevo y tampoco hay URL existente, asignar una por defecto
        fotoUrl = 'https://i.ibb.co/N6fL89pF/yo.jpg'; // O una URL de imagen de perfil por defecto
    }

    const payload = {
        fullName: fullNameEl.value,
        email: emailEl.value,
        password: passwordEl.value,
        tbRoleId: tbRoleIdEl.value,
        fotoPerfil: fotoUrl
    };

    try {
        if (userIdEl.value) {
            // Actualizar usuario existente
            await fetch(`${API_URL}/${userIdEl.value}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert("Usuario actualizado.");
        } else {
            // Agregar nuevo usuario
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert("Usuario agregado.");
        }
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        alert('No se pudo guardar el usuario. Intenta de nuevo.');
    }

    form.reset();
    cancelBtn.hidden = true;
    submitBtn.textContent = 'Agregar Usuario';
    fotoPerfilFileEl.value = ''; // Clear file input after submit
    fotoPerfilPreviewEl.src = ''; // Clear image preview
    CargarUsuarios();
});