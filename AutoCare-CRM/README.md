# AutoCare CRM

A Car Maintenance CRM application built with Spring Boot, React, and MySQL.

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Spring Boot backend application

## Features

- Customer management
- Vehicle tracking
- Appointment scheduling
- Service management
- Invoicing
- Dashboard with KPIs and analytics

## Technologies Used

### Frontend
- React
- TailwindCSS
- React Router
- Axios
- Chart.js

### Backend
- Spring Boot
- Spring Data JPA
- MySQL
- Lombok

## Getting Started

### Prerequisites

- Node.js and npm
- Java 17
- MySQL

### Running the Backend

1. Navigate to the backend directory:
```
cd backend
```

2. Build the application:
```
./mvnw clean install
```

3. Run the application:
```
./mvnw spring-boot:run
```

The backend will start on http://localhost:8080

### Running the Frontend

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

The frontend will start on http://localhost:3000

## API Endpoints

### Customers
- GET `/api/customers` - Get all customers
- GET `/api/customers/{id}` - Get customer by ID
- POST `/api/customers` - Create a new customer
- PUT `/api/customers/{id}` - Update a customer
- DELETE `/api/customers/{id}` - Delete a customer
- GET `/api/customers/search?query={query}` - Search customers

### Vehicles
- GET `/api/vehicles` - Get all vehicles
- GET `/api/vehicles/{id}` - Get vehicle by ID
- GET `/api/vehicles/customer/{customerId}` - Get vehicles by customer ID
- POST `/api/vehicles?customerId={customerId}` - Create a new vehicle
- PUT `/api/vehicles/{id}` - Update a vehicle
- DELETE `/api/vehicles/{id}` - Delete a vehicle

### Appointments
- GET `/api/appointments` - Get all appointments
- GET `/api/appointments/{id}` - Get appointment by ID
- GET `/api/appointments/vehicle/{vehicleId}` - Get appointments by vehicle ID
- GET `/api/appointments/status/{status}` - Get appointments by status
- POST `/api/appointments?vehicleId={vehicleId}` - Create a new appointment
- PUT `/api/appointments/{id}` - Update an appointment
- PATCH `/api/appointments/{id}/status` - Update appointment status
- DELETE `/api/appointments/{id}` - Delete an appointment

### Services
- GET `/api/services` - Get all services
- GET `/api/services/{id}` - Get service by ID
- GET `/api/services/appointment/{appointmentId}` - Get services by appointment ID
- POST `/api/services?appointmentId={appointmentId}` - Create a new service
- PUT `/api/services/{id}` - Update a service
- DELETE `/api/services/{id}` - Delete a service

### Invoices
- GET `/api/invoices` - Get all invoices
- GET `/api/invoices/{id}` - Get invoice by ID
- GET `/api/invoices/appointment/{appointmentId}` - Get invoice by appointment ID
- POST `/api/invoices?appointmentId={appointmentId}` - Create a new invoice
- PUT `/api/invoices/{id}` - Update an invoice
- DELETE `/api/invoices/{id}` - Delete an invoice

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics
- GET `/api/dashboard/appointments-chart` - Get appointments chart data
