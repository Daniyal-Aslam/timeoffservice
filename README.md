# Time-Off Service (Backend)

A robust **NestJS-based microservice** designed to manage employee time-off requests. This service features seamless external HCM (Human Capital Management) integration, automated balance validation, and real-time synchronization.

---

##  Features

* **Request Management:** Create and track employee time-off requests.
* **Balance Validation:** Real-time leave balance checks via external HCM integration.
* **Data Synchronization:** Batch sync employee balances to keep local records updated.
* **API Documentation:** Fully interactive API documentation powered by Swagger.
* **Resilience:** Fault-tolerant logic for handling external service integrations.

---

##  Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [NestJS](https://nestjs.com/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Database** | SQLite (Development) |
| **HTTP Client** | Axios |
| **Documentation** | Swagger|

---

##  Setup & Installation

Follow these steps to get the service running on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Daniyal-Aslam/timeoffservice.git
cd timeoffservice
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
HCM_BASE_URL=http://localhost:4000
```

---

##  Database Management (Prisma)

Initialize the database and generate the client:

1.  **Generate Prisma Client:**
    ```bash
    npx prisma generate
    ```
2.  **Run Migrations:**
    ```bash
    npx prisma migrate dev --name init
    ```
3.  **Explore Data (Optional):**
    To view your data in a GUI, run:
    ```bash
    npx prisma studio
    ```

---

##  Running the Application

This service requires a connection to an HCM server. A mock server is provided for local development.

### Step 1: Start Mock HCM Server
In a new terminal window, run:
```bash
npx ts-node mock-hcm/server.ts
```
> **Note:** You should see `Mock HCM running on http://localhost:4000`.

### Step 2: Start the Backend Server
In your main terminal, run:
```bash
npm run start:dev
```
> **Note:** You should see `Nest application successfully started`.

---

##  API Documentation

Once the server is running, you can access the interactive Swagger UI to explore and test the API endpoints:

🔗 **URL:** `http://localhost:3000/api`

### Primary Endpoints

* **`GET /balances`**: Retrieve balance for a specific employee.
    * *Params:* `employeeId`, `locationId`.
* **`POST /requests`**: Submit a new time-off request.
    * *Body:* `{ "employeeId": "emp1", "locationId": "loc1", "daysRequested": 2 }`
    * *Result:* Returns `APPROVED` or `REJECTED` based on HCM balance.
* **`POST /sync/batch`**: Trigger a manual sync of balances from the HCM.

---

##  System Flow



1.  **User/Frontend** → Triggers request via **Swagger UI**.
2.  **NestJS Backend** → Processes business logic and validation.
3.  **Mock HCM Server** → External source of truth for leave balances.
4.  **Prisma/SQLite** → Local persistence for request history and synced data.

---

##  Testing
To ensure the system is functioning correctly, run the end-to-end tests:
```bash
npm run test:e2e
```

---

##  Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Prisma Client Not Found** | Run `npx prisma generate` |
| **Migration Conflicts** | Run `npx prisma migrate reset` |
| **HCM Connection Refused** | Ensure the mock server is running on port `4000` |
