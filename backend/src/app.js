import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

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
  try {
    const residents = await prisma.resident.findMany();
    res.json(residents);
  } catch (err) {
    console.error("Error fetching residents:", err);
    res.status(500).json({ error: "Failed to fetch residents" });
  }
});

app.post("/residents", async (req, res) => {
  const { name, age, gender, healthInfo, room } = req.body;

  try {
    const newResident = await prisma.resident.create({
      data: {
        name,
        age: parseInt(age, 10),
        gender,
        healthInfo,
        room,
      },
    });
    res.json(newResident);
  } catch (error) {
    console.error("Error adding resident:", error);
    res.status(500).json({ error: "Failed to add resident" });
  }
});

app.put("/residents/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, healthInfo, room } = req.body;

  try {
    const updatedResident = await prisma.resident.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        age: parseInt(age, 10),
        gender,
        healthInfo,
        room,
      },
    });
    res.json(updatedResident);
  } catch (err) {
    console.error("Error updating resident:", err);
    res.status(404).json({ error: "Resident not found or invalid data." });
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
  try {
    const staff = await prisma.staff.findMany();
    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

app.post("/staff", async (req, res) => {
  const { name, role, contact, shift } = req.body;

  const tempId = crypto.randomBytes(8).toString("hex");
  const generatedEmail = `${name
    .toLowerCase()
    .replace(/\s/g, ".")}-temp-${tempId}@silvercare-ai.com`;
  const generatedPassword = tempId;

  try {
    const newStaff = await prisma.staff.create({
      data: {
        name,
        role,
        contact,
        shift,
        email: generatedEmail,
        password: generatedPassword,
      },
    });
    res.json(newStaff);
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({
      error:
        "Failed to add staff member. Check database connection or unique constraints.",
    });
  }
});

app.delete("/staff/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.staff.delete({
      where: { id: parseInt(id, 10) },
    });
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
  try {
    const donations = await prisma.donation.findMany();
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

app.post("/donations", async (req, res) => {
  const { donorName, amount } = req.body;
  try {
    const newDonation = await prisma.donation.create({
      data: { donorName, amount: parseFloat(amount) },
    });
    res.json(newDonation);
  } catch (err) {
    console.error("Error adding donation:", err);
    res.status(500).json({ error: "Failed to add donation" });
  }
});

app.delete("/donations/:id", async (req, res) => {
  try {
    const deleted = await prisma.donation.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.json(deleted);
  } catch (err) {
    console.error("Error deleting donation:", err);
    res.status(500).json({ error: "Failed to delete donation" });
  }
});

/* ==============================
   HEALTH ROUTES
============================== */
app.get("/health", async (req, res) => {
  try {
    const records = await prisma.health.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(records);
  } catch (err) {
    console.error("Error fetching health data:", err);
    res.status(500).json({ error: "Failed to fetch health data" });
  }
});

app.post("/health", async (req, res) => {
  const { residentName, heartRate, bloodPressure, status } = req.body;
  try {
    const newRecord = await prisma.health.create({
      data: {
        residentName,
        heartRate: parseInt(heartRate, 10),
        bloodPressure,
        status,
      },
    });
    res.json(newRecord);
  } catch (err) {
    console.error("Error adding health record:", err);
    res.status(500).json({ error: "Failed to add health record" });
  }
});

// ✅ NEW: Delete health record
app.delete("/health/:id", async (req, res) => {
  try {
    const deleted = await prisma.health.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.json(deleted);
  } catch (err) {
    console.error("Error deleting health record:", err);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

/* ==============================
   DASHBOARD STATS ROUTE ✅
============================== */
app.get("/stats", async (req, res) => {
  try {
    const totalResidents = await prisma.resident.count();
    const totalStaff = await prisma.staff.count();
    const totalDonations = await prisma.donation.aggregate({
      _sum: { amount: true },
    });

    const criticalAlerts = await prisma.health.count({
      where: { status: "Critical" },
    });

    res.json({
      residents: totalResidents,
      staff: totalStaff,
      donations: totalDonations._sum.amount || 0,
      criticalAlerts,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

/* ==============================
   SERVER START
============================== */
const PORT = 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
