
const express = require("express");
const sql = require("msnodesqlv8");
const connectionString = require("../config/connectdb");
const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

// Login User Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.status(400).send("info not complete");
  }

  try {
    const query = `SELECT * FROM passengers WHERE email = '${email}'`;
    sql.query(connectionString, query, async (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(400).send("User not found");
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // jwt
        const token = jwt.sign(
          { passenger_id: user.passenger_id },  // Payload
          secretKey,  // secretkey
          { expiresIn: '1h' }  // expirytime
        );

        return res.status(200).json({ message: 'Login successful', token });
      } else {
        return res.status(400).send("Invalid password");
      }
    });
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
};



// Register User Controller
const registerUser = async (req, res) => {
  const { name, email, password, contact_number } = req.body;

  if(!email || !password || !name || !contact_number){
    return res.status(400).send("info not complete");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const check_email_query =  `
    SELECT *
    FROM passengers
    WHERE email = '${email}';
  `;

  sql.query(connectionString, check_email_query, (err, result) => {
    if (err) {
      console.log("gae");
      return res.status(500).send("Error: " + err.message);
    }
      if(result[0]){
        console.log("user exists");
        return res.status(409).send("User exists");
      }
      

    const query = `
      INSERT INTO passengers (name, email, password, contact_number)
      VALUES ('${name}', '${email}', '${hashedPassword}', '${contact_number}')
    `;

    sql.query(connectionString, query, (err, result) => {
      if (err) {
        return res.status(500).send("Error: " + err.message);
      }

      return res.status(201).send("User registered successfully");
    });
    });
  

    
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  
  if (!token) {
    return res.status(403).send('No token provided');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    
    req.passenger_id = decoded.passenger_id;

    console.log(req.passenger_id);

    
    
    next();  
  });
};


//trains
const get_trains = (req, res) => {
    const query = "select * from trains";
    try {
      sql.query(connectionString, query, (err, rows) => {
        if (err) {
          return res.status(500).send("Error: " + err); 
        } else {
          return res.json(rows);
        }
      });    
    } catch (error) {
      console.error("Error:", err);
      return res.status(500).send("Error: " + err.message);
    }
  };

  const get_trains_by_id = (req, res) => {
    const { id } = req.params;
    
    const query = `select * from trains where train_id = ${id}`;
    
    
    try {
      sql.query(connectionString, query, (err, rows) => {
        if (err) {
          return res.status(500).send("Error: " + err); 
        } else {
          return res.json(rows);
        }
      });    
    } catch (error) {
      console.error("Error:", err);
      return res.status(500).send("Error: " + err.message);
    }
  };
//stations
  const get_stations = (req, res) => {
    const query = "select * from stations";
    try {
      sql.query(connectionString, query, (err, rows) => {
        if (err) {
          return res.status(500).send("Error: " + err); 
        } else {
          return res.json(rows);
        }
      });    
    } catch (error) {
      console.error("Error:", err);
      return res.status(500).send("Error: " + err.message);
    }
  };

  const get_stations_by_id = (req, res) => {
    const { id } = req.params;
    
    const query = `select * from stations where station_id = ${id}`;
    
    
    try {
      sql.query(connectionString, query, (err, rows) => {
        if (err) {
          return res.status(500).send("Error: " + err); 
        } else {
          return res.json(rows);
        }
      });    
    } catch (error) {
      console.error("Error:", err);
      return res.status(500).send("Error: " + err.message);
    }
  };

//users

