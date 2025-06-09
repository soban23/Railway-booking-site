
import "../Home.css";  
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';



const Home = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(!token){
            navigate("/login"); 
        }else{
            fetchRoutes();
        }
        
      }, []);

    const fetchRoutes = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/routes', { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch routes');
           
            const data = await response.json();
            console.log(data);
            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            setRoutes(data);
        } catch (error) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }
    const rerouteProfile= async()=>{
        navigate("/profile");
    }
    const rerouteUser= async()=>{
        navigate("/user");
    }
    const handleLogout= async()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
    return (
        
        <div className="home">
            <div className="title">
                <h5><b>T</b>ravel <b>I</b>n <b>T</b>otal <b>S</b>peed</h5>
            </div>
            <nav>
                <button className="cart" onClick={rerouteProfile} >CART</button>
                <button className="user-profile" onClick={rerouteUser}>PROFILE</button>
                <button className="log-out" onClick={handleLogout}>LOG OUT</button>
            </nav>
            
            <hr></hr>
            <p>ROUTES</p>

            
            <div className="routes-layout">
                
                <div className="routes">
                    {routes.map((route) => (
                        <Link key={route.route_id} to={`/routes/${route.route_id}`} >
                            <div className="route-info" key={route.route_id}>
                            <p>
                                {route.source} <span>→</span> {route.destination}
                            </p>

                            <br />
                            </div>
                        </Link>
                    ))}

                    

                    
                </div>
            </div>
        </div>
    );
};

export default Home;
