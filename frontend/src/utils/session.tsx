interface UserData{
    username: string;
}

interface SessionData{
    sessionId: string;
}

export const createSession=async(userData: UserData): Promise<SessionData> => {
    try{
        const response=await fetch("/api/Session/create",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify(userData)
        });

        console.log(JSON.stringify(userData));

        if(!response.ok){
            throw new Error(`Error: ${response.statusText}`);
        }

        const data: SessionData=await response.json();
        return data;
    }catch(error){
        console.error('Error creating session: ',error);
        throw error;
    }
}

export const getSession=async() => {
    try{
        const response=await fetch("/api/Session/get",{
            method: "GET",
            credentials: "include"
        });

        if(!response.ok){
            throw new Error(`Error: ${response.statusText}`);
        }

        const data=await response.json();
        return data;
    }catch(error){
        console.error('Error retrieving session: ',error);
        throw error;
    }
}

export const logout=async() => {
    try{
        const response=await fetch("/api/Session/logout",{
            method: "POST",
            credentials: "include"
        });

        if(!response.ok){
            throw new Error(`Error: ${response.statusText}`);
        }

        const message=await response.text();
        return message;
    }catch(error){
        console.error('Error logging out: ',error);
        throw error;
    }
}