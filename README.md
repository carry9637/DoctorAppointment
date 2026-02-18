# 🏥 Doctor Appointment System

## 📋 Overview

A full-stack web application for managing doctor appointments. Built with **React**, **Express.js**, and **MongoDB**. This system allows users to book appointments with doctors, manage profiles, and administrators to manage the system.

---

## ✨ Features

### 👥 **User Features**

- ✅ User Registration & Login
- ✅ Forgot Password & Password Reset
- ✅ View Doctor Profiles
- ✅ Book Appointments
- ✅ View Appointment History
- ✅ Update Profile

### 👨‍⚕️ **Doctor Features**

- ✅ Apply to become a Doctor
- ✅ Update Doctor Profile
- ✅ Manage Appointments
- ✅ View Earnings
- ✅ Availability Management

### 👨‍💼 **Admin Features**

- ✅ Approve/Reject Doctor Applications
- ✅ Manage Users
- ✅ Manage Doctors
- ✅ View All Appointments
- ✅ System Statistics

### 🔐 **Security**

- JWT Authentication
- Password Encryption
- Role-Based Access Control

---

## 📚 **API Documentation**

📖 **Full API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

**Base URLs:**

- **Production:** `https://doctorappointment-m5j2.onrender.com/api`
- **Local Development:** `http://localhost:5000/api`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ and **npm**
- **MongoDB** (local or MongoDB Atlas)
- **Git** for version control

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/doctor-appointment-system.git
   cd doctor-appointment-system
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   ```

   Create `.env` file in `server/` folder:

   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   MONGO_URI=mongodb+srv://your_username:password@cluster.mongodb.net/?appName=Cluster0
   NODE_ENV=development
   ```

3. **Setup Frontend**

   ```bash
   cd ../client
   npm install
   ```

   Create `.env` file in `client/` folder:

   ```env
   REACT_APP_SERVER_DOMAIN=http://localhost:5000/api
   ```

---

## ▶️ **Running the Application**

### Option 1: Terminal Method (Recommended)

**Terminal 1 - Start Backend:**

```bash
cd server
npm start
```

✅ Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**

```bash
cd client
npm start
```

✅ Frontend will run on `http://localhost:3000`

### Option 2: Using Scripts (Windows)

```bash
KILL_PORTS.bat      # Kill any stuck processes
START_PROJECT.bat   # Start both servers
```

---

## 📁 **Project Structure**

```
DoctorAppointment/
├── 📄 README.md                      # Project overview
├── 📄 API_DOCUMENTATION.md           # All API endpoints
├── 📄 SETUP_GUIDE.md                 # Setup instructions
├── 📁 server/                        # Backend (Express.js)
│   ├── server.js                     # Main entry point
│   ├── .env                          # Environment variables
│   ├── 📁 routes/                    # API routes
│   ├── 📁 controllers/               # Business logic
│   ├── 📁 models/                    # MongoDB schemas
│   ├── 📁 middleware/                # Custom middleware
│   └── 📁 db/                        # Database connection
├── 📁 client/                        # Frontend (React)
│   ├── public/
│   ├── 📁 src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── 📁 components/           # Reusable components
│   │   ├── 📁 pages/                # Page components
│   │   ├── 📁 styles/               # CSS files
│   │   └── 📁 redux/                # Redux store
│   └── package.json
└── package.json
```

---

## 🧪 **Testing the APIs**

### Using Postman (Recommended)

1. **Import** the API collection from `API_DOCUMENTATION.md`
2. **Set Base URL** to `http://localhost:5000/api`
3. **Test endpoints:** Register → Login → Get Token → Use Token for Protected Routes

### Quick Test Steps:

1. **Register User**
   - POST `/user/register`
   - Body: email, password, firstname, lastname

2. **Login**
   - POST `/user/login`
   - Body: email, password, role
   - Response: Get JWT token

3. **Use Token for Protected Routes**
   - Header: `Authorization: Bearer <token>`

---

## 🔐 **Key Endpoints**

### Authentication

- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `POST /user/forgotpassword` - Forgot password
- `POST /user/resetpassword/:id/:token` - Reset password

### Doctors

- `POST /doctor/apply` - Apply as doctor
- `GET /doctor/getalldoctors` - Get all doctors
- `PUT /doctor/updatedoctor/:id` - Update doctor profile
- `GET /doctor/getdoctor/:id` - Get specific doctor

### Appointments

- `POST /appointment/book` - Book appointment
- `GET /appointment/myappointments` - Get user's appointments
- `GET /appointment/all` - Get all appointments (Admin)
- `PUT /appointment/status/:id` - Update appointment status

### Admin

- `GET /user/getallusers` - Get all users
- `GET /doctor/pending` - Get pending doctor applications
- `PUT /doctor/approve/:id` - Approve doctor application

---

## 🛠️ **Tech Stack**

### Frontend

- ⚛️ React 18
- 🎨 Redux (State Management)
- 📱 Responsive CSS

### Backend

- 🔵 Node.js / Express
- 🗄️ MongoDB (NoSQL Database)
- 🔐 JWT Authentication
- ✉️ Nodemailer (Email)

### Additional

- 🔌 Socket.io (Real-time notifications)
- 📤 Multer (File uploads)
- 🔒 Bcrypt (Password hashing)

---

## 📋 **Environment Variables**

### Server (.env)

```env
PORT=5000
JWT_SECRET=your_secret_key_here
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

### Client (.env)

```env
REACT_APP_SERVER_DOMAIN=http://localhost:5000/api
```

---

## ⚠️ **Troubleshooting**

| Issue                              | Solution                                            |
| ---------------------------------- | --------------------------------------------------- |
| `EADDRINUSE` - Port already in use | Run `KILL_PORTS.bat` or kill the process manually   |
| `Cannot GET /`                     | Make sure frontend server is running                |
| `Cannot connect to server`         | Check MongoDB connection string in `.env`           |
| `JWT Error`                        | Ensure JWT_SECRET matches in `.env`                 |
| `Module not found`                 | Run `npm install` in both server and client folders |

---

## 👨‍💻 **Author**

**Tarun Kumar**

---

## 📄 **License**

ISC License - See LICENSE file for details

---

## 📞 **Support**

For issues or questions, please refer to:

- 📖 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 📋 [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**Status:** ✅ Production Ready for Submission
**Last Updated:** February 17, 2026

## 📚 API Testing with Postman

[Doctor Appointment Postman Collection](https://kartikpaul366-1026797.postman.co/workspace/Kartik-Paul's-Workspace~1b6f3914-c07b-4ff5-84d5-b53b2c3f44d3/collection/50754273-93635c0a-8847-48e0-a7b3-97535d750666?action=share&creator=50754273)

Pre-request script automatically handles token refresh. All APIs are tested and ready to use.