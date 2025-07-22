const API_URL = 'https://685b5bb389952852c2d94520.mockapi.io/tbUsers';
const ROLES_API_URL = 'https://685b5bb389952852c2d94520.mockapi.io/tbRoles';

const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=eaf6049b5324954d994475cb0c0a6156';

const form = document.getElementById('user-form');
const fullNameEl = document.getElementById('fullName');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const tbRoleIdEl = document.getElementById('tbRoleId');
const fotoPerfilFileEl = document.getElementById('fotoPerfil-file');
const fotoPerfilUrlEl = document.getElementById('fotoPerfil-url');
const fotoPerfilPreviewEl = document.getElementById('fotoPerfil-preview');
const userIdEl = document.getElementById('userId');
const cancelBtn = document.getElementById('btn-cancel');
const submitBtn = document.getElementById('btn-submit');
const tbody = document.getElementById('users-tbody');

let roles = [];

async function CargarRoles() {
    try {
        const res = await fetch(ROLES_API_URL);
        roles = await res.json();
        tbRoleIdEl.innerHTML = '';

        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.roleId;
            option.textContent = role.roleName;
            tbRoleIdEl.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los roles:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los roles. Intenta de nuevo más tarde.',
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
}

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
        Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los usuarios. Intenta de nuevo más tarde.',
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
                <button onclick="CargarParaEditarUsuario('${user.id}')" class="edit">Editar</button>
                <button onclick="BorrarUsuario('${user.id}')" class="delete">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

fotoPerfilFileEl.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotoPerfilPreviewEl.src = e.target.result;
            fotoPerfilPreviewEl.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        fotoPerfilPreviewEl.src = '';
        fotoPerfilPreviewEl.style.display = 'none';
    }
});

async function SubirImagen(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch(IMG_API_URL, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('Error al subir imagen a ImgBB');
        }
    } catch (error) {
        console.error('Error al subir imagen:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo subir la imagen de perfil.',
            icon: 'error',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button'
            },
            buttonsStyling: false
        });
        return null;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await CargarRoles();
    await CargarUsuarios();
});

async function BorrarUsuario(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#881F1E',
        cancelButtonColor: '#555',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            content: 'swal-custom-content',
            confirmButton: 'swal-custom-confirm-button',
            cancelButton: 'swal-custom-cancel-button'
        },
        buttonsStyling: false
    });

    if (result.isConfirmed) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            await Swal.fire({
                title: '¡Eliminado!',
                text: 'El usuario ha sido eliminado.',
                icon: 'success',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                },
                buttonsStyling: false
            });
            CargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el usuario. Intenta de nuevo.',
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
    }
}

async function CargarParaEditarUsuario(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const user = await res.json();

        userIdEl.value = user.id;
        fullNameEl.value = user.fullName;
        emailEl.value = user.email;
        passwordEl.value = user.password;
        tbRoleIdEl.value = user.tbRoleId;
        fotoPerfilUrlEl.value = user.fotoPerfil;

        if (user.fotoPerfil) {
            fotoPerfilPreviewEl.src = user.fotoPerfil;
            fotoPerfilPreviewEl.style.display = 'block';
        } else {
            fotoPerfilPreviewEl.src = '';
            fotoPerfilPreviewEl.style.display = 'none';
        }

        submitBtn.textContent = 'Actualizar Usuario';
        cancelBtn.hidden = false;
    } catch (error) {
        console.error('Error al cargar usuario para editar:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el usuario para editar.',
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
}

cancelBtn.addEventListener('click', () => {
    form.reset();
    userIdEl.value = '';
    fotoPerfilPreviewEl.src = '';
    fotoPerfilPreviewEl.style.display = 'none';
    submitBtn.textContent = 'Agregar Usuario';
    cancelBtn.hidden = true;
});

form.addEventListener('submit', async e => {
    e.preventDefault();

    const fullName = fullNameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();
    const tbRoleId = tbRoleIdEl.value;
    let fotoUrl = fotoPerfilUrlEl.value;

    if (!fullName || !email || !password || !tbRoleId) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos obligatorios (Nombre, Email, Contraseña, Rol).',
            icon: 'error',
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, introduce un formato de correo electrónico válido.',
            icon: 'error',
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

    if (password.length < 6) {
        Swal.fire({
            title: 'Error',
            text: 'La contraseña debe tener al menos 6 caracteres.',
            icon: 'error',
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

    if (fotoPerfilFileEl.files.length > 0) {
        fotoUrl = await SubirImagen(fotoPerfilFileEl.files[0]);
        if (!fotoUrl) {
            return;
        }
    } else if (!fotoUrl) {
        fotoUrl = 'https://i.ibb.co/N6fL89pF/yo.jpg';
    }

    const payload = {
        fullName: fullName,
        email: email,
        password: password,
        tbRoleId: tbRoleId,
        fotoPerfil: fotoUrl
    };

    try {
        if (userIdEl.value) {
            await fetch(`${API_URL}/${userIdEl.value}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            Swal.fire({
                title: '¡Actualizado!',
                text: 'Usuario actualizado correctamente.',
                icon: 'success',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                },
                buttonsStyling: false
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            Swal.fire({
                title: '¡Agregado!',
                text: 'Usuario agregado correctamente.',
                icon: 'success',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                },
                buttonsStyling: false
            });
        }
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo guardar el usuario. Intenta de nuevo.',
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

    form.reset();
    cancelBtn.hidden = true;
    submitBtn.textContent = 'Agregar Usuario';
    fotoPerfilPreviewEl.src = '';
    fotoPerfilPreviewEl.style.display = 'none';
    CargarUsuarios();
});