import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto"; // For generating temporary staff credentials

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => res.send("SilverCare API running..."));

/* ==============================
   RESIDENT ROUTES
============================== */
app.get("/residents", async (req, res) => {
  const residents = await prisma.resident.findMany();
  res.json(residents);
});

app.post("/residents", async (req, res) => {
  const { name, age, gender, healthInfo, room } = req.body;
  const newResident = await prisma.resident.create({
    data: {
      name,
      age: parseInt(age),
      gender,
      healthInfo,
      room,
    },
  });
  res.json(newResident);
});

// ✅ ADDED: PUT route for updating resident records (Fixes Edit Modal Save)
app.put("/residents/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, healthInfo, room } = req.body;
  
  try {
    const updatedResident = await prisma.resident.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        // Ensure age is parsed as an integer for the database
        age: parseInt(age, 10), 
        gender,
        healthInfo,
        room,
      },
    });
    res.json(updatedResident);
  } catch (err) {
    console.error("Error updating resident:", err);
    // Return 404 if the record doesn't exist, otherwise 500
    res.status(404).json({ error: "Failed to update resident. Record not found or invalid data." });
  }
});

app.delete("/residents/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.resident.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(deleted);
  } catch (err) {
    console.error("Error deleting resident:", err);
    res.status(500).json({ error: "Failed to delete resident" });
  }
});


/* ==============================
   STAFF ROUTES
============================== */
app.get("/staff", async (req, res) => {
  const staff = await prisma.staff.findMany();
  res.json(staff);
});

app.post("/staff", async (req, res) => {
  const { name, role, contact, shift } = req.body;
  
  // Generating placeholder values for required fields not in frontend form
  const tempId = crypto.randomBytes(8).toString('hex');
  const generatedEmail = `${name.toLowerCase().replace(/\s/g, '.')}-temp-${tempId}@silvercare-ai.com`;
  const generatedPassword = tempId;

  try {
    const newStaff = await prisma.staff.create({
      data: { 
        name, 
        role, 
        contact,
        shift,
        email: generatedEmail, 
        password: generatedPassword 
      },
    });
    res.json(newStaff);
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({ error: "Failed to add staff member. Check database connection or unique constraints (e.g., email)." });
  }
});

app.delete("/staff/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.staff.delete({ where: { id: parseInt(id, 10) } });
    res.json(deleted);
  } catch (err) {
    console.error("Error deleting staff:", err);
    res.status(500).json({ error: "Failed to delete staff member" });
  }
});


/* ==============================
   DONATION ROUTES
============================== */
app.get("/donations", async (req, res) => {
  const donations = await prisma.donation.findMany();
  res.json(donations);
  
});

app.post("/donations", async (req, res) => {
  const { donorName, amount } = req.body;
  const newDonation = await prisma.donation.create({
    data: { donorName, amount: parseFloat(amount) },
  });
  res.json(newDonation);
});

app.delete("/donations/:id", async (req, res) => {
  const deleted = await prisma.donation.delete({ where: { id: parseInt(req.params.id, 10) } });
  res.json(deleted);
});


const PORT = 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));