# Server Code Documentation

Since this is a **Frontend-Only Prototype**, the `server/` folder contains a minimal, read-only backend setup required to serve the React application. 

This document explains the purpose and functionality of each server-side file to provide transparency into the system architecture, even though these files are not modified in this mode.

---

## 1. `server/app.ts`
**Purpose:** The main entry point for the Express application configuration.

### Key Sections:
- **Logging (`log` function):** A simple utility to print timestamped messages to the console.
- **Express Middleware Configuration:**
  - `express.json()`: Parses incoming JSON payloads.
  - `express.urlencoded()`: Parses URL-encoded data.
  - **Request Logging Middleware:** A custom middleware that captures the start time of a request, intercepts the JSON response, and logs the method, path, status code, duration, and response body for all `/api` routes.
- **Error Handling:** A global error handler that catches exceptions and returns a standard 500 error response with a JSON message.
- **Server Startup (`runApp`):** 
  - Registers routes.
  - Starts the HTTP server on port 5000 (or `process.env.PORT`).
  - Binds to `0.0.0.0` to make the app accessible externally.

---

## 2. `server/routes.ts`
**Purpose:** Defines the API endpoints for the application.

### Key Sections:
- **`registerRoutes(app)` function:**
  - This is where backend API routes would be defined (e.g., `app.get('/api/deals', ...)`).
  - In this mockup mode, **no API routes are defined** because all data is handled client-side using the `mockData.ts` module.
  - Returns an `http.Server` instance which is used by `app.ts`.

---

## 3. `server/storage.ts`
**Purpose:** Defines the data persistence layer (Database Interface).

### Key Sections:
- **`IStorage` Interface:** Defines the contract for database operations (CRUD).
  - `getUser(id)`: Fetch a user by ID.
  - `getUserByUsername(username)`: Fetch a user by username.
  - `createUser(user)`: Insert a new user.
- **`MemStorage` Class:** A simple in-memory implementation of the `IStorage` interface using JavaScript `Map` objects.
  - This is used as a placeholder storage engine for development environments that don't have a real database connected.
- **Exported `storage` instance:** A singleton instance of `MemStorage` used throughout the app.

---

## 4. `shared/schema.ts`
**Purpose:** Defines the database schema and type definitions shared between client and server.

### Key Sections:
- **Drizzle ORM Table Definition (`users`):**
  - Defines a `users` table with `id`, `username`, and `password` columns.
  - Uses `pg-core` types (`pgTable`, `text`, `varchar`).
- **Zod Schemas:**
  - `insertUserSchema`: A validation schema automatically generated from the table definition, used for validating new user inputs (picking only `username` and `password`).
- **Type Definitions:**
  - `User`: The TypeScript type representing a row in the users table.
  - `InsertUser`: The TypeScript type representing the data needed to create a new user.

---

## Summary
This server setup provides a lightweight, robust foundation for serving the frontend application. In this "Mockup Mode," the complex business logic and data management are intentionally shifted to the client-side (`client/src/lib/mockData.ts`) to allow for rapid prototyping and instant feedback without needing to manage database migrations or server restarts.
