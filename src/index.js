// Import required modules
import express from "express";

import cors from "cors";

import dotenv from "dotenv";
import connectDb from "./db/db.js";
import { ReservationSchema } from "./models/resernvation.model.js";

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
// Initialize Express app first
const PORT = process.env.PORT || 5000;

// Configure middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true
}));

// Database connection and server startup
const startServer = async () => {
    try {
        await connectDb();
        console.log("Database connected successfully");
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.log("Database connection failed:", err);
        process.exit(1);
    }
};

startServer();

// Routes
app.get("/", (req, res) => {
    res.json("Server is running successfully");
});

// Create a new reservation
app.post("/api/reservations", async (req, res) => {
   

  const { date, time, guests, name, contact,email } = req.body;
  console.log(date,time,guests,email,name,contact)

  if (!date || !time || !guests || !name || !contact ||!email) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  try {
     const existingReservation = await ReservationSchema.findOne({date,time})

     if(existingReservation){
        return res.status(400).json({error:"Time slot is already booked"})
     }

    const newReservation = new ReservationSchema({ date, time, guests, name, contact ,email});
    await newReservation.save();
    res.status(201).json(newReservation,  );
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

// Get all reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await ReservationSchema.find();
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

// Delete a reservation by ID
app.delete("/api/reservations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await ReservationSchema.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});


