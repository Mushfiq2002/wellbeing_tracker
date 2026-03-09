# Project Structure Documentation

This document provides a high-level overview of this project structure. It is designed to help new members understand where different parts of the application reside and what their responsibilities are.

---

## Root Directory

The project is structured as a monorepo containing two main folders:
- `backend/`: The Node.js, Express, and MongoDB backend application.
- `frontend/`: The React, Vite, and Tailwind CSS frontend application.
- `doc/`: Contains project documentation, including this guide.

---

## Backend (`/backend`)

The backend follows the **Model-View-Controller (MVC)** architectural pattern to cleanly separate data, logic, and output.

* **`server.js`**
  The entry point for the backend. It initializes the Express application, sets up global middleware (like CORS and JSON parsing), connects to the database, mounts API routes, and starts the server listening on a port.

* **`.env`**
  Contains environment variables such as the `PORT` and `MONGO_URI` (database connection string). Note: This file should usually be `.gitignore`d in real projects.

* **`config/db.js`**
  Contains the configuration and logic required to establish a connection to the MongoDB database using Mongoose.

* **`models/` (The 'M' in MVC)**
  Contains Mongoose schema definitions. These files dictate the structure of the data stored in the database.
  * *Example: `userModel.js` defines the properties a User has (name, email, password).*

* **`controllers/` (The 'C' in MVC)**
  Contains the core business logic. Controllers receive requests from the routes, query or modify data using the Models, and send the corresponding HTTP response back to the client.
  * *Example: `userController.js` has functions to fetch all users or register a new user.*

* **`routes/` (The 'V'/'Routes' in MVC)**
  Defines the API endpoints. These files map specific HTTP methods (GET, POST, etc.) and URLs (e.g., `/api/users/`) to their respective functions in the Controllers.
  * *Example: `userRoutes.js` delegates the `/api/users` endpoint to the `userController`.*

* **`middleware/`**
  Contains custom functions that intercept HTTP requests before they reach the controllers.
  * *Example: `errorMiddleware.js` catches errors thrown anywhere in the application and formats them into a consistent JSON response for the frontend.*

---

## Frontend (`/frontend`)

The frontend is a Single Page Application (SPA) built with React, bundled with Vite, styled via Tailwind CSS v4, and utilizing Redux Toolkit for centralized state management.

* **`index.html`**
  The main HTML entry point. The Vite bundler injects the React application into the `<div id="root"></div>` found here.

* **`vite.config.js`**
  Configuration file for Vite, enabling React and the Tailwind CSS v4 plugin.

* **`package.json`**
  Defines frontend dependencies, project metadata, and scripts (like `npm run dev`).

### `/frontend/src`
This directory holds all the React application source code.

* **`main.jsx`**
  The root React entry point. It wraps the entire application in a Redux `<Provider>` and mounts it to the DOM.

* **`App.jsx`**
  The central root component that configures `react-router-dom`. It defines which UI components should be displayed based on the current URL path.

* **`index.css`**
  The global stylesheet. It imports Tailwind CSS and can be used to set base CSS variables or global overrides.

* **`components/`**
  Contains reusable UI building blocks that can be shared across multiple pages.
  * *Example: `Header.jsx` is the navigation bar included at the top of the app, connecting to Redux to display whether a user is logged in.*

* **`pages/`**
  Contains larger cohesive views that represent entire distinct web pages accessed via the router.
  * *Example: `Home.jsx` is the landing page.*
  * *Example: `About.jsx` provides project details.*

* **`store/`**
  Contains everything related to global state management using Redux Toolkit.
  * **`store.js`**: The central setup file that configures Redux and combines the various state slices into one global store.
  * **`slices/`**: Contains individual pieces of state logic grouped by feature.
    * *Example: `authSlice.js` manages authentication state (e.g., the current user object and whether they are logged in) and provides reducers like `login()` and `logout()`.*
