# 🏠 RentNest Backend

A secure and scalable REST API for a rental property marketplace where tenants can browse rental properties, landlords can manage listings, and admins can oversee the platform.

---

## 🚀 Live API

```
project-a4-taupe.vercel.app
```

## 📖 Project Overview

RentNest is a rental property management backend built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma**.

The system supports three roles:

- 👤 Tenant
- 🏠 Landlord
- 👑 Admin

Tenants can browse and request properties, landlords can manage their listings and rental requests, while admins manage users and platform resources.

---

# ✨ Features

## Authentication

- JWT Authentication
- Password Hashing using bcrypt
- Role Based Authorization
- Protected Routes
- Get Current User

---

## Tenant

- Register/Login
- Browse Properties
- Search & Filter Properties
- Submit Rental Request
- View Rental History
- Make Payment
- View Payment History
- Leave Reviews

---

## Landlord

- Create Property
- Update Property
- Delete Property
- View Own Properties
- View Rental Requests
- Approve Rental
- Reject Rental

---

## Admin

- View Users
- Ban / Unban Users
- View All Properties
- View All Rentals
- Manage Categories

---

# 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| TypeScript | Type Safety |
| PostgreSQL | Database |
| Prisma ORM | Database ORM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Zod | Request Validation |

---

# 📁 Folder Structure

```
src
│
├── config
│
├── errors
│
├── middleware
│
├── modules
│   ├── auth
│   ├── admin
│   ├── category
│   ├── payment
│   ├── property
│   ├── rental
│   └── review
│
├── routes
│
├── utils
│
├── app.ts
└── server.ts
```

---

# 🔑 Authentication

JWT Authentication is used.

Include the token in every protected request.

```
Authorization: Bearer YOUR_TOKEN
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |

---

## Categories

| Method | Endpoint |
|---------|----------|
| POST | /api/categories |
| GET | /api/categories |

---

## Properties

| Method | Endpoint |
|---------|----------|
| POST | /api/properties |
| GET | /api/properties |
| GET | /api/properties/:id |
| PATCH | /api/properties/:id |
| DELETE | /api/properties/:id |

---

## Rentals

| Method | Endpoint |
|---------|----------|
| POST | /api/rentals |
| GET | /api/rentals |
| GET | /api/rentals/:id |
| GET | /api/landlord/requests |
| PATCH | /api/landlord/requests/:id |

---

## Payments

| Method | Endpoint |
|---------|----------|
| POST | /api/payments/create |
| POST | /api/payments/confirm |
| GET | /api/payments |
| GET | /api/payments/:id |

---

## Reviews

| Method | Endpoint |
|---------|----------|
| POST | /api/reviews |
| GET | /api/reviews/property/:propertyId |

---

## Admin

| Method | Endpoint |
|---------|----------|
| GET | /api/admin/users |
| PATCH | /api/admin/users/:id |
| GET | /api/admin/properties |
| GET | /api/admin/rentals |

---

# ⚙️ Installation

Clone the repository

Go to project

```bash
cd rentnest-backend
```

Install dependencies

```bash
npm install
```

Configure environment variables

Create a `.env` file

```env
DATABASE_URL=your_database_url

JWT_SECRET=your_secret_key

PORT=5000
```

Run Prisma Migration

```bash
npx prisma migrate dev
```

Generate Prisma Client

```bash
npx prisma generate
```

Run the development server

```bash
npm run dev
```

---

# 📦 Build

```bash
npm run build
```

---

# ▶ Start Production

```bash
npm start
```

---

# 🔒 User Roles

### Admin

- Manage Users
- Ban / Unban Users
- View All Properties
- View All Rentals
- Manage Categories

### Landlord

- Manage Own Properties
- Approve Rental Requests
- Reject Rental Requests

### Tenant

- Browse Properties
- Request Rental
- Make Payment
- Leave Review

