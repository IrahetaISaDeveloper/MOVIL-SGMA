/*import { me, logout } from "../services/authServiceStudents.js";

// Estado de sesión global
export const auth = {
  ok: false,   // indica si la sesión está activa
  user: null,  // guarda datos del usuario autenticado
};

export async function renderUsuario() {
  const userBox = document.getElementById("userBox");
  const loginLink = document.getElementById("loginLink");

  try {
    const info = await me();               // consulta al endpoint /me
    auth.ok = !!info?.authenticated;      // true si está autenticado
    auth.user = info?.user ?? null;

    if (auth.ok) {
      ensureMenuLinks(true);

      if (userBox) {
        // Construye saludo y botón de logout
        userBox.innerHTML = `
          <span class="me-3">Hola, <strong>${auth.user?.nombre ?? auth.user?.correo ?? "usuario"}</strong></span>
          <button id="btnLogout" class="btn btn-outline-danger btn-sm">Salir</button>
        `;
        userBox.classList.remove("d-none");

        // Listener para logout
        document.getElementById("btnLogout")?.addEventListener("click", async () => {
          await logout();             // llama al backend para cerrar sesión
          auth.ok = false;
          auth.user = null;
          ensureMenuLinks(false);     // limpia enlaces del menú
          window.location.replace("index.html"); // redirige al login
        });
      }
    } else {
      // Caso: no autenticado
      auth.ok = false;
      auth.user = null;
      userBox?.classList.add("d-none");
      ensureMenuLinks(false);
    }
  } catch {
    // Caso: error consultando /me → se trata como no autenticado
    auth.ok = false;
    auth.user = null;
    loginLink?.classList.remove("d-none");
    document.getElementById("userBox")?.classList.add("d-none");
    ensureMenuLinks(false);
  }
}

export async function requireAuth({ redirect = true } = {}) {
  try {
    const info = await me();             // consulta al backend
    auth.ok = !!info?.authenticated;
    auth.user = info?.user ?? null;
  } catch {
    auth.ok = false;
    auth.user = null;
  }

  if (!auth.ok && redirect) {
    window.location.replace("index.html");
  }
  return auth.ok; // devuelve booleano indicando si hay sesión
}

export function getUserRole() {
  // "Administrador" | "Almacenista" | "Cliente" (o undefined)
  return auth.user?.rol || "";
}

export function hasAuthority(authority) {
  // "ROLE_Administrador", "ROLE_Almacenista", "ROLE_Cliente"
  return Array.isArray(auth.user?.authorities)
    ? auth.user.authorities.includes(authority)
    : false;
}

export const role = {
  isAdmin: () =>
    getUserRole() === "Administrador" || hasAuthority("ROLE_Administrador"),

  isCoordinadora: () =>
    getUserRole() === "Almacenista" || hasAuthority("ROLE_Coordinadora"),

  IsEstudiante: () =>
    getUserRole() === "Cliente" || hasAuthority("ROLE_Estudiante"),
};

// Refresca automáticamente la sesión y el menú al volver con botón Atrás (bfcache)
window.addEventListener("pageshow", async () => {
  await renderUsuario();
});*/