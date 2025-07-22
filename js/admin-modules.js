const form = document.getElementById('formulario-modulo');
const moduleNameEl = document.getElementById('nombreModulo');
const moduleDescriptionEl = document.getElementById('descripcionModulo');
const moduleIdEl = document.getElementById('idModulo');
const cancelBtn = document.getElementById('btn-cancelar');
const submitBtn = document.getElementById('btn-enviar');
const tbody = document.getElementById('cuerpo-tabla-modulos');

let modules = [];
let currentModuleId = 1;

function CargarModulos() {
    CargarTabla(modules);
}

function CargarTabla(modulesToLoad) {
    tbody.innerHTML = '';
    if (modulesToLoad.length === 0) {
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
        modules = modules.filter(module => module.id !== id);
        CargarModulos();
        Swal.fire({
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
    }
}

function CargarParaEditarModulo(id) {
    const module = modules.find(module => module.id === id);
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

    if (id) {
        const moduleIndex = modules.findIndex(module => module.id === id);
        if (moduleIndex > -1) {
            modules[moduleIndex] = {
                id: id,
                name: name,
                description: description
            };
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
        } else {
            await Swal.fire({
                title: 'Error',
                text: 'No se pudo encontrar el módulo para actualizar.',
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
        const newModule = {
            id: 'mod-' + currentModuleId++,
            name: name,
            description: description
        };
        modules.push(newModule);
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
    }

    form.reset();
    moduleIdEl.value = '';
    submitBtn.textContent = 'Agregar Módulo';
    cancelBtn.hidden = true;
    CargarModulos();
});