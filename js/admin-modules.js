// admin-modules.js

const form = document.getElementById('formulario-modulo');
const moduleNameEl = document.getElementById('nombreModulo');
const moduleDescriptionEl = document.getElementById('descripcionModulo');
const moduleIdEl = document.getElementById('idModulo');
const cancelBtn = document.getElementById('btn-cancelar');
const submitBtn = document.getElementById('btn-enviar');
const tbody = document.getElementById('cuerpo-tabla-modulos');

// In-memory array to simulate database for modules
let modules = [];
let currentModuleId = 1; // To generate unique IDs for new modules

// Function to load modules (from in-memory array)
function CargarModulos() {
    CargarTabla(modules);
}

// Function to render the table with modules
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
                <button onclick="CargarParaEditarModulo('${module.id}')">Editar</button>
                <button onclick="BorrarModulo('${module.id}')">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

// Initial load of modules
window.addEventListener('DOMContentLoaded', () => {
    CargarModulos();
});

// Function to delete a module
async function BorrarModulo(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#881F1E',
        cancelButtonColor: '#555',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        modules = modules.filter(module => module.id !== id);
        CargarModulos();
        Swal.fire(
            '¡Eliminado!',
            'El módulo ha sido eliminado.',
            'success'
        );
    } else {
        Swal.fire(
            'Cancelado',
            'La acción ha sido cancelada.',
            'error'
        );
    }
}

// Function to load module data into the form for editing
function CargarParaEditarModulo(id) {
    const moduleToEdit = modules.find(module => module.id === id);

    if (moduleToEdit) {
        moduleNameEl.value = moduleToEdit.name;
        moduleDescriptionEl.value = moduleToEdit.description;
        moduleIdEl.value = moduleToEdit.id;

        submitBtn.textContent = 'Actualizar Módulo';
        cancelBtn.hidden = false;
    } else {
        Swal.fire('Error', 'Módulo no encontrado para editar.', 'error');
    }
}

// Event listener for cancel button
cancelBtn.addEventListener('click', () => {
    form.reset();
    moduleIdEl.value = '';
    submitBtn.textContent = 'Agregar Módulo';
    cancelBtn.hidden = true;
});

// Event listener for form submission (Add/Update)
form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = moduleNameEl.value.trim();
    const description = moduleDescriptionEl.value.trim();
    const id = moduleIdEl.value;

    // Basic validation
    if (!name) {
        Swal.fire('Error', 'El nombre del módulo es obligatorio.', 'error');
        return;
    }

    if (id) {
        // Update existing module
        const moduleIndex = modules.findIndex(module => module.id === id);
        if (moduleIndex > -1) {
            modules[moduleIndex] = {
                id: id,
                name: name,
                description: description
            };
            await Swal.fire('Éxito', 'Módulo actualizado correctamente.', 'success');
        } else {
            await Swal.fire('Error', 'No se pudo encontrar el módulo para actualizar.', 'error');
        }
    } else {
        // Add new module
        const newModule = {
            id: 'mod-' + currentModuleId++, // Simple unique ID generation
            name: name,
            description: description
        };
        modules.push(newModule);
        await Swal.fire('Éxito', 'Módulo agregado correctamente.', 'success');
    }

    form.reset();
    cancelBtn.hidden = true;
    submitBtn.textContent = 'Agregar Módulo';
    CargarModulos();
});