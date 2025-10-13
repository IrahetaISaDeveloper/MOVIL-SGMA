import { loginInstructor, meInstructor } from '../../services/AuthInstructors/authInstructorService.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('authForm');
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('passwordInstructor');

  // 🔐 Toggle de mostrar/ocultar contraseña
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;

      const icon = this.querySelector('i');
      if (icon) {
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
      }
    });
  }

  // 🧠 Manejo del formulario de inicio de sesión
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInstructor = document.getElementById('emailInstructor').value.trim();
      const passwordInstructor = document.getElementById('passwordInstructor').value;

      if (!emailInstructor || !passwordInstructor) {
        Swal.fire({
          icon: 'error',
          title: 'Campos vacíos',
          text: 'Por favor completa todos los campos.',
        });
        return;
      }

      const authBtn = document.getElementById('authBtn');
      const originalText = authBtn ? authBtn.innerHTML : '';

      try {
        if (authBtn) {
          authBtn.disabled = true;
          authBtn.innerHTML = 'Ingresando...';
        }

        // Llama al servicio de login
        await loginInstructor({ emailInstructor, passwordInstructor });

        // Verifica si la sesión quedó activa
        const info = await meInstructor();
        console.log('Información de sesión:', info);

        if (info?.authenticated) {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido al sistema.',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.replace('coordi-index.html');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de sesión',
            text: 'No se pudo validar la sesión o cookie.',
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: err?.message || 'No fue posible iniciar sesión.',
        });
      } finally {
        if (authBtn) {
          authBtn.disabled = false;
          authBtn.innerHTML = originalText;
        }
      }
    });
  } else {
    // Si el formulario no existe, muestra error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontró el formulario de autenticación.',
    });
  }
});
