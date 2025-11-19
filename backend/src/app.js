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

/* ======================================================
   AI RISK SCORE (0–100)
====================================================== */
function calculateRiskScore(hr, temp, bp_sys, oxygen) {
  hr = Number(hr);
  temp = Number(temp);
  bp_sys = Number(bp_sys);
  oxygen = Number(oxygen);

  if (!hr || !temp || !bp_sys || !oxygen) return 0;

  let score =
    hr * 0.3 +              // HR weight
    temp * 0.4 +            // Temp weight
    (120 / bp_sys) * 15 +   // BP scaling
    (98 / oxygen) * 10;     // Oxygen penalty

  return Math.min(100, Math.round(score));
}

/* ======================================================
   HEALTH STATUS PREDICTION
====================================================== */
function predictHealth({ heartRate, bp_sys, bp_dia, temperature, oxygen }) {
  heartRate = Number(heartRate);
  bp_sys = Number(bp_sys);
  bp_dia = Number(bp_dia);
  temperature = Number(temperature);
  oxygen = Number(oxygen);

  // 🔴 CRITICAL RULES
  if (
    heartRate > 140 ||
    bp_sys > 160 ||
    bp_dia > 100 ||
    temperature > 103 ||
    oxygen < 88
  ) {
    return "Critical";
  }

  // 🟡 WARNING RULES
  if (
    heartRate > 110 ||
    bp_sys > 140 ||
    bp_dia > 90 ||
    temperature > 100.5 ||
    oxygen < 94
  ) {
    return "Warning";
  }

  return "Normal";
}

/* ======================================================
   AUTO ALERT CREATOR
====================================================== */
async function createAlert(record, status) {
  if (!record || status === "Normal") return;

  await prisma.alert.create({
    data: {
      title: status === "Critical" ? "🚨 CRITICAL HEALTH ALERT" : "⚠️ Health Warning",
      description: `${record.residentName}'s health status is ${status}`,
      level: status,
    },
  });
}

/* ======================================================
   BASE ROUTE
====================================================== */
app.get("/", (_, res) =>
  res.send("SilverCare AI Backend Running ✔ Risk Score + AI Prediction Active")
);

/* ======================================================
   GET ALL HEALTH RECORDS
====================================================== */
app.get("/health", async (_, res) => {
  try {
    const records = await prisma.health.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch health records" });
  }
});

/* ======================================================
   ADD NEW HEALTH RECORD
====================================================== */
app.post("/health", async (req, res) => {
  const { residentName, age, gender, heartRate, bloodPressure, temperature, oxygenLevel } = req.body;

  let bp_sys = 0, bp_dia = 0;

  if (bloodPressure?.includes("/")) {
    const [sys, dia] = bloodPressure.split("/");
    bp_sys = Number(sys);
    bp_dia = Number(dia);
  }

  const status = predictHealth({
    heartRate,
    bp_sys,
    bp_dia,
    temperature,
    oxygen: oxygenLevel,
  });

  const riskScore = calculateRiskScore(
    Number(heartRate),
    Number(temperature),
    Number(bp_sys),
    Number(oxygenLevel)
  );

  try {
    const newRecord = await prisma.health.create({
      data: {
        residentName,
        age: Number(age),
        gender,
        heartRate: Number(heartRate),
        bloodPressure,
        temperature: Number(temperature),
        oxygenLevel: Number(oxygenLevel),
        status,
        riskScore,
      },
    });

    await createAlert(newRecord, status);

    res.json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add record" });
  }
});

/* ======================================================
   UPDATE HEALTH RECORD
====================================================== */
app.put("/health/:id", async (req, res) => {
  const { id } = req.params;
  const { residentName, age, gender, heartRate, bloodPressure, temperature, oxygenLevel } = req.body;

  let bp_sys = 0, bp_dia = 0;

  if (bloodPressure?.includes("/")) {
    const [sys, dia] = bloodPressure.split("/");
    bp_sys = Number(sys);
    bp_dia = Number(dia);
  }

  const status = predictHealth({
    heartRate,
    bp_sys,
    bp_dia,
    temperature,
    oxygen: oxygenLevel,
  });

  const riskScore = calculateRiskScore(
    Number(heartRate),
    Number(temperature),
    Number(bp_sys),
    Number(oxygenLevel)
  );

  try {
    const updated = await prisma.health.update({
      where: { id: Number(id) },
      data: {
        residentName,
        age: Number(age),
        gender,
        heartRate: Number(heartRate),
        bloodPressure,
        temperature: Number(temperature),
        oxygenLevel: Number(oxygenLevel),
        status,
        riskScore,
      },
    });

    await createAlert(updated, status);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update record" });
  }
});

/* ======================================================
   DELETE HEALTH RECORD
====================================================== */
app.delete("/health/:id", async (req, res) => {
  try {
    const deleted = await prisma.health.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(deleted);
  } catch {
    res.status(500).json({ error: "Failed to delete record" });
  }
});

/* ======================================================
   OTHER ROUTES (RESIDENTS / STAFF / DONATIONS / ALERTS)
====================================================== */

app.get("/alerts", async (_, res) => {
  res.json(await prisma.alert.findMany({ orderBy: { createdAt: "desc" } }));
});

app.get("/residents", async (_, res) => {
  res.json(await prisma.resident.findMany());
});

app.post("/residents", async (req, res) => {
  res.json(
    await prisma.resident.create({
      data: {
        name: req.body.name,
        age: Number(req.body.age),
        gender: req.body.gender,
        healthInfo: req.body.healthInfo,
        room: req.body.room,
      },
    })
  );
});

app.delete("/residents/:id", async (req, res) => {
  res.json(await prisma.resident.delete({ where: { id: Number(req.params.id) } }));
});

// STAFF
app.get("/staff", async (_, res) => {
  res.json(await prisma.staff.findMany());
});

app.post("/staff", async (req, res) => {
  const pass = crypto.randomBytes(4).toString("hex");
  const email = `${req.body.name.toLowerCase().replace(/\s/g, ".")}-${pass}@silvercare.com`;

  res.json(
    await prisma.staff.create({
      data: { ...req.body, email, password: pass },
    })
  );
});

// DONATIONS
app.get("/donations", async (_, res) => {
  res.json(await prisma.donation.findMany());
});

app.post("/donations", async (req, res) => {
  res.json(
    await prisma.donation.create({
      data: {
        donorName: req.body.donorName,
        amount: Number(req.body.amount),
      },
    })
  );
});

/* ======================================================
   START SERVER
====================================================== */
const PORT = 5001;
app.listen(PORT, () =>
  console.log(`🚀 SilverCare AI Backend running on port ${PORT}`)
);
