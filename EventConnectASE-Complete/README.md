\# EventConnectASE 🎟️



A full-stack event management and ticket-booking application built using React, Spring Boot, and MySQL.



\## Tech Stack



\- Frontend: React + Vite

\- Backend: Java 21 + Spring Boot

\- Database: MySQL 8

\- API communication: Axios

\- Authentication: JWT

\- QR Tickets: QR code generation



\## Project Structure



```text

EventConnect-Final/

├── backend/

├── frontend/

└── README.md

```



\## Prerequisites



Install the following:



\- Java JDK 21

\- Node.js (LTS)

\- MySQL 8

\- Git



\## 1. Clone the Repository



```bash

git clone YOUR\_GITHUB\_REPOSITORY\_URL

cd KLH-CSE-2026-2420030173-EvenConnect

```



\## 2. Database Setup



Open MySQL Workbench and execute:



```sql

CREATE DATABASE eventconnectase\_db;

```



Configure your own database username and password in the backend's `application.properties` using the environment variables described in `.env.example`.



Set the following environment variables before starting the backend:



\- `DB\_URL`

\- `DB\_USERNAME`

\- `DB\_PASSWORD`

\- `JWT\_SECRET`



\## 3. Run the Backend



Open a terminal inside the `backend` folder.



Windows:



```bash

mvnw.cmd spring-boot:run

```



Backend URL: http://localhost:8080



\## 4. Run the Frontend



Open another terminal inside the `frontend` folder.



Install dependencies:



```bash

npm install

```



Start the application:



```bash

npm run dev

```



Frontend URL: http://localhost:5173



\## 5. Access EventConnect



Open http://localhost:5173 in your browser.



\## Features



\- User registration and login

\- Event discovery and search

\- Event category filtering and sorting

\- Ticket booking and cancellation

\- Checkout with simulated payment

\- QR-code digital tickets

\- Admin dashboard

\- Event creation, editing, and deletion



\*\*Note:\*\* The payment functionality is a demonstration simulation, not real payment processing.



\## Important



Each user must configure their own MySQL credentials and JWT secret. Never share or commit private passwords or secrets to GitHub.

