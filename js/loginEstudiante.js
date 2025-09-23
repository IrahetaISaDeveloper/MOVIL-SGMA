document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const eyeIcon = this.querySelector('i');
            if (eyeIcon.classList.contains('fa-eye')) {
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            } else {
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', async function() {
            const usernameInput = document.getElementById('username-input');

            if (!usernameInput || !passwordInput) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Interfaz',
                    text: 'Error en la interfaz. Por favor, recarga la página.',
                });
                return;
            }

            const email = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Validación de campos vacíos
            if (!email || !password) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos Vacíos',
                    text: 'Por favor, ingresa tus credenciales completas (correo y contraseña).',
                });
                return;
            }

            // Validación de correo institucional
            if (!email.endsWith('@ricaldone.edu.sv')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Correo inválido',
                    text: 'Debes ingresar tu correo institucional (@ricaldone.edu.sv).',
                });
                return;
            }

            try {
                const response = await fetch('https://sgma-66ec41075156.herokuapp.com/api/studentsAuth/studentLogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    let studentId = null;
                    try {
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const responseData = await response.json();
                            if (responseData && responseData.student && responseData.student.id) {
                                studentId = responseData.student.id;
                            }
                        }
                    } catch (e) {
                        // Si falla el parseo, continúa sin guardar el id
                    }
                    if (studentId) {
                        localStorage.setItem('studentId', studentId);
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Inicio de sesión exitoso',
                        text: 'Bienvenido al sistema.',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'estudiante.html';
                    });
                } else {
                    const errorText = await response.text();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de inicio de sesión',
                        text: errorText.includes('Credenciales') ? 'Credenciales incorrectas.' : errorText,
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor. Intenta más tarde.',
                });
            }
        });
    } else {
        console.error("Error: Botón de inicio de sesión no encontrado.");
    }

    const vehicleTrackingButton = document.getElementById('vehicle-tracking-btn');
    if (vehicleTrackingButton) {
        vehicleTrackingButton.addEventListener('click', function() {
            window.location.href = 'auth-seguimiento.html';
        });
    }

    // Ejemplo: consulta autenticada usando la cookie creada por el backend
    async function obtenerDatosEstudiante() {
        try {
            const response = await fetch('https://sgma-66ec41075156.herokuapp.com/api/studentsAuth/meStudent', {
                method: 'GET',
            });
            const data = await response.json();
            if (data.authenticated) {
                console.log('Datos del estudiante:', data.student);
            } else {
                console.log('No autenticado');
            }
        } catch (error) {
            console.error('Error obteniendo datos del estudiante:', error);
        }
    }
    // obtenerDatosEstudiante();
});