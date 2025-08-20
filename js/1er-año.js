document.addEventListener('DOMContentLoaded', () => {
    const modalVehiculo = document.getElementById("modalVehiculo");
    const botonesAbrirModalVehiculo = document.querySelectorAll(".item-registro .mas-opciones i.fa-ellipsis-v");
    const botonCerrarModalVehiculo = modalVehiculo.querySelector(".boton-cerrar");

    if (modalVehiculo) {
        modalVehiculo.style.display = "none";
    }

    botonesAbrirModalVehiculo.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            if (modalVehiculo) {
                modalVehiculo.style.display = "flex";
            }
        };
    });

    botonCerrarModalVehiculo.onclick = () => {
        modalVehiculo.style.display = "none";
    };

    window.onclick = (e) => {
        if (e.target === modalVehiculo) {
            modalVehiculo.style.display = "none";
        }
    };

    function mostrarPerfilUsuario() {
        const nombreUsuarioNav = document.getElementById('nombreUsuario');
        const rolUsuarioNav = document.getElementById('rolUsuario');
        const detalleUsuarioNav = document.getElementById('detalleUsuario');
        const imagenAvatarNav = document.getElementById('imagenAvatar');

        const nombreUsuarioAlmacenado = localStorage.getItem('loggedInUserName');
        const fotoUsuarioAlmacenada = localStorage.getItem('loggedInUserPhoto');
        const rolUsuarioAlmacenado = localStorage.getItem('loggedInUserRole') || 'Rol Desconocido';
        const detalleUsuarioAlmacenado = localStorage.getItem('loggedInUserDetail') || 'Detalle Desconocido';

        if (nombreUsuarioAlmacenado) {
            nombreUsuarioNav.textContent = nombreUsuarioAlmacenado;
            rolUsuarioNav.textContent = rolUsuarioAlmacenado;
            detalleUsuarioNav.textContent = detalleUsuarioAlmacenado;

            if (fotoUsuarioAlmacenada) {
                imagenAvatarNav.src = fotoUsuarioAlmacenada;
            } else {
                imagenAvatarNav.src = 'placeholder-avatar.png';
            }
        } else {
            nombreUsuarioNav.textContent = "Usuario";
            rolUsuarioNav.textContent = "Invitado";
            detalleUsuarioNav.textContent = "";
            imagenAvatarNav.src = 'placeholder-avatar.png';
        }
    }

    mostrarPerfilUsuario();
});