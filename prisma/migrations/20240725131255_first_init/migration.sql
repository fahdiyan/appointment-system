-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,
    "maxSlotsPerAppointment" INTEGER NOT NULL DEFAULT 1,
    "operationalStartTime" TEXT NOT NULL DEFAULT '09:00',
    "operationalEndTime" TEXT NOT NULL DEFAULT '18:00',
    "daysOff" JSONB,
    "unavailableHours" JSONB,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
