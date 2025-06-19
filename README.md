
# 🧾 Employee Leave Management System – Backend

This is the backend repository for the **Employee Leave Management System**, a project built using the **Scrum framework**. It provides APIs for employee leave requests, manager approvals, and year-end leave accumulation.

---

## 📌 Project Overview

The system helps employees manage their leave days and allows managers to review, approve, or reject leave requests. Each employee is granted **12 leave days** per year by default, and **unused days are carried over** to the next year automatically.

🔗 Frontend Repo: [thanhvyhere/Employee-Leave-Pro](https://github.com/thanhvyhere/Employee-Leave-Pro)  
🔗 Backend Repo: [khadiii1811/scrum-project-sever](https://github.com/khadiii1811/scrum-project-sever)

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **JWT (JSON Web Token)**
- **MVC Architecture**

---

## 📁 Project Structure
scrum-project-sever/
│
├── controllers/ # Handle business logic
├── models/ # DB models
├── routes/ # Express route definitions
├── utils/ # DB connection, helpers
├── middlewares/ # Auth middleware
├── database.sql # DB schema
├── data.sql # Sample data
├── main.js # Entry point
└── .env # Environment variables

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/khadiii1811/scrum-project-sever.git
cd scrum-project-sever
```
### 2. Install dependencies
```bash
npm i
```
### 3. Set up environment variables
Create a .env file:
```bash
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=leave_management
DB_PORT=5432
EMAIL_USER="skill0sp1@gmail.com"
EMAIL_PASS="vdng mzmp hliv qwyq"
```
### 4. Set up the database
- Create a PostgreSQL database
- Run database.sql and data.sql to set up tables and sample data

### 5. Start the server
```bash
npm start
```
Server will run at: http://localhost:3001
---
## 📌 Features
### ✅ Authentication & Role
- JWT-based login system
- Role-based access for employee and manager

### 👨‍💼 Employee Features
- View personal info & leave balance
- Request new leave (calendar + reason)
- View leave request history

### 🧑‍💼 Manager Features
- View all leave requests
- Approve / Reject requests with confirmation and reason
- View employee list & remaining leave days
- Add / Delete employees

### 🔄 Year-End Leave Accumulation
- Cron job runs every Jan 1
- Automatically carries over unused leave days to the new year
---
## 📮 API Endpoints (Examples)
| Method | Endpoint                             | Description                            |
| ------ | ------------------------------------ | -------------------------------------- |
| POST   | `/login`                             | Login and receive token                |
| GET    | `/employee/info`                     | Get employee profile and leave balance |
| POST   | `/leave-request`                     | Submit new leave request               |
| GET    | `/my-leave-requests`                 | View own leave request history         |
| GET    | `/team-leave-requests`               | View all requests (Manager only)       |
| PUT    | `/manager/leave-request/:id/approve` | Approve leave (Manager only)           |
| PUT    | `/manager/leave-request/:id/reject`  | Reject leave with reason               |
| GET    | `/employees`                         | View all employees                     |
| POST   | `/employee`                          | Add a new employee                     |
| DELETE | `/employee/:id`                      | Delete an employee                     |

---
## 🧑‍💻 Team Structure
| Role          | Members                    |
| ------------- | -------------------------- |
| Product Owner | Huy                        |
| Scrum Master  | Vy                         |
| Developers    | Vy, Hương, Khoa, Tính, Huy |

---
## 📅 Scrum Summary
- No. of Sprints: 3
- Sprint Duration: 1 day + 1 morning
- Product Goal: A minimal but complete leave management system with approval flow and yearly leave accumulation.
---
## 📜 License
This project is for academic/demo purposes and not licensed for production use.

---
## 🧾 Source
This project was created by a part of BecaBigo Team as a group assignment in June 2025.
=======
# 🧾 Employee Leave Management System – Backend

This is the backend repository for the **Employee Leave Management System**, a project built using the **Scrum framework**. It provides APIs for employee leave requests, manager approvals, and year-end leave accumulation.

---

## 📌 Project Overview

The system helps employees manage their leave days and allows managers to review, approve, or reject leave requests. Each employee is granted **12 leave days** per year by default, and **unused days are carried over** to the next year automatically.

🔗 Frontend Repo: [thanhvyhere/Employee-Leave-Pro](https://github.com/thanhvyhere/Employee-Leave-Pro)  
🔗 Backend Repo: [khadiii1811/scrum-project-sever](https://github.com/khadiii1811/scrum-project-sever)

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **JWT (JSON Web Token)**
- **MVC Architecture**

---


## 📁 Project Structure
```bash
scrum-project-sever/
│
├── controllers/        # Handle business logic
├── middlewares/        # Auth middleware
├── models/             # DB models
├── routes/             # Express route definitions
├── utils/              # DB connection, helpers
├── main.js             # Entry point
└── .env                # Environment variables
```


## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/khadiii1811/scrum-project-sever.git
cd scrum-project-sever
```
### 2. Install dependencies
```bash
npm i
```
### 3. Set up environment variables
Create a .env file:
```bash
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=leave_management
DB_PORT=5432
EMAIL_USER="skill0sp1@gmail.com"
EMAIL_PASS="vdng mzmp hliv qwyq"
```
### 4. Set up the database
- Create a PostgreSQL database.
- Run database.sql and data.sql to set up tables and sample data.

### 5. Start the server
```bash
npm start
```
Server will run at: http://localhost:3001
---
## 📌 Features
### ✅ Authentication & Role
- JWT-based login system.
- Role-based access for employee and manager.

### 👨‍💼 Employee Features
- View personal info & leave balance.
- Request new leave (calendar + reason).
- View leave request history.

### 🧑‍💼 Manager Features
- View all leave requests.
- Approve / Reject requests with confirmation and reason (if rejected).
- View employee list & remaining leave days.
- Add / Delete employees.

### 🔄 Year-End Leave Accumulation
- Cron job runs every Jan 1.
- Automatically carries over unused leave days to the new year.
---
## 📮 API Endpoints (Examples)
| Method | Endpoint                             | Description                            |
| ------ | ------------------------------------ | -------------------------------------- |
| POST   | `/login`                             | Login and receive token                |
| GET    | `/employee/info`                     | Get employee profile and leave balance |
| POST   | `/leave-request`                     | Submit new leave request               |
| GET    | `/my-leave-requests`                 | View own leave request history         |
| GET    | `/team-leave-requests`               | View all requests (Manager only)       |
| PUT    | `/manager/leave-request/:id/approve` | Approve leave (Manager only)           |
| PUT    | `/manager/leave-request/:id/reject`  | Reject leave with reason               |
| GET    | `/employees`                         | View all employees                     |
| POST   | `/employee`                          | Add a new employee                     |
| DELETE | `/employee/:id`                      | Delete an employee                     |

---
## 🧑‍💻 Team Structure
| Role          | Members                    |
| ------------- | -------------------------- |
| Product Owner | Huy                        |
| Scrum Master  | Vy                         |
| Developers    | Vy, Hương, Khoa, Tính, Huy |

---
## 📅 Scrum Summary
- No. of Sprints: 3
- Sprint Duration: 1 day + 1 morning
- Product Goal: A minimal but complete leave management system with approval flow and yearly leave accumulation.
---
## 📜 License
This project is for academic/demo purposes and not licensed for production use.

---
## 🧾 Source
This project was created by a part of BecaBigo Team as a group assignment in June 2025.

