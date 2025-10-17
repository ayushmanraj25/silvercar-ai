-- CreateTable
CREATE TABLE "Health" (
    "id" SERIAL NOT NULL,
    "residentName" TEXT NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Health_pkey" PRIMARY KEY ("id")
);
