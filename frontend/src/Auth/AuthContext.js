import { createContext, useContext, useEffect, useState } from "react"
import decodeToken from "./User";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);


export const AuthProvider = ({children}) => {
    const [ user, setUser ] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {

            const decodedUser = decodeToken(token);
            setUser(decodedUser);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedUser = decodeToken(token);
        setUser(decodedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
          
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
          
    )

}