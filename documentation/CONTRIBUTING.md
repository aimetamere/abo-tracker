# Contributing Guide

This guide explains how to contribute to the Subscription Tracker project and how to use specific versions of the codebase for different purposes.

## Using Subscription Logic Only

If you are interested in using only the backend subscription logic without the frontend components, you should use a specific commit version that contains the core subscription management functionality without the frontend interface.

### Getting the Subscription Logic Only Version

To get the version with subscription logic only (without frontend), checkout the following commit:

```bash
git checkout 82b0eaf9bb1e7f69caabc9b788f232491a50c246
```

This commit contains:
- Complete backend subscription management logic
- API routes for subscription CRUD operations
- Database models for subscriptions
- Authentication and middleware setup
- Workflow scheduling with Upstash QStash
- Email reminder functionality

This version does not include:
- Frontend HTML, CSS, and JavaScript files
- Public-facing user interface
- Client-side form handling

### Why Use This Version

This commit is useful if you want to:
- Integrate subscription management into your own application
- Use the backend API with a different frontend framework
- Build a mobile app that consumes the subscription API
- Create a custom admin interface
- Use the subscription logic as a microservice

### What's Included

The subscription logic includes:
- User authentication with JWT tokens
- Subscription creation with automatic renewal date calculation
- Subscription retrieval for authenticated users
- Subscription deletion with ownership verification
- Email reminder scheduling via Upstash QStash workflows
- MongoDB database models and schemas
- RESTful API endpoints under `/api/v1/subscriptions`

### API Endpoints Available

Once you checkout this commit, you'll have access to these endpoints:

- `POST /api/v1/auth/sign-up` - Create a new user account
- `POST /api/v1/auth/sign-in` - Authenticate and get JWT token
- `POST /api/v1/subscriptions` - Create a new subscription (requires auth)
- `GET /api/v1/subscriptions/user/:id` - Get all subscriptions for a user (requires auth)
- `DELETE /api/v1/subscriptions/:id` - Delete a subscription (requires auth)

### Setting Up the Backend Only Version

1. Checkout the specific commit:
   ```bash
   git checkout 82b0eaf9bb1e7f69caabc9b788f232491a50c246
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables in `.env.local`:
   - MongoDB connection string
   - JWT secret key
   - Upstash QStash token
   - Email credentials for Nodemailer
   - Arcjet API key

4. Start the server:
   ```bash
   npm start
   ```

5. The API will be available at `http://localhost:5501/api/v1/`

### Integrating with Your Frontend

Since this version doesn't include a frontend, you'll need to build your own client application. The API expects:

- JWT tokens in the `Authorization` header: `Bearer <token>`
- JSON request bodies for POST requests
- Standard HTTP status codes for responses

Example API call:
```javascript
// Create a subscription
const response = await fetch('http://localhost:5501/api/v1/subscriptions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${yourJWTToken}`
  },
  body: JSON.stringify({
    name: 'My Subscription',
    price: 49.99,
    currency: 'EUR',
    frequency: 'monthly',
    category: 'photos',
    paymentMethod: 'Credit Card',
    startDate: '2025-01-01'
  })
});
```

### Current Version vs Subscription Logic Only

The current version of the project includes:
- Full frontend interface with HTML, CSS, and JavaScript
- User-friendly forms and dashboard
- Complete user experience flow

The commit `82b0eaf9bb1e7f69caabc9b788f232491a50c246` includes:
- Backend API only
- Subscription management logic
- Authentication system
- Workflow scheduling
- No frontend components

Choose the version that best fits your needs. If you want to build your own interface or integrate with an existing application, use the subscription logic only version. If you want a complete working application with a user interface, use the latest version.

### Questions or Issues

If you encounter any issues when using the subscription logic only version, or if you need help integrating it into your project, please refer to the other documentation files in this directory:
- [Quickstart Guide](QUICKSTART.md) for setup instructions
- [Environment Setup](SETUP_ENV.md) for configuration details
- [Deployment Guide](DEPLOYMENT.md) for production deployment

