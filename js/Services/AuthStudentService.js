const API_AUTH = "https://sgma-66ec41075156.herokuapp.com/api/authEstudiante";

export async function loginStudent(email, password) {
    const response = await fetch(`${API_AUTH}/studentLogin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error((await response.text().catch(() => "")));
    return true;
}

export async function me(){
    const info = await fetch(`${API_AUTH}/authMe`, { 
        credentials: "include"
    });
    return info.ok ? info.json() : { authenticated : false};
}

export async function logoutStudent() {
    try{
        const response = await fetch(`${API_AUTH}/studentLogout`, {
            method: 'POST',
            credentials: "include"
        });
        return response.ok;    
    }catch{
        return false;
    }
}