# Doctor Appointment System - API Documentation

**Base URL:** `https://doctorappointment-m5j2.onrender.com/api`  
**Local Base URL:** `http://localhost:5000/api`

---

## 🔐 Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## 👤 USER ENDPOINTS

### 1. Register User

**POST** `/user/register`

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Patient",
  "pic": "image_url_optional"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "role": "Patient"
  }
}
```

---

### 2. Login User

**POST** `/user/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "Patient"
}
```

**Response (201):**

```json
{
  "message": "User logged in successfully",
  "token": "jwt_token_here"
}
```

---

### 3. Get User Profile

**GET** `/user/getuser/:userId`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "_id": "user_id",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "role": "Patient",
  "pic": "image_url"
}
```

---

### 4. Get All Users

**GET** `/user/getallusers`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "_id": "user_id",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "role": "Patient"
  }
]
```

---

### 5. Update Profile

**PUT** `/user/updateprofile`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "age": 25,
  "mobile": "9876543210",
  "gender": "Male",
  "address": "123 Main St"
}
```

**Response (201):**

```json
{
  "message": "User updated successfully"
}
```

---

### 6. Change Password

**POST** `/user/changepassword`

**Request Body:**

```json
{
  "userId": "user_id",
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmNewPassword": "new_password"
}
```

**Response (200):**

```json
{
  "message": "Password changed successfully"
}
```

---

### 7. Forgot Password

**POST** `/user/forgotpassword`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "message": "Email sent successfully"
}
```

---

### 8. Reset Password

**POST** `/user/resetpassword/:id/:token`

**Request Body:**

```json
{
  "password": "new_password"
}
```

**Response (200):**

```json
{
  "message": "Password reset successfully"
}
```

---

### 9. Delete User

**DELETE** `/user/deleteuser`

**Request Body:**

```json
{
  "userId": "user_id"
}
```

**Response (200):**

```json
{
  "message": "User deleted successfully"
}
```

---

## 👨‍⚕️ DOCTOR ENDPOINTS

### 1. Apply as Doctor

**POST** `/doctor/applydoctor`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "userId": "user_id",
  "speciality": "Cardiology",
  "experience": 5,
  "phone": "9876543210",
  "fees": 500
}
```

**Response (201):**

```json
{
  "message": "Doctor application submitted successfully"
}
```

---

### 2. Get All Doctors

**GET** `/doctor/getalldoctors`

**Response (200):**

```json
[
  {
    "_id": "doctor_id",
    "userId": {
      "firstname": "Dr. John",
      "lastname": "Doe",
      "email": "doctor@example.com"
    },
    "speciality": "Cardiology",
    "experience": 5,
    "fees": 500,
    "isDoctor": true
  }
]
```

---

### 3. Get Pending Doctor Applications

**GET** `/doctor/getpendingdoctors`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "_id": "app_id",
    "userId": "user_id",
    "speciality": "Cardiology",
    "isDoctor": false
  }
]
```

---

### 4. Approve Doctor Application

**POST** `/doctor/approvedoctor`

**Request Body:**

```json
{
  "docId": "doctor_id"
}
```

**Response (200):**

```json
{
  "message": "Doctor approved successfully"
}
```

---

### 5. Reject Doctor Application

**POST** `/doctor/rejectdoctor`

**Request Body:**

```json
{
  "docId": "doctor_id"
}
```

**Response (200):**

```json
{
  "message": "Doctor rejected successfully"
}
```

---

## 📅 APPOINTMENT ENDPOINTS

### 1. Book Appointment

**POST** `/appointment/bookappointment`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "doctorId": "doctor_id",
  "userId": "user_id",
  "date": "2025-12-20",
  "time": "10:00 AM",
  "reason": "General Checkup"
}
```

**Response (201):**

```json
{
  "message": "Appointment booked successfully"
}
```

---

### 2. Get User Appointments

**GET** `/appointment/getuserappointments/:userId`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "_id": "appt_id",
    "doctorId": "doctor_id",
    "userId": "user_id",
    "date": "2025-12-20",
    "time": "10:00 AM",
    "reason": "General Checkup",
    "status": "Pending"
  }
]
```

---

### 3. Get Doctor Appointments

**GET** `/appointment/getdoctorappointments/:doctorId`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "_id": "appt_id",
    "doctorId": "doctor_id",
    "userId": "user_id",
    "date": "2025-12-20",
    "time": "10:00 AM",
    "status": "Pending"
  }
]
```

---

### 4. Mark Appointment as Completed

**POST** `/appointment/markascompleted`

**Request Body:**

```json
{
  "appointmentId": "appt_id"
}
```

**Response (200):**

```json
{
  "message": "Appointment marked as completed"
}
```

---

## 🔔 NOTIFICATION ENDPOINTS

### 1. Get Notifications

**GET** `/notification/getnotifications/:userId`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "_id": "notif_id",
    "userId": "user_id",
    "message": "Your appointment is scheduled",
    "read": false
  }
]
```

---

### 2. Mark Notification as Read

**POST** `/notification/markasread`

**Request Body:**

```json
{
  "notificationId": "notif_id"
}
```

**Response (200):**

```json
{
  "message": "Notification marked as read"
}
```

---

## Error Responses

**400 Bad Request:**

```json
{
  "message": "Email already exists"
}
```

**401 Unauthorized:**

```json
{
  "message": "Invalid token"
}
```

**404 Not Found:**

```json
{
  "message": "User not found"
}
```

**500 Internal Server Error:**

```json
{
  "message": "Internal server error"
}
```

---

## Test Examples

### Register

```bash
curl -X POST https://doctorappointment-m5j2.onrender.com/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Patient"
  }'
```

### Login

```bash
curl -X POST https://doctorappointment-m5j2.onrender.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "Patient"
  }'
```

---

**Version:** 1.0  
**Last Updated:** December 11, 2025
