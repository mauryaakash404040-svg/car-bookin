const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public folder
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// MONGODB SCHEMA
// ===============================

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },

  mobile: {
    type: String,
    required: true,
    trim: true
  },

  car: {
    type: String,
    required: true,
    trim: true
  },

  pickupDate: {
    type: String,
    required: true
  },

  returnDate: {
    type: String,
    required: true
  },

  pickupLocation: {
    type: String,
    required: true,
    trim: true
  },

  message: {
    type: String,
    trim: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Car booking backend is working 🚗"
  });
});

// ===============================
// CREATE BOOKING
// ===============================

app.post("/api/bookings", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      car,
      pickupDate,
      returnDate,
      pickupLocation,
      message
    } = req.body;

    // Required fields check
    if (
      !name ||
      !email ||
      !mobile ||
      !car ||
      !pickupDate ||
      !returnDate ||
      !pickupLocation
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    // Date validation
    if (new Date(returnDate) < new Date(pickupDate)) {
      return res.status(400).json({
        success: false,
        message: "Return date cannot be before pickup date."
      });
    }

    // Save booking
    const booking = await Booking.create({
      name,
      email,
      mobile,
      car,
      pickupDate,
      returnDate,
      pickupLocation,
      message
    });

    console.log("NEW BOOKING:");
    console.log(booking);

    res.status(201).json({
      success: true,
      message: "Car booked successfully 🚗",
      booking
    });

  } catch (error) {

    console.error("Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while saving booking."
    });
  }
});

// ===============================
// GET ALL BOOKINGS
// ===============================

app.get("/api/bookings", async (req, res) => {
  try {

    const bookings = await Booking
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {

    console.error("Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch bookings."
    });
  }
});

// ===============================
// DELETE BOOKING
// ===============================

app.delete("/api/bookings/:id", async (req, res) => {
  try {

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking deleted successfully."
    });

  } catch (error) {

    console.error("Delete Error:", error);

    res.status(500).json({
      success: false,
      message: "Could not delete booking."
    });
  }
});

// ===============================
// ADMIN PAGE
// ===============================

app.get("/admin", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "admin.html")
  );

});

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {

      console.log(
        `Server running: http://localhost:${PORT}`
      );

      console.log(
        `Admin Panel: http://localhost:${PORT}/admin`
      );

    });

  })

  .catch((error) => {

    console.log("MongoDB Connection Error ❌");

    console.log(error.message);

  });