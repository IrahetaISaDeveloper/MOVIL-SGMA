import { login, me } from '../services/authServiceStudents.js';

// Adaptación de login usando los campos del HTML de index.html
document.addEventListener('DOMContentLoaded', async () => {
  // No hay form, así que usamos el botón y los campos directamente
  const btnLogin = document.getElementById('login-btn');
  // Opcional: puedes usar SweetAlert2 para mostrar errores

  btnLogin?.addEventListener('click', async (e) => {
    e.preventDefault();

    // Tomar los valores de los campos del HTML
    const email = (document.getElementById('username-input')?.value || '').trim();
    const password = document.getElementById('password-input')?.value || '';

    if (!email || !password) {
      Swal.fire('Error', 'Ingrese su correo y contraseña', 'error');
      return;
    }

    try {
      await login({ email, password }); // Cambia aquí los nombres de los campos
      const info = await me();
      if (info?.authenticated) {
        window.location.href = 'estudiante.html';
      } else {
        Swal.fire('Error', 'No se pudo autenticar la sesión', 'error');
      }
    } catch (err) {
      Swal.fire('Error', err?.message || 'No fue posible iniciar sesión.', 'error');
    }
  });
});

