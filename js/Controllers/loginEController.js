// js/controllers/loginController.js
// -------------------------------------------------------------
// Controlador de login.
// - Gestiona envío del formulario y estados de UI (botón)
// - Usa authService: login() y me() para validar sesión tras login
// -------------------------------------------------------------

import { loginStudent, me } from '../Services/AuthStudentService.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('loginForm');

  // Maneja el submit del formulario de login.
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1) Obtención tolerante de campos
    const correo = (document.getElementById("username-input")?.value || '').trim();
    const contrasena = document.getElementById("password-input")?.value || '';

    // Referencia y estado del botón "Ingresar"
    const btnIngresar = document.getElementById("iniciarSesion");
    let originalText;

    try {
      // 2) Desactiva botón para evitar reenvíos múltiples y muestra feedback de carga
      if (btnIngresar) {
        originalText = btnIngresar.innerHTML;
        btnIngresar.setAttribute("disabled", "disabled");
        btnIngresar.innerHTML = 'Ingresando…';
      }

      // 3) Llama al servicio de login (envía credenciales, espera cookie de sesión)
      await loginStudent({ email: correo, password: contrasena });

      // 4) Verifica sesión con /me para confirmar que la cookie quedó activa
      const info = await me(); // el service incluye credentials:'include'
      if (info?.authenticated) {
        // Redirección a la página principal si autenticado
        window.location.href = 'estudiante.html';
      } else {
        console.error('Error de autenticación: la sesión no se activó.');
      }
    } catch (err) {
      // Muestra mensaje de error en la consola
      console.error('Error en el login:', err?.message || 'No fue posible iniciar sesión.');
    } finally {
      // 5) Restaura estado del botón (habilita y devuelve texto original)
      if (btnIngresar) {
        btnIngresar.removeAttribute("disabled");
        if (originalText) btnIngresar.innerHTML = originalText;
      }
    }
  });
});