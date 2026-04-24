/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,locationId]` on the table `EmployeeBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmployeeBalance_employeeId_locationId_key" ON "EmployeeBalance"("employeeId", "locationId");
