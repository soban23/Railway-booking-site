
import "../RouteDetails.css";  
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate} from 'react-router-dom';


const RouteDetails = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    
    
    const { id } = useParams();
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [trainclass, setTrainclass] = useState("economy");
    


    
        
      
    const handleChange = (e) => {
          setPaymentMethod(e.target.value);
    };

    const handleChangeClass = (e) => {
        setTrainclass(e.target.value);
    };

    const handleChangetrainid = (e) => {
        setTrainid(e.target.value);
    };

    useEffect(() => {
        if(!token){
            navigate("/login"); 
        }else{
            fetchTrains();    
        }
        
      }, []);

    const fetchTrains = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/routes/${id}`, { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch routes');
            
            const data = await response.json();
            console.log(data);
            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            setTrains(data);
        } catch (error) {
            console.error('Fetch Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading...</p>;
    
    if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
   
    const formatTime = (timeStr) => {
        const date = new Date(timeStr);
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false, 
        });
      };
    
      const handleSubmit = async (trainid) => {
        
        
        try {
            const response = await fetch("http://localhost:4000/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`},
                body: JSON.stringify({ 
                    train_id: trainid, 
                    route_id: id, 
                    class_name: trainclass, 
                    payment_method: paymentMethod 
                }),
            });
            if(response.status===401){
                navigate("/login");
            }
            if (!response.ok) {
                throw new Error("Some error occurred");
            }
            
            
            
            navigate("/profile");

        } catch (error) {
            console.log("Error:", error);
        }
    };
    
        
   

    

      
    return (
        <div className="route-details-layout">
            <p>ROUTE DETAILS</p>

            
            <div className="routesx">
                <div className="routesxx">
                    
                    {trains.map((train) => (

                        <div key={train.train_id} >
                            <Link key={train.train_id} to={`/trains/${train.train_id}/${train.source_station_id}`} >
                                <h5>{train.train_name}</h5>
                            </Link>
                            <div className="trains" >
                            <p>arrival: {formatTime(train.arrival_time)} - departure: {formatTime(train.departure_time)}
                                
                            </p>

                            </div>
                            

                            <div className="class-selection">
                                <h3>Select Class:</h3>

                                <label>
                                    <input
                                    type="radio"
                                    value="economy"
                                    checked={trainclass === "economy"}
                                    onChange={handleChangeClass}
                                    />
                                    Economy
                                </label>

                                <label>
                                    <input
                                    type="radio"
                                    value="first"
                                    checked={trainclass === "first"}
                                    onChange={handleChangeClass}
                                    />
                                    First
                                </label>

                            </div>
                            <div className="payment">
                                <h3>Select Payment Method:</h3>

                                <label>
                                    <input
                                    type="radio"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={handleChange}
                                    />
                                    Cash
                                </label>

                                <label>
                                    <input
                                    type="radio"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={handleChange}
                                    />
                                    Card
                                </label>

                            </div>
                            
                            <button className="book-button" onClick={() => handleSubmit(train.train_id)}>BOOK</button>

                        </div>
                        
                        
                    ))}

                    

                </div>
            </div>
        </div>
    );
};

export default RouteDetails;
