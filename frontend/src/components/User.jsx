import "../User.css";
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';



const User = () => {
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
    
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contact, setContact] = useState("");
    const [toggle, setToggle] = useState(true);
    
    useEffect(() => {
        if(!token){
            navigate("/login"); 
        }else{
            fetchUser();
        }
        
    }, []);
    useEffect(() => {
        fetchUser();
    }, [toggle]);

    const fetchUser = async()=>{
        try {
            const response = await fetch(`http://localhost:4000/api/passenger`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if(response.status===401){
                navigate("/login");
            }
            if (!response.ok) throw new Error('Failed to fetch user');

            const data = await response.json();
            console.log(data);

            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            
            setEmail(data[0].email)
            setName(data[0].name)
            setContact(data[0].contact_number)
            
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
      
    const handleSubmit= async(e)=>{
         e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/api/passenger`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    name: name, 
                    email: email, 
                    contact_number: contact 
                })
            });

            if (!response.ok) throw new Error('Failed to update passenger');

            const data = await response.json();
            console.log(data);

            alert("Info updated!");
            setToggle(prev => !prev);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="update-layout">
            <form onSubmit={handleSubmit}> 
                <h2>UPDATE INFO</h2>
                
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

                

                <label htmlFor="contact">Contact Number:</label>
                <input 
                    type="tel" 
                    id="contact" 
                    name="contact" 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} 
                    required 
                />

                <button className="update-button" type="submit">Edit</button>
            </form>
            
            
            
        </div>
    );
};

export default User;
