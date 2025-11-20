# Subscription Tracker

A full-stack web application that helps you keep track of your subscriptions and never miss a renewal date. This project lets users sign up, create subscriptions, and automatically receive email reminders before their subscriptions renew.

## What This Project Does

This is a subscription reminder system built with Node.js and Express. Users can create accounts, add their subscriptions with details like price, frequency, and payment method, and the system automatically calculates renewal dates and sends email reminders. The reminders are scheduled using Upstash QStash workflows, which means they run reliably even if your server restarts.

The application includes user authentication with JWT tokens, secure API routes protected by middleware, and a clean frontend interface for managing subscriptions. Everything is connected to a MongoDB database for persistent storage.

## Features

User authentication with secure password hashing, subscription management with automatic renewal date calculation, email reminders sent before renewal dates, protected API routes with JWT authentication, responsive design that works on mobile and desktop, and automated workflow scheduling using Upstash QStash.

## Tech Stack

The backend is built with Node.js and Express, using MongoDB with Mongoose for data storage. Authentication is handled with JWT tokens and bcrypt for password hashing. Email functionality uses Nodemailer with Gmail SMTP. Workflow scheduling is powered by Upstash QStash. Security features include Arcjet for rate limiting and bot protection. The frontend is vanilla HTML, CSS, and JavaScript served as static files from the Express server.

## Getting Started

To run this project locally, you'll need Node.js version 20 or higher installed on your machine. You'll also need a MongoDB Atlas account for the database, and accounts with Arcjet and Upstash for the security and workflow features.

First, clone the repository to your local machine. Then install all the dependencies by running npm install in the project directory. Next, create a `.env.local` file in the root directory and add your environment variables. You'll need to set up MongoDB Atlas and get a connection string, create accounts with Arcjet and Upstash to get API keys, and configure Gmail SMTP for email sending.

Once your environment variables are configured, you can start the development server with `npm run dev` if you have nodemon installed, or `npm start` to run it normally. The application will be available at `http://localhost:5501`.

For detailed setup instructions, check out the [Quickstart Guide](documentation/QUICKSTART.md) which walks through each step in detail.

## Project Structure

The project is organized with a clear separation between frontend and backend code. The `src/` directory contains all backend logic, including controllers for handling business logic, routes for API endpoints, models for database schemas, middlewares for authentication and error handling, config files for third-party services, and database connection setup.

The `public/` directory contains the frontend files, including the main HTML page, JavaScript for client-side logic, and CSS for styling. The `documentation/` folder has guides for deployment, environment setup, and troubleshooting. See the [Documentation](#documentation) section below for links to all available guides.

## Environment Variables

You'll need to configure several environment variables for the application to work properly. These include database connection strings, JWT secrets for authentication, API keys for Arcjet and Upstash, email credentials for sending reminders, and server configuration like port numbers and URLs.

All environment variables should be stored in a `.env.local` file for development, or `.env` for production. Never commit these files to version control as they contain sensitive information.

## API Endpoints

The application exposes several REST API endpoints for managing users and subscriptions. Authentication endpoints include sign up, sign in, and sign out. Subscription endpoints allow creating new subscriptions, getting all subscriptions for a user, and deleting subscriptions. User endpoints provide access to user information.

All subscription and user management endpoints require authentication via JWT tokens passed in the Authorization header. The API follows RESTful conventions and returns JSON responses with consistent error handling.

## How It Works

When a user creates a subscription, the backend validates the data, calculates the renewal date based on the frequency selected, and saves it to MongoDB. It then schedules an Upstash QStash workflow that will trigger email reminders at specific intervals before the renewal date.

The workflow system sends reminders 7 days, 5 days, 2 days, and 1 day before the renewal date. Each reminder is sent via email using Nodemailer, with personalized content based on the subscription details.

User authentication works by hashing passwords with bcrypt before storing them, and issuing JWT tokens upon successful login. These tokens are then used to authenticate subsequent API requests, with middleware checking the token validity before allowing access to protected routes.

## Documentation

This project includes comprehensive documentation to help you get started, deploy, and troubleshoot issues. All documentation files are located in the `documentation/` directory:

**[Quickstart Guide](documentation/QUICKSTART.md)** - Step-by-step instructions for setting up the application locally, including prerequisites, installation, and configuration.

**[Deployment Guide](documentation/DEPLOYMENT.md)** - Complete guide for deploying the application to a Hostinger VPS, including PM2 setup, Nginx configuration, and production environment setup.

**[Environment Setup](documentation/SETUP_ENV.md)** - Instructions for configuring environment variables on your VPS server, including creating the `.env` file and setting up all required credentials.

**[VPS Troubleshooting](documentation/VPS_FIX.md)** - Quick fix guide for common VPS deployment issues, including environment variable loading problems and server accessibility issues.

**[Diagnostic Guide](documentation/DIAGNOSTIC.md)** - Troubleshooting guide for diagnosing server accessibility issues, including firewall configuration and network connectivity checks.

**[Route Fix Guide](documentation/ROUTE_FIX.md)** - Guide for deploying route-related fixes and ensuring API endpoints are properly configured.

**[Contributing Guide](documentation/CONTRIBUTING.md)** - Guide for contributors, including instructions for using the subscription logic only version without the frontend.

## Deployment

The application can be deployed to a VPS or cloud hosting service. See the [Deployment Guide](documentation/DEPLOYMENT.md) for detailed instructions on deploying to a Hostinger VPS, including setting up PM2 for process management, configuring Nginx as a reverse proxy, and setting up environment variables for production.

For troubleshooting deployment issues, check the [VPS Troubleshooting](documentation/VPS_FIX.md) and [Diagnostic Guide](documentation/DIAGNOSTIC.md) which cover common problems and solutions.

## Development

During development, the application uses nodemon to automatically restart the server when files change. The codebase follows a modular structure with clear separation of concerns, making it easy to add new features or modify existing ones.

Error handling is implemented throughout the application using custom error middleware that provides consistent error responses. The application also includes request logging and security middleware to protect against common attacks.

## Contributing

This project was built as a learning exercise for backend development concepts including REST APIs, authentication, database operations, and workflow scheduling. Feel free to explore the codebase and use it as a reference for similar projects.

## License

This project is private and intended for educational purposes.
