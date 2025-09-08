# Full Stack Product Management System

This project consists of a Laravel backend API and a React frontend application for managing products and categories.

## Prerequisites

- PHP >= 8.1
- Node.js >= 16.x
- Composer
- MySQL >= 8.0
- Git

## Project Structure

```
project/
├── backend/         # Laravel API
└── frontend/        # React Application
```

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install PHP dependencies:

```bash
composer install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure your .env file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Generate application key:

```bash
php artisan key:generate
```

6. Run database migrations:

```bash
php artisan migrate
```

7. Start the Laravel development server:

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure your .env file:

```env
VITE_API_URL=http://localhost:8000/api
```

5. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Routes

### Authentication

- POST `/api/login` - User login
- POST `/api/register` - User registration

### Products

- GET `/api/products` - Get product list (with pagination)
- POST `/api/products` - Create new product
- PUT `/api/products/{id}` - Update product
- DELETE `/api/products` - Delete products (accepts array of IDs)

### Categories

- GET `/api/categories` - Get category list

## Features

- User Authentication
- Product Management
  - Create/Edit/Delete Products
  - Product Listing with Pagination
  - Filter Products by Category
  - Filter Products by Status (Enabled/Disabled)
- Category Management
- Soft Deletes for Products
- Export Products to Excel

## Testing

### Backend Tests

Run PHPUnit tests:

```bash
cd backend
php artisan test
```

### Frontend Tests

Run Jest tests:

```bash
cd frontend
npm test
```

## Development Notes

- The backend uses Laravel's built-in authentication system with API tokens
- Products implement soft deletes
- The frontend uses React with Redux for state management
- API requests are handled using Axios
- Form validation is implemented both on frontend and backend

## Production Deployment

1. Backend:

```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

2. Frontend:

```bash
cd frontend
npm install
npm run build
```

## Security Features

- CSRF Protection
- API Authentication
- Input Validation
- SQL Injection Protection
- XSS Protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
