import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Notification from "../components/Notification";
import { url } from "../utils/Constants";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [username, setUsername] = useState("");
    const [islogin, setIslogin] = useState(false);
    const navigate = useNavigate();
       
    useEffect(() => {
        const token = localStorage.getItem('token');
        const verifyToken = async () => {
            try {
                const response = await axios.post(`${url}/api/users/validate-token`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (response.status === 200) {
                    const json = response.data;
                } else {
                    Notification.showErrorMessage("Sorry", "Session has Expired!");
                    localStorage.clear();
                    navigate("/login");
                }
            } catch (error) {
                Notification.showErrorMessage("Error", error?.response?.data?.message || "Something Wrong, Please Login First!");
                localStorage.clear();
                navigate("/login");
            }
        };
        if (token) {
            verifyToken();
        }
    }, []);

    return (
        <UserContext.Provider value={{
            username,
            setUsername,
            islogin,
            setIslogin,
        }}>
            {children}
        </UserContext.Provider>
    );
}
