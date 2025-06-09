import React, { useState } from "react";
import "../Login.css"
import { Link, useNavigate } from "react-router-dom"; 

const Login = () => {
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        try {
            const response = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    
                    email: email, 
                    password: password
                    
                }),
            });

            if (!response.ok) {
                alert("Wrong password or email");
                throw new Error("Some error occurred");
            }
            localStorage.removeItem("token"); 

            
            const data = await response.json();
            localStorage.setItem("token", data.token);
            
            
            navigate("/");

        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit}> 
                <h2>Login</h2>
                
                

                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />

                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                /> 

            

                <button className="login-button" type="submit">Login</button>
            </form>
            <p>No account? <Link to="/register">Register here</Link></p>
        </div>
    );
};

export default Login;
