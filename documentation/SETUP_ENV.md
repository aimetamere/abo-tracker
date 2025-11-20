# Quick Setup: Create .env.production.local on VPS server

## On the VPS Server, Run These Commands:

```bash
# Navigate to your project directory
cd /var/www/abo-tracker
# (or wherever your project is cloned)

# To create the production environment file
nano .env.production.local
```

## Copy and Paste This Template: 
# (or if built before end locally your .env.local file)

**Replace the values with your actual credentials from development:**

```env
NODE_ENV=production
PORT=5501
SERVER_URL=http://72.62.38.240

DB_URI=your-mongodb-connection-string-from-development

JWT_SECRET=your-jwt-secret-from-development
JWT_EXPIRES_IN=7d

ARCJET_ENV=PRODUCTION
ARCJET_KEY=your-arcjet-key-from-development

QSTASH_TOKEN=your-qstash-token-from-development
QSTASH_URL=https://qstash.upstash.io

EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-from-development
```

## Save the File:

1. Press `Ctrl+X`
2. Press `Y` to confirm
3. Press `Enter` to save

## Restart the Application:

```bash
pm2 restart abo-tracker
pm2 logs abo-tracker
```

## Verify It's Working:

```bash
# Check if server is running
curl http://localhost:5501

# Check PM2 logs for any errors
pm2 logs abo-tracker --lines 50
```

---

## Important Notes:

1. **Copy values from your `.env.development.local`** file (from your local machine)
2. **SERVER_URL** should be `http://72.62.38.240` (your VPS IP) for now
3. **All other values** can be copied exactly from development
4. Make sure **no spaces** around the `=` sign
5. Make sure **no quotes** around values (unless the value itself contains spaces)

---

## If You Don't Have the Values:

1. **MongoDB (DB_URI)**: Check your MongoDB Atlas dashboard → Connect → Get connection string
2. **JWT_SECRET**: Copy from your local `.env.development.local` file
3. **ARCJET_KEY**: Copy from your local `.env.development.local` file
4. **QSTASH_TOKEN**: Copy from your local `.env.development.local` file or get from [Upstash Console](https://console.upstash.com/qstash)
5. **EMAIL_USER & EMAIL_PASSWORD**: Copy from your local `.env.development.local` file