//not using after adding jwt
const create_passenger = async (req, res) => {
  const { name, email, contact_number} = req.body;
  const status = 'active';

  if (!name || !contact_number || !email) {
    return res.status(400).send("All fields are required.");
  }
  
  
  

  const query = `insert into passengers (name, email, contact_number,status)
                 values ('${name}', '${email}', '${contact_number}', '${status}')`;

  try {
    sql.query(connectionString, query, (err, result) => {
      if (err) {
        console.error("Error creating user:", err);
        return res.status(500).send("Error creating passenger: " + err.message);
      }
      return res.status(201).send("Passenger created successfully.");
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

const get_passengers = (req, res) => {
  const query = "select * from passengers";
  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err); 
      } else {
        return res.json(rows);
      }
    });    
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

const get_passengers_by_id = (req, res) => {
  
  const id  = req.passenger_id;
  console.log(req.passenger_id);
  console.log(id);
  
  const query = `select * from passengers where passenger_id = ${id}`;
  
  
  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err); 
      } else {
        return res.json(rows);
      }
    });    
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};
const update_passengers = async (req, res) => {
  
  const id = req.passenger_id;

  const { name, email, contact_number } = req.body;

  if (!name || !contact_number || !email) {
    return res.status(400).send("All fields are required.");
  }
  //email unique validation 
  const query = `update passengers 
                 set name = '${name}', email = '${email}', contact_number = '${contact_number}' 
                 where passenger_id = ${id}`;

  try {
    sql.query(connectionString, query, (err, result) => {
      if (err) {
        console.error("Error updating passenger:", err);
        return res.status(500).send("Error updating passenger: " + err.message);
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).send("passenger not found.");
      }
      
     
      return res.status(200).json({ message: "passenger updated successfully." });
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

const delete_passenger = async (req, res) => {
  
  const id = req.passenger_id;

  const query = `delete from passengers where passenger_id = ${id}`;

  try {
    sql.query(connectionString, query, (err, result) => {
      if (err) {
        console.error("Error deleting passenger:", err);
        return res.status(500).send("Error deleting passenger: " + err.message);
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).send("passenger not found.");
      }

      return res.status(200).send("passenger deleted successfully.");
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};
//schedules/routes
const get_routes = (req, res) => {
  const query = "select * from train_routes";
  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err); 
      } else {
        return res.json(rows);
      }
    });    
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

const get_routes_namely = (req, res) => {
 
  const query = `select tr.route_id,t.train_name,s1.station_name as source,s2.station_name as destination,s1.station_id as source_id, s2.station_id as destination_id
                 from train_routes tr 
                 join trains t on tr.train_id=t.train_id
                 join stations s1 on tr.source_station_id=s1.station_id
                 join stations s2 on tr.destination_station_id=s2.station_id`
  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err); 
      } else {
        return res.json(rows);
      }
    });    
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};
const get_routes_by_id = (req, res) => {
  const { id } = req.params;
  
  const query = `select * from train_routes where route_id = ${id}`;
  
  
  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err); 
      } else {
        return res.json(rows);
      }
    });    
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

const get_routes_details = (req, res) => {
  const { id } = req.params;
  
  const query = `
    select *
    from train_routes tr 
    join train_schedules ts on tr.train_id = ts.train_id
    join trains t on  tr.train_id=t.train_id 
    where tr.route_id=${id} and station_id=destination_station_id
  
  
  
  `;
  
  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err); 
      } else {
        return res.json(rows);
      }
    });    
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};
const get_schedules_by_trainid = (req, res) => {
  const { id } = req.params;
  
  const query = `select * from train_schedules where train_id = ${id}`;
  
  
  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err); 
      } else {
        return res.json(rows);
      }
    });    
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

