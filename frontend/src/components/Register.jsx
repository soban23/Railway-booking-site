import React, { useState } from "react";
import "../Register.css"
import { Link, useNavigate } from "react-router-dom"; 

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contact, setContact] = useState("");

    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        try {
            const response = await fetch("http://localhost:4000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name: name, 
                    email: email, 
                    password: password, 
                    contact_number: contact 
                }),
            });
            
            if (response.status===409) {
                alert("Email already taken..xD!");
                throw new Error("email already taken");
            }
            if (!response.ok) {
                throw new Error("Some error occurred");
            }
            
            
            
            navigate("/login");

        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <div className="register">
            <form onSubmit={handleSubmit}> 
                <h2>Register</h2>
                
                <label htmlFor="name">Name:</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />

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

                <label htmlFor="contact">Contact Number:</label>
                <input 
                    type="tel" 
                    id="contact" 
                    name="contact" 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} 
                    required 
                />

                <button className="register-button" type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
};

export default Register;
