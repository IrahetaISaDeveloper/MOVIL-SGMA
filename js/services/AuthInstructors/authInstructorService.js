// URL base para los endpoints de autenticación de instructores
const API_AUTH = "https://sgma-66ec41075156.herokuapp.com/api/instructorsAuth";

// Realiza el inicio de sesión con email y password
export async function loginInstructor({ email, password }) {
  const r = await fetch(`${API_AUTH}/instructorLogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // incluye cookies en la solicitud
    body: JSON.stringify({ email, password }), // credenciales en el cuerpo
  });
  if (!r.ok) throw new Error(await r.text().catch(() => "")); // lanza error si falla
  return true; // devuelve true en caso de éxito
}

// Verifica el estado de autenticación actual
export async function meInstructor() {
  const info = await fetch(`${API_AUTH}/meInstructor`, {
    credentials: "include"
  });

  console.log("Estado de autenticación:", info);

  return info.ok ? info.json() : { authenticated: false };
}

// Cierra la sesión del usuario
export async function logoutInstructor() {
  try {
    const r = await fetch(`${API_AUTH}/logoutInstructor`, {
      method: "POST",
      credentials: "include",
    });
    return r.ok;
  } catch {
    return false;
  }
}
// Si agregas endpoint de logout en el futuro, puedes agregar aquí la lógica correspondiente

