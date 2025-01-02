import {createContext, useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import {useNavigate} from "react-router-dom";
const swal = require('sweetalert2')

const AuthContext = createContext();

export default AuthContext

    export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("accessTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    

    const [user, setUser] = useState(() => 
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
            : null
    );


    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })
        const data = await response.json()
        console.log(data);
        console.log(response.status);
        
        if (response.status === 200) {//OK
            let isAdmin = false; // Default to false for all users

            // Check if the credentials match admin credentials
            if (email === "admin@gmail.com" && password === "admin123") {
                isAdmin = true; // Set isAdmin to true for admin
            }

            // Store the isAdmin flag in local storage
            localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));

            if (isAdmin) {
                navigate("/admin");
                swal.fire({
                    title: "Welcome Admin!",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } else {
                navigate("/auth/home");
                swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        } else {
            console.log("Server issue: ", response.status, data);
            swal.fire({
                title: "There was a server issue",
                icon: "error",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const registerUser = async (email, username, password, password2,phone_number,first_name,last_name,photo) => {
        // Create a new FormData object
        const formData = new FormData();

        // Append each field to the FormData object
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('password2', password2);
        formData.append('phone_number', phone_number);
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);

        // Check if a photo was provided and append it
        if (photo) {
            formData.append('photo', photo); // 'photo' should be a File or Blob object
        }
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            body: formData
        })
        if(response.status === 201){
            navigate("/")
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate("/")
        swal.fire({
            title: "Logged out successful",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    }

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}