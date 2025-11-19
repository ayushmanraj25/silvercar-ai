import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function importHealthData() {
  const results = [];

  fs.createReadStream("data/health_data.csv")

    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const record of results) {
        await prisma.health.create({
          data: {
            residentName: record.residentName,
            age: parseInt(record.age, 10),
            gender: record.gender,
            heartRate: parseInt(record.heartRate, 10),
            bloodPressure: record.bloodPressure,
            temperature: parseFloat(record.temperature),
            oxygenLevel: parseInt(record.oxygenLevel, 10),
            status: record.status,
          },
        });
      }

      console.log(`✅ Imported ${results.length} health records.`);
      await prisma.$disconnect();
    });
}

importHealthData().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
