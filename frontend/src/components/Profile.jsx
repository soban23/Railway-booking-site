import "../Profile.css";
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';



const Profile = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    
    
    const [name, setName] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    

    useEffect(() => {
        if(!token){
            console.log(token);
            navigate("/login"); 
            return;
        }else{
            fetchTickets();
            fetchName();
        }
        
    }, []);

    const [refetchTrigger, setRefetchTrigger] = useState(false);
    const [CancelledTickets, setCancelledTickets] = useState(false);
    const [PaidTickets,setPaidTickets] = useState(false);

    useEffect(() => {
        if(CancelledTickets){
            showCancelled();
            setCancelledTickets(false);
        }else if(PaidTickets){
            showPaid();
            setPaidTickets(false);
        }else{
            fetchTickets();
        }
        
    }, [refetchTrigger]); 

    

    const fetchName = async () => {
        
        try {   
            
            const response = await fetch(`http://localhost:4000/api/passenger`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch passenger');
            
            const data = await response.json();
            console.log(data);

            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            setName(data[0].name);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    const fetchTickets = async () => {
        try {
            
            const response = await fetch(`http://localhost:4000/api/tickets`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch tickets');

            const data = await response.json();
            console.log(data);

            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            setTickets(data);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = async(ticket_id)=>{
        
        console.log(ticket_id)
        try {
           
            const response = await fetch(`http://localhost:4000/api/tickets/${ticket_id}/cancel`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`},
                body: JSON.stringify({ 
                    
                    
                    
                }),
            });

            if (!response.ok) {
                throw new Error("Some error occurred");
            }
            

            setRefetchTrigger(prev => !prev);
            

        } catch (error) {
            console.log("Error:", error);
        }
    };
    const handlePayment = async(ticket_id)=>{
        console.log(ticket_id)
        try {
            
            const response = await fetch(`http://localhost:4000/api/payments/${ticket_id}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`},
                body: JSON.stringify({ 
                    
                    
                    
                }),
            });

            if (!response.ok) {
                throw new Error("Some error occurred");
            }
            

            setRefetchTrigger(prev => !prev);
            

        } catch (error) {
            console.log("Error:", error);
        }
        
    };
    const renderActions = (ticket) => {
        
        if (ticket.status == 'booked') {
            return (
                <>
                    <div className="booked">
                    <button className="cancel-button" onClick={()=>handleCancel(ticket.ticket_id)}>Cancel</button>
                    {ticket.payment_status === 'pending' && <button className="pay-button" onClick={()=>handlePayment(ticket.ticket_id)} >Pay</button>}
                    </div>
                </>
            );
        } else {
            return <p className="not-booked">Status: Cancelled</p>;
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login"); 
      };
    const showCancelled = async()=>{
        setLoading(true);
        try {
           
            const response = await fetch(`http://localhost:4000/api/payments/cancelled`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch tickets');

            const data = await response.json();
            console.log(data);

            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            setTickets(data);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }

    }  
    const showPaid = async()=>{
        setLoading(true);
        try {
            
            const response = await fetch(`http://localhost:4000/api/payments/paid`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch tickets');

            const data = await response.json();
            console.log(data);

            if (!Array.isArray(data)) throw new Error('Unexpected response format');
            setTickets(data);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
        
    } 

    const showCancelledTickets= async()=>{
        setCancelledTickets(true);
        setRefetchTrigger(prev => !prev);
        


    }
    const showPaidTickets= async()=>{
        setPaidTickets(true);
        setRefetchTrigger(prev => !prev);
        
    }
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="profile">
            
            <button className="logout-button" onClick={handleLogout}>LOG OUT</button>
            <h6><b>Filters: </b> <button className="show-cancelled" onClick={showCancelledTickets}>cancelled</button> <button className="show-paid" onClick={showPaidTickets}>paid</button></h6>
            <Link to={`/user`}><h3>{name}</h3></Link>
            <h5>TICKETS</h5>
            <div className="ticket-container">
            {tickets.map((ticket) => (
                <div key={ticket.ticket_id} className="ticket-card">
                <p><strong>Ticket id:</strong> {ticket.ticket_id}</p>
                <p><strong>From:</strong> {ticket.source_station}</p>
                <p><strong>To:</strong> {ticket.destination_station}</p>
                {ticket.amount != null && <p><strong>Price:</strong> {ticket.amount} PKR</p>}
                <hr />
                {renderActions(ticket)}
                
            </div>
            ))}
            </div>
        </div>
    );
    
};

export default Profile;
