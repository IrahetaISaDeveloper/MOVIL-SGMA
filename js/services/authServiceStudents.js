const API_AUTH = "https://sgma-66ec41075156.herokuapp.com/api/studentsAuth";

// Realiza el inicio de sesión con correo y contraseña
export async function login({ email, password }) {
  const r = await fetch(`${API_AUTH}/studentLogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // indica que se envía JSON
    credentials: "include", // incluye cookies en la solicitud
    body: JSON.stringify({ email, password }), // credenciales en el cuerpo
  });
  if (!r.ok) throw new Error(await r.text().catch(() => "")); // lanza error si falla
  return true; // devuelve true en caso de éxito
}

// Verifica el estado de autenticación actual
export async function me() {
  const info = await fetch(`${API_AUTH}/meStudent`, {
    credentials: "include"
  });
  return info.ok ? info.json() : { authenticated: false }; // devuelve info del usuario o false
}

// Cierra la sesión del usuario
export async function logout() {
  try {
    const r = await fetch(`${API_AUTH}/logoutStudent`, {
      method: "POST",
      credentials: "include", // necesario para que el backend identifique la sesión
    });
    return r.ok; // true si el logout fue exitoso
  } catch {
    return false; // false en caso de error de red u otro fallo
  }
}