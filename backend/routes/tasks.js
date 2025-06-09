

const express = require("express");
const router = express.Router();
const { get_trains,get_trains_by_id,get_stations,get_stations_by_id,create_passenger, get_passengers,get_passengers_by_id,update_passengers,delete_passenger,
    get_routes,get_routes_namely,get_routes_by_id,get_schedules_by_trainid, book_tickets,ticketid_info,get_passenger_tickets,
    cancel_Ticket, confirm_Payment, get_Payment_Details,
    verifyToken,loginUser,registerUser,get_routes_details,
    get_passenger_cancelled_tickets,get_passenger_paid_tickets
 } = require("../controllers/tasks");


router.post('/login', loginUser);
router.post('/register', registerUser);

router.get("/trains", get_trains);
router.get("/trains/:id", get_trains_by_id);
router.get("/stations", get_stations);
router.get("/stations/:id", get_stations_by_id);
router.get("/passenger/",verifyToken, get_passengers_by_id);
router.put("/passenger/",verifyToken, update_passengers);
router.delete("/passenger/",verifyToken, delete_passenger);
router.get("/routes", get_routes_namely);
router.get("/routes/:id", get_routes_details);
router.get("/schedules/:id", get_schedules_by_trainid);
router.post("/booking",verifyToken, book_tickets);
router.get("/tickets/:id",verifyToken, ticketid_info);
router.get("/tickets/",verifyToken, get_passenger_tickets);
router.patch("/tickets/:ticket_id/cancel",verifyToken, cancel_Ticket);
router.patch("/payments/:ticket_id/confirm",verifyToken, confirm_Payment);
router.get('/payments/paid',verifyToken, get_passenger_paid_tickets);
router.get('/payments/cancelled',verifyToken, get_passenger_cancelled_tickets);




module.exports = router;
