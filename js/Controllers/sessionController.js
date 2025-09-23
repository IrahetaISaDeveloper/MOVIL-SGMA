import {me, logout} from "../Services/AuthEService.js";

export const auth = {
    ok : false,
    user : null,
};

export async function checkAuth() {
    try{
        const info = await me();
        auth.ok = info?.authenticated;
        auth.user = info?.student ?? null;
    }catch{
        auth.ok = false;
        auth.user = null;
    }
    if(!auth && redirect){
        window.location.href = 'loginEstudiante.html';
    }return auth.ok; //devuelve booleano indicando si hay sesion
}

export function getUserRole(){
    return auth.user?.role || "";
}

export function hasAuthoriry(authority){
    return Array.isArray(auth.user?.authorities)
        ? auth.user.authorities.includes(authority)
        : false;
}

export const role = {
    isAnimador: () => getUserRole() === "ANIMADOR" || hasAuthoriry("ROLE_animador"),

    isCoordinadora: () => getUserRole() === "COORDINADORA" || hasAuthoriry("ROLE_coordinadora"),

    isEstudiante:  () => getUserRole() === "ESTUDIANTE" || hasAuthoriry("ROLE_estudiante"),
}

