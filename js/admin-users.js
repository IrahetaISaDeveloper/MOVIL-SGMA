//const API_URL = 'https://685b5bb389952852c2d94520.mockapi.io/tbUsers';
//const ROLES_API_URL = 'https://685b5bb389952852c2d94520.mockapi.io/tbRoles';

//const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=eaf6049b5324954d994475cb0c0a6156';

const API_URL = 'https://685b5bb389952852c2d94520.mockapi.io/tbUsers';
const ROLES_API_URL = 'http://localhost:8080/api/Roles/getAllRoles';
const INSTRUCTORS_API_URL = 'http://localhost:8080/api/instructors/getDataInstructors';
const LEVELS_API_URL = 'http://localhost:8080/api/levels/getDataLevels';
const GRADES_API_URL = 'http://localhost:8080/api/grades/getAllGrades';
const ADD_INSTRUCTOR_API_URL = 'http://localhost:8080/api/instructors/addNewInstructor';
const UPDATE_INSTRUCTOR_API_URL = 'http://localhost:8080/api/instructors/updateInstructor/';
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
// Agregados para niveles y grupos
const filtroAnoEl = document.getElementById('filtro-ano');
const filtroGrupoEl = document.getElementById('filtro-grupo');
const buscadorUsuariosEl = document.getElementById('buscador-usuarios');
const idLevelEl = document.getElementById('idLevel');

let roles = [];
let instructoresOriginal = [];
let grades = [];

