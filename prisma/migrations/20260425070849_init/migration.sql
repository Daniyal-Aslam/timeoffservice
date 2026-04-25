/*
  Warnings:

  - The primary key for the `EmployeeBalance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EmployeeBalance` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmployeeBalance" (
    "employeeId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "balance" REAL NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("employeeId", "locationId")
);
INSERT INTO "new_EmployeeBalance" ("balance", "employeeId", "lastSyncedAt", "locationId", "version") SELECT "balance", "employeeId", "lastSyncedAt", "locationId", "version" FROM "EmployeeBalance";
DROP TABLE "EmployeeBalance";
ALTER TABLE "new_EmployeeBalance" RENAME TO "EmployeeBalance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
