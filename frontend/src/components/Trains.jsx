
import "../Trains.css";  
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Trains = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    
    const [trains, setTrains] = useState([]);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { train_id, station_id } = useParams();
    console.log("train",train_id);
    console.log("station",station_id);
    useEffect(() => {
        if(!token){
            navigate("/login"); 
        }else{
            fetchTrain();
            setLoading(loading => !loading);
            fetchStation();
        }
        
      }, []);

    const fetchTrain = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/trains/${train_id}`, { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch train');
            
            const data = await response.json();
            console.log(data);
            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            setTrains(data);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchStation = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/stations/${station_id}`, { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch train');
           
            const data = await response.json();
            console.log(data);
            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            setStations(data);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
    return (
        <div className="train">
            

            
            <div className="train-layout">
                
                <div className="train-inner">
                    {trains.map((train) => (
                        <div key={train.train_id} >
                            
                            <p><strong>Train Name:</strong> <span>{train.train_name}</span></p>
                            <p><strong>First Class Capacity:</strong> <span>{train.fc_capacity}</span></p>
                            <p><strong>Economy Capacity:</strong> <span>{train.economy_capacity}</span></p>
                        
                            <br />
                            
                        </div>
                    ))}
                    {stations.map((station) => (
                        <div key={station.station_id} >
                            
                            <p><strong>Station Name:</strong> <span>{station.station_name}</span></p>
                            <p><strong>Platform Count:</strong> <span>{station.platform_count}</span></p>
                            <p><strong>Contact Info:</strong> <span>{station.contact_info}</span></p>
                             <br />
                            
                        </div>
                    ))}

                    

                    
                </div>
            </div>
        </div>
    );
};

export default Trains;