async function cargarRoles() {
  try {
    const res = await fetch(ROLES_API_URL);
    const data = await res.json();
    roles = Array.isArray(data) ? data : (data.data || []);
    tbRoleIdEl.innerHTML = '';
    roles.forEach(rol => {
      const opcion = document.createElement('option');
      opcion.value = rol.rolId;
      opcion.textContent = rol.rolName;
      tbRoleIdEl.appendChild(opcion);
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

async function cargarLevels() {
  try {
    const res = await fetch(LEVELS_API_URL);
    const data = await res.json();
    const levels = Array.isArray(data) ? data : (data.data || []);
    if (idLevelEl) {
      idLevelEl.innerHTML = '';
      levels.forEach(level => {
        const opcion = document.createElement('option');
        opcion.value = level.levelId || level.id;
        opcion.textContent = `${level.levelName} (${level.levelId || level.id})`;
        idLevelEl.appendChild(opcion);
      });
    }
    if (filtroAnoEl) {
      filtroAnoEl.innerHTML = '<option value="">Todos los años</option>';
      levels.forEach(level => {
        const opcion = document.createElement('option');
        opcion.value = level.levelId || level.id;
        opcion.textContent = `${level.levelName}`;
        filtroAnoEl.appendChild(opcion);
      });
    }
  } catch (error) {
    console.error('Error al cargar los niveles:', error);
    Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los niveles. Intenta de nuevo más tarde.',
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

async function cargarGrupos() {
  try {
    const res = await fetch(GRADES_API_URL);
    const data = await res.json();
    grades = Array.isArray(data) ? data : (data.data || []);
    if (filtroGrupoEl) {
      filtroGrupoEl.innerHTML = '<option value="">Todos los grupos</option>';
      grades.forEach(grade => {
        const opcion = document.createElement('option');
        opcion.value = grade.gradeGroup;
        opcion.textContent = `Grupo ${grade.gradeGroup}`;
        filtroGrupoEl.appendChild(opcion);
      });
    }
  } catch (error) {
    console.error('Error al cargar los grupos:', error);
    Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los grupos. Intenta de nuevo más tarde.',
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

async function cargarUsuarios() {
  try {
    const res = await fetch(INSTRUCTORS_API_URL);
    const data = await res.json();
    let instructores = [];
    if (data && data.data && Array.isArray(data.data.content)) {
      instructores = data.data.content;
    }
    instructoresOriginal = instructores;
    filtrarYMostrarUsuarios();
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

function filtrarYMostrarUsuarios() {
  let lista = instructoresOriginal.slice();
  if (filtroAnoEl) {
    const levelId = filtroAnoEl.value;
    if (levelId) {
      lista = lista.filter(i => String(i.levelId) === levelId);
    }
  }
  if (filtroGrupoEl) {
    const grupo = filtroGrupoEl.value;
    if (grupo) {
      lista = lista.filter(i => String(i.gradeGroup) === grupo);
    }
  }
  if (buscadorUsuariosEl) {
    const texto = buscadorUsuariosEl.value.trim().toLowerCase();
    if (texto) {
      lista = lista.filter(i =>
        `${i.firstName} ${i.lastName}`.toLowerCase().includes(texto) ||
        (i.email && i.email.toLowerCase().includes(texto))
      );
    }
  }
  cargarTabla(lista);
}

function cargarTabla(instructores) {
  tbody.innerHTML = '';
  instructores.forEach(instructor => {
    tbody.innerHTML += `
      <tr>
        <td style="text-align:center;"><img src="${instructor.instructorImage || 'https://i.ibb.co/N6fL89pF/yo.jpg'}" alt="Foto de ${instructor.firstName} ${instructor.lastName}" class="profile-thumb" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" /></td>
        <td>${instructor.firstName}</td>
        <td>${instructor.lastName}</td>
        <td>${instructor.email}</td>
        <td>${instructor.roleName}</td>
        <td>${instructor.levelName}</td>
        <td>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <button onclick="cargarParaEditarUsuario('${instructor.instructorId}')" class="edit" style="width:120px;">Editar</button>
            <button onclick="borrarUsuario('${instructor.instructorId}')" class="delete" style="width:120px;">Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  await cargarRoles();
  await cargarLevels();
  await cargarGrupos();
  await cargarUsuarios();
  if (filtroAnoEl) filtroAnoEl.addEventListener('change', filtrarYMostrarUsuarios);
  if (filtroGrupoEl) filtroGrupoEl.addEventListener('change', filtrarYMostrarUsuarios);
  if (buscadorUsuariosEl) buscadorUsuariosEl.addEventListener('input', filtrarYMostrarUsuarios);
});

fotoPerfilFileEl.addEventListener('change', function() {
  const archivo = this.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = function(e) {
      fotoPerfilPreviewEl.src = e.target.result;
      fotoPerfilPreviewEl.style.display = 'block';
    };
    lector.readAsDataURL(archivo);
  } else {
    fotoPerfilPreviewEl.src = '';
    fotoPerfilPreviewEl.style.display = 'none';
  }
});

cancelBtn.addEventListener('click', () => {
  form.reset();
  userIdEl.value = '';
  fotoPerfilPreviewEl.src = '';
  fotoPerfilPreviewEl.style.display = 'none';
  submitBtn.textContent = 'Agregar Usuario';
  cancelBtn.hidden = true;
  passwordEl.disabled = false;
});

async function subirImagen(archivo) {
  const fd = new FormData();
  fd.append('image', archivo);
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

form.addEventListener('submit', async e => {
  e.preventDefault();
  const fullName = fullNameEl.value.trim();
  const email = emailEl.value.trim();
  let password = passwordEl.value.trim();
  const isEditing = !!userIdEl.value;
  const roleId = tbRoleIdEl.value;
  const levelId = idLevelEl ? idLevelEl.value : '';
  let instructorImage = fotoPerfilUrlEl.value;
  // Apellidos: se puede agregar un campo en el HTML si se requiere
  let lastName = '';
  if (document.getElementById('apellidos')) {
    lastName = document.getElementById('apellidos').value.trim();
  }

  if (!fullName || fullName.length < 3) {
    Swal.fire({
        title: 'Error',
        text: 'El nombre debe tener al menos 3 caracteres.',
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
  if (lastName !== undefined && lastName.length < 2) {
    Swal.fire({
        title: 'Error',
        text: 'El apellido debe tener al menos 2 caracteres.',
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
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
  if (!isEditing && (!password || password.length < 6)) {
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
  if (!roleId) {
    Swal.fire({
        title: 'Error',
        text: 'Por favor, selecciona un rol.',
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
  if (!levelId) {
    Swal.fire({
        title: 'Error',
        text: 'Por favor, selecciona un nivel.',
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
    const nuevaUrlFoto = await subirImagen(fotoPerfilFileEl.files[0]);
    if (nuevaUrlFoto) {
      instructorImage = nuevaUrlFoto;
    } else {
      return;
    }
  } else if (!instructorImage) {
    instructorImage = 'https://i.ibb.co/N6fL89pF/yo.jpg';
  }

  const cargaUtil = {
    firstName: fullName,
    lastName,
    email,
    levelId: Number(levelId),
    roleId: Number(roleId),
    instructorImage
  };
  if (!isEditing) {
    cargaUtil.password = password;
  }
  if (isEditing) {
    cargaUtil.instructorId = Number(userIdEl.value);
  }

  try {
    if (isEditing) {
      await fetch(`${UPDATE_INSTRUCTOR_API_URL}${userIdEl.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cargaUtil)
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
      await fetch(ADD_INSTRUCTOR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cargaUtil)
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
  userIdEl.value = '';
  cancelBtn.hidden = true;
  submitBtn.textContent = 'Agregar Usuario';
  fotoPerfilPreviewEl.src = '';
  fotoPerfilPreviewEl.style.display = 'none';
  passwordEl.disabled = false;
  cargarUsuarios();
});

async function cargarParaEditarUsuario(id) {
  try {
    const res = await fetch(`http://localhost:8080/api/instructors/getInstructorById/${id}`);
    const result = await res.json();
    const instructor = result.data || {};
    fullNameEl.value = instructor.firstName || '';
    if (document.getElementById('apellidos')) {
      document.getElementById('apellidos').value = instructor.lastName || '';
    }
    emailEl.value = instructor.email || '';
    passwordEl.value = '';
    tbRoleIdEl.value = instructor.roleId || '';
    if (idLevelEl) {
      setTimeout(() => {
        idLevelEl.value = instructor.levelId || '';
      }, 0);
    }
    fotoPerfilUrlEl.value = instructor.instructorImage || '';
    fotoPerfilPreviewEl.src = instructor.instructorImage || 'https://i.ibb.co/N6fL89pF/yo.jpg';
    fotoPerfilFileEl.value = '';
    userIdEl.value = instructor.instructorId || '';
    submitBtn.textContent = 'Actualizar Usuario';
    cancelBtn.hidden = false;
    passwordEl.disabled = false;
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

async function borrarUsuario(id) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el usuario de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      content: 'swal-custom-content',
      confirmButton: 'swal-custom-confirm-button',
      cancelButton: 'swal-custom-cancel-button'
    }
  });
  if (result.isConfirmed) {
    try {
      const res = await fetch(`http://localhost:8080/api/instructors/deleteInstructor/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        Swal.fire({
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
        cargarUsuarios();
      } else {
        throw new Error('No se pudo eliminar el instructor');
      }
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

async function resetInstructorPassword(id) {
  const result = await Swal.fire({
    title: '¿Restablecer contraseña?',
    text: 'Esta acción restablecerá la contraseña del instructor seleccionado.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, restablecer',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      content: 'swal-custom-content',
      confirmButton: 'swal-custom-confirm-button',
      cancelButton: 'swal-custom-cancel-button'
    }
  });
  if (result.isConfirmed) {
    try {
      const res = await fetch(`http://localhost:8080/api/instructors/update/${id}/password`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.Success) {
        Swal.fire({
            title: '¡Restablecida!',
            text: 'La contraseña del instructor ha sido restablecida.',
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
        Swal.fire({
            title: 'Error',
            text: 'No se pudo restablecer la contraseña. Intenta de nuevo.',
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
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      Swal.fire({
          title: 'Error',
          text: 'No se pudo restablecer la contraseña. Intenta de nuevo.',
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