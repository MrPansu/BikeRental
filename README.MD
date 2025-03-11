# Bike Rental Application

## Overview

This is a full-stack bike rental management application built with React (frontend) and Node.js/Express (backend). The application allows users to manage bike rentals, customers, and transactions.

## Features

- User authentication (Login/Register)
- Role-based access control (Admin/User)
- Bike management (Add/Edit/Delete bikes)
- Customer management (Add/Edit/Delete customers)
- Transaction management (Create/Edit/Delete rentals)
- Dashboard with statistics and overview
- Dark/Light mode support

## Tech Stack

### Frontend

- React
- Chakra UI for styling
- Zustand for state management
- React Router for navigation
- Axios for API calls
- Formik & Yup for form validation

### Backend

- Node.js
- Express
- MongoDB
- JWT for authentication
- Bcrypt for password hashing

## Installation

### Prerequisites

- Node.js
- MongoDB
- Git

### Setup Steps

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install backend dependencies

```bash
cd server
npm install
```

3. Install frontend dependencies

```bash
cd client
npm install
```

4. Configure environment variables
   Create `.env` file in server directory:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

5. Start the application

```bash
# Start backend server
cd server
npm run dev

# Start frontend development server
cd client
npm run dev
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Bikes

- GET `/api/bike` - Get all bikes
- POST `/api/bike` - Create new bike
- PUT `/api/bike/:id` - Update bike
- DELETE `/api/bike/:id` - Delete bike

### Customers

- GET `/api/customer` - Get all customers
- POST `/api/customer` - Create new customer
- PUT `/api/customer/:id` - Update customer
- DELETE `/api/customer/:id` - Delete customer

### Transactions

- GET `/api/transaction` - Get all transactions
- POST `/api/transaction` - Create new transaction
- PUT `/api/transaction/:id` - Update transaction
- DELETE `/api/transaction/:id` - Delete transaction

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
