# AIIMS Jodhpur ICU Patient Data System (ICUAW Prediction dataset creator)

An audit-ready clinical electronic medical records (EMR) application tailored for registering ICU patient profiles, tracking daily vitals/clinical variables, and recording laboratory parameters. The system generates high-integrity clinical datasets to train machine learning models for predicting **ICU-Acquired Weakness (ICUAW)**.

---

## 🚀 Key Features

* **Role-Based Access Control (RBAC)**: Secure user profiles (Admins, Doctors, Nurses) via JWT authorization. Doctors can query, register, and update only their own patient cohorts, while Admins retain complete system visibility.
* **ICUAW & ICU Status Management**: Dedicated, interactive selectors to log real-time ICU stay statuses (Active, Discharged, Deceased) and final ICUAW outcomes (Positive, Negative, Pending).
* **Automated Form Filtering**: Automatically screens out inactive patients from daily vitals and lab value entry select menus once discharged/deceased.
* **Eager-Loaded Excel Audits**: Exports multi-sheet, data-science-ready `.xlsx` files:
  * **Sheet 1**: Patient Demographic Summaries (Name, Age, Sex, BMI, APACHE II, SOFA, stay status, and final ICUAW outcome).
  * **Sheet 2**: Sequential Daily Vitals Logs (GCS, HR, MAP, Ventilation, SOFA progression, etc.).
  * **Sheet 3**: Laboratory Findings (Hb, TLC, Platelets, Urea, Creatinine, etc.).
* **Fully Responsive UI**: Mobile-first responsive grids, touch-scrollable tabs, and sidebar menu drawers designed to adapt to bedside tablets or smartphones.
* **Admin Dashboard Portal**: Integrated AdminJS portal for administrative management of database models.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), TypeScript, Tailwind CSS, Axios, Lucide React, XLSX
* **Backend**: Node.js, Express, JSON Web Tokens (JWT), Sequelize ORM
* **Database**: PostgreSQL (Neon Server)
* **Administration**: AdminJS

---

## 📂 Project Structure

```text
ICUAW-main/
├── backend/
│   ├── .adminjs/            # AdminJS bundle cache
│   ├── models/              # Sequelize database schema definitions (User, Patient, DailyRecord, LabValues)
│   ├── admin.js             # AdminJS portal configuration
│   ├── db.js                # Database connection establishment
│   ├── server.js            # Express API server, routes, and auth middleware
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Global Layout and Nav elements
│   │   ├── pages/           # Page routes (Dashboard, Login, PatientsList, NewPatient, DailyEntry, LabEntry, Reports)
│   │   ├── App.tsx          # Router configuration and API interceptors
│   │   └── index.css        # Global CSS overrides and responsive styles
│   └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+)
* Running PostgreSQL Database

### 1. Backend Setup
1. Open a terminal inside `backend/` and run:
   ```bash
   npm install
   ```
2. Create a `.env` file inside `backend/` with the following variables:
   ```env
   PORT=5000
   DATABASE_URL=postgres://your_postgres_credentials
   JWT_SECRET=your_jwt_secret_key
   SESSION_SECRET=your_adminjs_cookie_session_secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_admin_password
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a terminal inside `frontend/` and run:
   ```bash
   npm install
   ```
2. Configure your Vite environment base proxy inside `vite.config.ts` if needed (currently pre-configured to proxy request targets to port `5000`).
3. Run the Vite client development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:3000` (or the local port provided by Vite).
