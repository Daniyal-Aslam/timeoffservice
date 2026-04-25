Time-Off Service (Backend)

A NestJS-based microservice for managing employee time-off requests with external HCM integration.

⸻

Features

* Create time-off requests
* Validate leave balance via HCM
* Sync employee balances
* Swagger API documentation
* Fault-tolerant external integration

⸻

Tech Stack

* NestJS
* Prisma ORM
* SQLite (development)
* Axios
* Swagger

⸻

COMPLETE SETUP GUIDE

Follow these steps to run the backend locally.

⸻

Clone Repository

git clone https://github.com/Daniyal-Aslam/timeoffservice.git
cd timeoffservice

⸻

Install Dependencies

npm install

⸻

Setup Environment Variables

Create a .env file in the root directory:

PORT=3000
DATABASE_URL="file:./dev.db"
HCM_BASE_URL=http://localhost:4000

⸻

Setup Database (Prisma)

Generate Prisma client:

npx prisma generate

Run migrations:

npx prisma migrate dev --name init

(Optional) Open database UI:

npx prisma studio

⸻

Start Mock HCM Server (Required)

Open a new terminal and run:

npx ts-node mock-hcm/server.ts

You should see:

Mock HCM running on http://localhost:4000

⸻

Start Backend Server

npm run start:dev

You should see:

Nest application successfully started

⸻

Open Swagger UI

Open in your browser:

http://localhost:3000/api

⸻

Test the System

Use Swagger UI to test the following endpoints:

GET /balances

Retrieve employee balance

Example:

* employeeId: emp1
* locationId: loc1

⸻

POST /requests

Create a time-off request

Example body:

{
  "employeeId": "emp1",
  "locationId": "loc1",
  "daysRequested": 2
}

Expected:

* APPROVED → if balance is sufficient
* REJECTED → if balance is insufficient

⸻

POST /sync/batch

Sync balances from HCM

⸻

System Flow

Swagger / Frontend
        ↓
Backend (NestJS)
        ↓
Mock HCM Server
        ↓
Database (Prisma)

⸻

Run Tests

npm run test:e2e

⸻

Common Issues

Prisma error

npx prisma generate

⸻

Migration issues

npx prisma migrate reset

⸻

HCM not working

Make sure this is running:

npx ts-node mock-hcm/server.ts