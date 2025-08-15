# Feedback Pin

A web application that allows users to place feedback pins on any webpage, enabling collaborative feedback and annotation directly on web content.

## Project Structure

```
feedback-pin/
├── frontend/          # React TypeScript frontend
├── backend/           # Spring Boot Java backend
└── README.md         # This file
```

## Frontend

The frontend is built with React, TypeScript, and Vite, providing a modern and responsive user interface for placing and managing feedback pins.

### Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling
- **Vitest** - Testing framework

### Features

- Place feedback pins on any webpage
- View and manage existing pins
- Real-time feedback form
- Responsive design
- Comprehensive test coverage

### Running Frontend Locally

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint

## Backend

The backend is a Spring Boot application that provides REST APIs for managing feedback pins, with MySQL database integration.

### Technologies Used

- **Java 17** - Programming language
- **Spring Boot 3** - Application framework
- **Spring Data JPA** - Data persistence
- **MySQL** - Database
- **Maven** - Build tool

### Features

- RESTful API for pin management
- MySQL database integration
- CORS configuration for frontend integration
- Comprehensive error handling
- Environment-based configuration

### API Endpoints

- `GET /pins?url={url}&emailId={emailId}` - Get pins for a specific URL and email
- `POST /pin` - Create or update a pin
- `DELETE /pins?id={id}` - Delete a specific pin
- `DELETE /pins?url={url}&emailId={emailId}` - Delete all pins for a URL and email

### Running Backend Locally

1. Navigate to the backend directory:
   ```bash
   cd backend/feedback-pin
   ```

2. Ensure you have Java 17 installed

3. Set up a local MySQL database and update the connection details in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/your_local_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

5. The backend will be available at `http://localhost:8080`

### Backend Scripts

- `./mvnw spring-boot:run` - Start the application
- `./mvnw test` - Run tests
- `./mvnw clean package` - Build the application

## Deployment

### Current Deployment

The backend is currently deployed on **Railway** (https://feedback-pin-production.up.railway.app) because Railway provides:
- Easy Java Spring Boot service deployment
- Managed MySQL database service
- Environment variable management
- Automatic deployments from Git

The frontend can be deployed on any static hosting service like Vercel, Netlify, or GitHub Pages.

### Connecting Frontend to Local Backend

To connect the frontend to a locally running backend:

1. Open `frontend/src/services/apiService.ts`
2. Change the `API_BASE_URL` from:
   ```typescript
   const API_BASE_URL = "https://feedback-pin-production.up.railway.app";
   ```
   to:
   ```typescript
   const API_BASE_URL = "http://localhost:8080";
   ```

### Connecting Backend to Local Database

To connect the backend to a local MySQL database:

1. Set up a local MySQL server
2. Create a database for the application
3. Update `backend/feedback-pin/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

## Development Workflow

### Full Local Development

1. Set up local MySQL database
2. Configure backend to use local database
3. Start backend: `cd backend/feedback-pin && ./mvnw spring-boot:run`
4. Configure frontend to use local backend
5. Start frontend: `cd frontend && npm run dev`
6. Access the application at `http://localhost:5173`

### Hybrid Development (Frontend local, Backend on Railway)

1. Keep the default `API_BASE_URL` in `frontend/src/services/apiService.ts`
2. Start frontend: `cd frontend && npm run dev`
3. Access the application at `http://localhost:5173`

## Environment Variables

### Backend (Railway Deployment)

- `MYSQL_PASSWORD` - MySQL database password
- `MYSQL_USER` - MySQL database username

### Local Development

Set up your local environment variables or update the `application.properties` file directly with your local database credentials.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## License

This project is licensed under the MIT License.