const book_tickets = async (req, res) => {
    const { train_id, class_name, payment_method, route_id } = req.body;
    const passenger_id= req.passenger_id;

    if (!passenger_id || !train_id || !class_name || !payment_method || !route_id) {
        return res.status(400).json({ error: "All fields are required." });
    }

    let class_type;
    if (class_name === 'first') {
        class_type = 'fc_capacity';
    } else if (class_name === 'economy') {
        class_type = 'economy_capacity';
    } else {
        return res.status(400).json({ error: "Invalid class type." });
    }

    const status = 'booked';

    try {
        sql.query(connectionString, `SELECT ${class_type} AS available_seats FROM trains WHERE train_id = ${train_id}`, (err, seatRows) => {
            if (err) {
                console.error("SQL Error:", err);
                return res.status(500).json({ error: "Database query failed." });
            }

            if (!seatRows || seatRows.length === 0 || seatRows[0].available_seats <= 0) {
                return res.status(400).json({ error: "No seats available." });
            }

            console.log("Available Seats:", seatRows[0].available_seats);

            sql.query(connectionString, `SELECT fixed_price FROM ticket_pricing WHERE route_id = ${route_id} AND class = '${class_name}'`, (err, priceRows) => {
                if (err || !priceRows || priceRows.length === 0) {
                    console.error("Price Fetch Error:", err);
                    return res.status(500).json({ error: "Failed to fetch ticket price." });
                }

                const ticketPrice = priceRows[0].fixed_price;
                console.log("Ticket Price:", ticketPrice);

                // Insert ticket n get new ticket ID
                const insertTicketQuery = `
                    INSERT INTO tickets (passenger_id, train_id, status, route_id, class) 
                    OUTPUT INSERTED.ticket_id
                    VALUES (${passenger_id}, ${train_id}, '${status}', '${route_id}', '${class_name}');
                `;

                sql.query(connectionString, insertTicketQuery, (err, ticketRows) => {
                    if (err || !ticketRows || ticketRows.length === 0) {
                        console.error("Ticket Insert Error:", err);
                        return res.status(500).json({ error: "Failed to insert ticket." });
                    }

                    const ticket_id = ticketRows[0].ticket_id;
                    console.log("New Ticket ID:", ticket_id);

                    // Reduce train capacity
                    sql.query(connectionString, `UPDATE trains SET ${class_type} = ${class_type} - 1 WHERE train_id = ${train_id}`, (err) => {
                        if (err) {
                            console.error("Capacity Update Error:", err);
                            return res.status(500).json({ error: "Failed to update train capacity." });
                        }

                        // Insert payment
                        const insertPaymentQuery = `
                            INSERT INTO payments (ticket_id, amount, payment_method, payment_status) 
                            VALUES (${ticket_id}, ${ticketPrice}, '${payment_method}', 'pending')
                        `;

                        sql.query(connectionString, insertPaymentQuery, (err) => {
                            if (err) {
                                console.error("Payment Insert Error:", err);
                                return res.status(500).json({ error: "Failed to insert payment." });
                            }

                            console.log("Payment inserted successfully!");
                            return res.status(201).json({ message: "Ticket booked successfully!", ticket_id });
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.error("Unexpected Error:", err);
        return res.status(500).json({ error: "Unexpected server error." });
    }
};


const ticketid_info = (req, res) => {
  const { id } = req.params;
  const passenger_id = req.passenger_id;
  
  const query = `
    SELECT 
      t.ticket_id,
      t.class,
      t.status,
      p.name AS passenger_name,
      tr.train_name,
      t.route_id,  
      s1.station_name AS source_station,
      s2.station_name AS destination_station,
      pay.amount,
      pay.payment_status
    FROM tickets t
    JOIN passengers p ON t.passenger_id = p.passenger_id
    JOIN trains tr ON t.train_id = tr.train_id
    JOIN train_routes r ON t.route_id = r.route_id  
    JOIN stations s1 ON r.source_station_id = s1.station_id
    JOIN stations s2 ON r.destination_station_id = s2.station_id
    LEFT JOIN payments pay ON t.ticket_id = pay.ticket_id
    WHERE t.ticket_id = ${id} and t.passenger_id = ${passenger_id};
  `;
  
  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err); 
      } else {
        return res.json(rows);
      }
    });    
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};



const get_passenger_tickets = (req, res) => {
 
  const passenger_id = req.passenger_id;
 

  const query = `
    SELECT 
      t.ticket_id,
      tr.train_name,
      t.route_id,
      t.class,
      t.status,
      s1.station_name AS source_station,
      s2.station_name AS destination_station,
      pay.payment_status,
      pay.amount
    FROM tickets t
    JOIN trains tr ON t.train_id = tr.train_id
    JOIN train_routes r ON t.route_id = r.route_id
    JOIN stations s1 ON r.source_station_id = s1.station_id
    JOIN stations s2 ON r.destination_station_id = s2.station_id
   
    LEFT JOIN payments pay ON t.ticket_id = pay.ticket_id
    WHERE t.passenger_id = ${passenger_id};
  `;

  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err);
      } else {
        if (rows.length === 0) {
          return res.status(404).send("No tickets found for this passenger.");
        }
        return res.json(rows);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Error: " + error.message);
  }
};


const cancel_Ticket = (req, res) => {
  const { ticket_id } = req.params;
  const passenger_id = req.passenger_id;

  if (!ticket_id) {
      return res.status(400).send("Ticket ID is required.");
  }

  // Get ticket info (to restore seat)
  const getTicketQuery = `SELECT train_id, class, status FROM tickets WHERE ticket_id = ${ticket_id} and passenger_id = ${passenger_id}`;
  sql.query(connectionString, getTicketQuery, (err, ticketResult) => {
      if (err) return res.status(500).send("Error fetching ticket: " + err);
      if (!ticketResult || ticketResult.length === 0) return res.status(404).send("Ticket not found.");

    

      const { train_id, class: className ,status} = ticketResult[0];
      console.log(ticketResult);
      console.log(ticketResult[0]);
      if(status==='cancelled'){
        console.log("already cancelled");
        return res.status(200).send("Ticket already cancelled.");
      }
     
      let classType;
        if (className === 'first') {
            classType = 'fc_capacity';
        } else if (className === 'economy') {
            classType = 'economy_capacity';
        } else {
            return res.status(400).send("Invalid class type.");
        }


      //  Delete payment record first
      const deletePaymentQuery = `DELETE FROM payments WHERE ticket_id = ${ticket_id}`;
      sql.query(connectionString, deletePaymentQuery, (err) => {
          if (err) return res.status(500).send("Error deleting payment: " + err);

          //  Update ticket status to 'cancelled'
          const updateTicketQuery = `UPDATE tickets SET status = 'cancelled' WHERE ticket_id = ${ticket_id}`;
          sql.query(connectionString, updateTicketQuery, (err) => {
              if (err) return res.status(500).send("Error updating ticket: " + err);

              //  Restore seat availability in the train
              const updateTrainQuery = `UPDATE trains SET ${classType} = ${classType} + 1 WHERE train_id = ${train_id}`;
              sql.query(connectionString, updateTrainQuery, (err) => {
                  if (err) return res.status(500).send("Error updating train capacity: " + err);

                  return res.status(200).send("Ticket cancelled successfully.");
              });
          });
      });
  });
};


const confirm_Payment = (req, res) => {
  const passenger_id = req.passenger_id;
  const { ticket_id } = req.params;

  if (!ticket_id) {
      return res.status(400).send("Ticket ID is required.");
  }

  //  Check if payment exists for the ticket
  const checkPaymentQuery = `SELECT * FROM payments WHERE ticket_id = ${ticket_id}`;
  sql.query(connectionString, checkPaymentQuery, (err, paymentResult) => {
      if (err) return res.status(500).send("Error fetching payment: " + err);
      if (!paymentResult.length) return res.status(404).send("No payment record found for this ticket.");
      
      const { payment_status} = paymentResult[0];
    
      if(payment_status!='pending'){
        console.log("already paid");
        return res.status(200).send("Ticket already paid or cancelled.");
      }
      // Update payment status to "completed"
      const updatePaymentQuery = `UPDATE payments SET payment_status = 'completed' WHERE ticket_id = ${ticket_id}`;
      sql.query(connectionString, updatePaymentQuery, (err) => {
          if (err) return res.status(500).send("Error updating payment status: " + err);

          return res.status(200).send("Payment confirmed successfully.");
      });
  });
};

const get_Payment_Details = (req, res) => {
  const { payment_id } = req.params;
  const passenger_id = req.passenger_id;

  const query = `
      SELECT 
          p.payment_id, 
          p.ticket_id, 
          p.amount, 
          p.payment_method, 
          p.payment_status, 
          t.passenger_id, 
          t.train_id, 
          tr.train_name, 
          r.route_id, 
          s1.station_name AS source_station, 
          s2.station_name AS destination_station
      FROM payments p
      JOIN tickets t ON p.ticket_id = t.ticket_id
      JOIN trains tr ON t.train_id = tr.train_id
      JOIN train_routes r ON t.route_id = r.route_id
      JOIN stations s1 ON r.source_station_id = s1.station_id
      JOIN stations s2 ON r.destination_station_id = s2.station_id
      WHERE p.payment_id = ${payment_id} and t.passenger_id = ${passenger_id};
  `;

  sql.query(connectionString, query, (err, result) => {
      if (err) {
          return res.status(500).json({ error: "Error fetching payment details" });
      }
      if (result.length === 0) {
          return res.status(404).json({ message: "Payment details not found" });
      }
      res.json(result);
  });
};


const get_passenger_paid_tickets = (req, res) => {
  
  const passenger_id = req.passenger_id;
  

  const query = `
    SELECT 
      t.ticket_id,
      tr.train_name,
      t.route_id,
      t.class,
      t.status,
      s1.station_name AS source_station,
      s2.station_name AS destination_station,
      pay.payment_status,
      pay.amount
    FROM tickets t
    JOIN trains tr ON t.train_id = tr.train_id
    JOIN train_routes r ON t.route_id = r.route_id
    JOIN stations s1 ON r.source_station_id = s1.station_id
    JOIN stations s2 ON r.destination_station_id = s2.station_id
   
    LEFT JOIN payments pay ON t.ticket_id = pay.ticket_id
    WHERE t.passenger_id = ${passenger_id} and pay.payment_status='completed';
  `;

  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err);
      } else {
        
        return res.json(rows);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Error: " + error.message);
  }
};


const get_passenger_cancelled_tickets = (req, res) => {
  
  const passenger_id = req.passenger_id;
  

  const query = `
    SELECT 
      t.ticket_id,
      tr.train_name,
      t.route_id,
      t.class,
      t.status,
      s1.station_name AS source_station,
      s2.station_name AS destination_station,
      pay.payment_status,
      pay.amount
    FROM tickets t
    JOIN trains tr ON t.train_id = tr.train_id
    JOIN train_routes r ON t.route_id = r.route_id
    JOIN stations s1 ON r.source_station_id = s1.station_id
    JOIN stations s2 ON r.destination_station_id = s2.station_id
   
    LEFT JOIN payments pay ON t.ticket_id = pay.ticket_id
    WHERE t.passenger_id = ${passenger_id} and t.status = 'cancelled';
  `;

  try {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        return res.status(500).send("Error: " + err);
      } else {
        
        return res.json(rows);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Error: " + error.message);
  }
};





module.exports = {get_trains,get_trains_by_id,get_stations,get_stations_by_id,create_passenger,get_passengers,get_passengers_by_id,update_passengers,delete_passenger,
  get_routes,get_routes_namely,get_routes_by_id,get_schedules_by_trainid, book_tickets,ticketid_info, get_passenger_tickets, cancel_Ticket,
  confirm_Payment,get_Payment_Details,verifyToken,loginUser,registerUser,
  get_routes_details, get_passenger_cancelled_tickets, get_passenger_paid_tickets
};