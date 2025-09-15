# Money Manager Application

A comprehensive financial management backend built with Spring Boot and MySQL. This application provides REST APIs for tracking income, expenses, user management, and generating financial insights.

## Features

- User registration and authentication with JWT
- Income tracking with categories and date filtering
- Expense management with category-based filtering
- Financial dashboard with summary statistics
- Real-time notifications system
- User profile management
- Emoji support for categories
- Input validation and error handling

## Technical Stack

- **Framework**: Spring Boot 3.5.5
- **Database**: MySQL 8
- **Security**: Spring Security with JWT authentication
- **Validation**: Jakarta Bean Validation
- **Tools**: Maven for dependency management

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get JWT token
- `GET /api/auth/me` - Get current authenticated user details

### User Management

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-password` - Change user password
- `PUT /api/user/notifications` - Update notification settings

### Income Management

- `GET /api/income` - Get all incomes for current user
- `POST /api/income` - Add a new income
- `GET /api/income/{id}` - Get income by ID
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income
- `GET /api/income/category/{category}` - Get incomes by category
- `POST /api/income/date-range` - Get incomes by date range
- `GET /api/income/total` - Get total income
- `GET /api/income/by-category` - Get income breakdown by category

### Expense Management

- `GET /api/expense` - Get all expenses for current user
- `POST /api/expense` - Add a new expense
- `GET /api/expense/{id}` - Get expense by ID
- `PUT /api/expense/{id}` - Update expense
- `DELETE /api/expense/{id}` - Delete expense
- `GET /api/expense/category/{category}` - Get expenses by category
- `POST /api/expense/date-range` - Get expenses by date range
- `GET /api/expense/total` - Get total expenses
- `GET /api/expense/by-category` - Get expense breakdown by category

### Dashboard

- `GET /api/dashboard` - Get financial dashboard data
- `POST /api/dashboard/date-range` - Get dashboard data for specific date range

### Utilities

- `GET /api/utils/categories` - Get predefined categories with emojis

## How to Test the Application

You can test the application using tools like Postman, cURL or any API testing tool. Here's how to get started:

### 1. Start the Application

```bash
./mvnw spring-boot:run
```

### 2. Register a User

```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

### 3. Login to Get JWT Token

```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

Save the JWT token returned in the response.

### 4. Add an Income

```
POST http://localhost:8080/api/income
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "amount": 5000.00,
  "category": "Salary",
  "description": "Monthly salary",
  "date": "2025-09-10",
  "emoji": "💰"
}
```

### 5. Add an Expense

```
POST http://localhost:8080/api/expense
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "amount": 1500.00,
  "category": "Housing",
  "description": "Monthly rent",
  "date": "2025-09-05",
  "emoji": "🏠"
}
```

### 6. View Dashboard

```
GET http://localhost:8080/api/dashboard
Authorization: Bearer <your-jwt-token>
```

## Security Considerations

- JWT tokens expire after 24 hours
- Passwords are securely hashed using BCrypt
- All endpoints except authentication are protected
- Proper input validation to prevent injection attacks
- CORS is configured for frontend access

## Development Setup

1. Clone the repository
2. Configure your MySQL database in `application.properties`
3. Run the application with `./mvnw spring-boot:run`
4. The application will be available at `http://localhost:8080`

## Database Schema

The application uses the following main entities:

- User - User account information
- Income - Income records with categories
- Expense - Expense records with categories

## Future Enhancements

- Budget planning and tracking
- Recurring transactions
- Reports and analytics
- Export functionality (PDF, CSV)
- Mobile app integration
