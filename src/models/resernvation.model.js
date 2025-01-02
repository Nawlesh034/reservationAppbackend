import mongoose, { Schema } from "mongoose";



const reservationSchema = new Schema({

    date: {
        type: String,
        required: true

    },
    time: { 
        type: String, 
        required: true 
    },
    guests: {
        type: Number, 
        required: true 

    },
    name: { 
        type: String,
        required: true 

    },
    contact: { 
         type: String,
         required: true 
        },
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true
    }
},{
    timestamps:true
})

export const ReservationSchema = mongoose.model("Reservation", reservationSchema)