const form = document.getElementById('formulario-modulo');
const moduleNameEl = document.getElementById('nombreModulo');
const moduleDescriptionEl = document.getElementById('descripcionModulo');
const moduleIdEl = document.getElementById('idModulo');
const cancelBtn = document.getElementById('btn-cancelar');
const submitBtn = document.getElementById('btn-enviar');
const tbody = document.getElementById('cuerpo-tabla-modulos');

const API_BASE = 'http://localhost:8080/api/modules/';

let modules = [];

async function CargarModulos() {
    try {
        const res = await fetch(API_BASE + 'getAllModules');
        if (!res.ok) throw new Error('Error al obtener módulos');
        modules = await res.json();
        CargarTabla(modules);
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No se pudieron cargar los módulos.</td></tr>`;
        Swal.fire({
            title: 'Error',
            text: err.message,
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

function CargarTabla(modulesToLoad) {
    tbody.innerHTML = '';
    if (!modulesToLoad || modulesToLoad.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay módulos registrados.</td></tr>`;
        return;
    }
    modulesToLoad.forEach(module => {
        tbody.innerHTML += `
        <tr>
            <td>${module.id}</td>
            <td>${module.name}</td>
            <td>${module.description}</td>
            <td>
                <button onclick="CargarParaEditarModulo('${module.id}')" class="edit">Editar</button>
                <button onclick="BorrarModulo('${module.id}')" class="delete">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    CargarModulos();
});

// Eliminar un módulo
async function BorrarModulo(id) {
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
            const res = await fetch(API_BASE + 'deleteModule/' + id, { method: 'DELETE' });
            if (!res.ok) throw new Error('No se pudo eliminar el módulo');
            await Swal.fire({
                title: '¡Eliminado!',
                text: 'El módulo ha sido eliminado.',
                icon: 'success',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                },
                buttonsStyling: false
            });
            CargarModulos();
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message,
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

// Cargar datos para editar
function CargarParaEditarModulo(id) {
    const module = modules.find(module => module.id == id);
    if (module) {
        moduleIdEl.value = module.id;
        moduleNameEl.value = module.name;
        moduleDescriptionEl.value = module.description;
        submitBtn.textContent = 'Actualizar Módulo';
        cancelBtn.hidden = false;
    }
}

cancelBtn.addEventListener('click', () => {
    form.reset();
    moduleIdEl.value = '';
    submitBtn.textContent = 'Agregar Módulo';
    cancelBtn.hidden = true;
});

// Crear o actualizar módulo
form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = moduleNameEl.value.trim();
    const description = moduleDescriptionEl.value.trim();
    const id = moduleIdEl.value;

    if (!name) {
        Swal.fire({
            title: 'Error',
            text: 'El nombre del módulo es obligatorio.',
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

    if (!description) {
        Swal.fire({
            title: 'Error',
            text: 'La descripción del módulo es obligatoria.',
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

    if (id) {
        // Actualizar módulo
        try {
            const res = await fetch(API_BASE + 'updateModule/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            if (!res.ok) throw new Error('No se pudo actualizar el módulo');
            await Swal.fire({
                title: 'Éxito',
                text: 'Módulo actualizado correctamente.',
                icon: 'success',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                },
                buttonsStyling: false
            });
            form.reset();
            moduleIdEl.value = '';
            submitBtn.textContent = 'Agregar Módulo';
            cancelBtn.hidden = true;
            CargarModulos();
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message,
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
    } else {
        // Crear módulo
        try {
            const res = await fetch(API_BASE + 'newModule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            if (!res.ok) throw new Error('No se pudo agregar el módulo');
            await Swal.fire({
                title: 'Éxito',
                text: 'Módulo agregado correctamente.',
                icon: 'success',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                },
                buttonsStyling: false
            });
            form.reset();
            moduleIdEl.value = '';
            submitBtn.textContent = 'Agregar Módulo';
            cancelBtn.hidden = true;
            CargarModulos();
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message,
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
});