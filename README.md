
# Invoice Creator Pro

A complete billing application with frontend and backend capabilities.

## Project Structure

The project is split into two main parts:
- `frontend`: React frontend using Vite, TypeScript, Tailwind CSS, and shadcn/ui
- `backend`: Express backend with MongoDB Atlas integration

## Backend Setup

1. Navigate to the backend folder:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the backend directory with your MongoDB connection string:
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

4. Start the backend server:
```
npm run dev
```

The server will run on http://localhost:5000

## Frontend Setup

1. Navigate to the frontend folder:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

The frontend will run on http://localhost:8080

## Features

- Invoice management (create, read, update, delete)
- Buyer management
- Cylinder/product management
- PDF generation
- Local storage backup if server is unreachable
- Responsive UI

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - react-to-print for PDF generation

- Backend:
  - Node.js
  - Express
  - MongoDB with Mongoose
  - RESTful API design

## API Endpoints

- `/api/invoices` - Manage invoices
- `/api/buyers` - Manage buyers
- `/api/cylinders` - Manage cylinders
