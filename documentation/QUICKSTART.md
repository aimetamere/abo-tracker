# Quickstart Guide - Local Installation Instructions

This guide provides step-by-step instructions for setting up and running the Subscription Tracker application on a local development environment.

## Prerequisites

Before beginning the installation process, ensure the following requirements are met:

, **Node.js** version 20 or higher installed
, **MongoDB Atlas account** (free tier is sufficient)
, **Code editor** (Visual Studio Code recommended)
, **Git** for repository cloning
, **Terminal/Command line** access

## Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
# Navigate to your desired project directory
cd ~/Desktop

# Clone the repository
git clone https://github.com/aimetamere/abo-tracker.git

# Navigate into the project directory
cd abo-tracker
```

Alternatively, download the project files and extract them to a directory of your choice.

## Step 2: Install Dependencies

Install all required Node.js packages using npm or yarn:

```bash
npm install
```

```bash
yarn install
```

This command installs all dependencies listed in `package.json`, including Express, Mongoose, bcrypt, and other required packages. The installation process may take several minutes. Wait for completion before proceding.

## Step 3: Configure MongoDB Atlas

A MongoDB database is required for storing user and subscription data. Set up MongoDB Atlas as follows:

1. Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account
2. Create a new cluster using the free tier option, more than enough.
3. Once the cluster is created, select "Connect" → "Connect the application"
4. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/...`)
5. Configure network access: "Network Access" → "Add IP Address" → Select "Allow Access from Anywhere" for development purposes

Save the connection string for use in the next step.

## Step 4: Configure Environment Variables

Create a `.env.local` file in the project root directory to store configuration values:

```bash
# On Mac/Linux
nano .env.local

# Or create the file using your preferred text editor
```

Add the following configuration template and replace placeholder values with your actual credentials:

```env
NODE_ENV=development
PORT=5501
SERVER_URL=http://localhost:5501

# MongoDB connection string from Atlas
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/abo-tracker?retryWrites=true&w=majority

# JWT secret key (generate using: openssl rand -base64 32)
JWT_SECRET=your-super-secret-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Arcjet configuration (rate limiting and bot protection)
ARCJET_ENV=DEVELOPMENT
ARCJET_KEY=your-arcjet-key-here

# Upstash QStash configuration (workflow scheduling)
QSTASH_TOKEN=your-qstash-token-here
QSTASH_URL=https://qstash.upstash.io

# Email configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**Configuration Notes:**
, Do not use quotes around environment variable values
, Ensure no spaces around the `=` operator
, For Gmail authentication, create an App Password following Google's documentation
, Generate a secure random string for `JWT_SECRET` using cryptographic methods

## Step 5: Obtain Required API Keys

Several external services require API keys for full functionality:

### Arcjet API Key
1. Register an account at [Arcjet](https://arcjet.com)
2. Create a new project
3. Retrieve the API key from the project dashboard
4. Add the key to `.env.local` as `ARCJET_KEY`

### Upstash QStash Token
1. Access the [Upstash Console](https://console.upstash.com/)
2. Create a new QStash project
3. Copy the QStash token (prefixed with `qst_`)
4. Add the token to `.env.local` as `QSTASH_TOKEN`

### Gmail App Password
1. Access Google Account settings
2. Navigate to Security → Enable 2-Step Verification if not already enabled
3. Go to App Passwords → Generate a new app password
4. Use the generated app password for `EMAIL_PASSWORD` (not your regular Gmail password)

## Step 6: Start the Development Server

Execute one of the following commands to start the server:

```bash
# Development mode with auto-reload (recommended)
npm run dev

# Standard mode
npm start
```

Expected output should indicate successful startup:

```
Server running on http://localhost:5501
Connected to database in development mode
```

If errors occur, verify:
, MongoDB connection string accuracy
, All environment variables are properly configured
, Port 5501 is not already in use by another process

## Step 7: Access the Application

Once the server is running, open a web browser and navigate to:

```
http://localhost:5501
```

The subscription tracker homepage should be displayed. Test the application by creating a user account to verify functionality.

## Troubleshooting Common Issues

### Database Connection Errors

**Error:** "Cannot connect to database"

**Solutions:**
, Verify MongoDB Atlas IP whitelist includes your current IP address
, Confirm the connection string is correctly formated without typographical errors
, Ensure the MongoDB cluster is running and accessible

### Port Conflicts

**Error:** "Port already in use"

**Solutions:**
, Another process is using port 5501
, Modify `PORT` in `.env.local` to an alternative port (e.g., `PORT=3000`)
, Terminate the process using the port or identify it using system-specific commands

### Missing Environment Variables

**Error:** "QSTASH_TOKEN is required" or similar

**Solutions:**
, Confirm `.env.local` exists in the project root directory (not `.env` or `.env.development.local`)
, Verify the file is located in the same directory as `package.json`
, Restart the server after creating or modifying environment variables

### Email Delivery Issues

**Error:** Emails not being sent

**Solutions:**
, Verify Gmail App Password is used (not the regular account password)
, Confirm 2-Step Verification is enabled on the Google account
, Check spam/junk folders for delievered emails

## Next Steps

After successful local installation:

1. **Test Authentication Flow**, Create a user account and verify sign-up functionality
2. **Create Test Subscription**, Subscribe to "Nico's Photos" to test subscription creation
3. **Inspect Database**, Review data in MongoDB Atlas to confirm proper storage
4. **Review Backend Documentation**, Access "Backend Explanation" page for technical implementation details

## Project Structure

The application follows a standard Express.js MVC structure:

, `app.js`, Application entry point and server configuration
, `config/`, Configuration modules (database, email, external services)
, `controllers/`, Request handlers containing business logic
, `routes/`, API endpoint definitions
, `models/`, Mongoose schemas (User, Subscription)
, `middlewares/`, Authentication, error handling, security middleware
, `public/`, Static frontend assets (HTML, CSS, JavaScript)
, `utils/`, Utility functions (email templates, error responses)

## Additional Resources

For further assistance:

1. Review terminal error messages for specific error details
2. Consult documentation files in the `documentation/` directory
3. Inspect browser console (F12) for client-side errors
4. Verify all environment variables are correctly configured

## Development Recommendations

, Use `npm run dev` for development to enable automatic server restart on file changes
, Never commit `.env.local` to version control (ensure it is in `.gitignore`)
, Test functionality incrementally rather than attempting comprehensive testing simultaneously
, Refer to the backend explanation page for detailed implementation information

## Conclusion

Following these instructions should result in a functional local development environment. Most common issues come from incorrect environment variable configuration or database connection problems, which I personally experienced. Verify each step carefully before proceeding to the next, also variables name.
