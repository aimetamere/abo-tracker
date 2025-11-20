# Quick Fix for VPS Environment Variables

## The Problem
Your app is crashing because environment variables aren't loading. The `.env` file is missing or PM2 isn't configured correctly.

## Step-by-Step Fix

### 1. SSH into your VPS
```bash
ssh root@72.62.38.240
```

### 2. Navigate to your project directory
```bash
cd /root/abo-tracker
# (or wherever your project is located)
```

### 3. Create the `.env` file
```bash
nano .env
```

### 4. Copy this template and fill in YOUR values important your values:

```env
NODE_ENV=production
PORT=5501
SERVER_URL=http://72.62.38.240:5501

DB_URI=your-mongodb-connection-string-here
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

ARCJET_ENV=PRODUCTION
ARCJET_KEY=your-arcjet-key-here

QSTASH_TOKEN=your-qstash-token-here
QSTASH_URL=https://qstash.upstash.io

EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here
```

**Important:**
- Replace ALL placeholder values with your actual credentials
- NO spaces around the `=` sign
- NO quotes around values
- Copy values from your local `.env.local` file

### 5. Save the file
- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

### 6. Verify the file exists
```bash
ls -la .env
cat .env  # Check if it shows your values (be careful - don't share this output!)
```

### 7. Restart PM2 with NODE_ENV set
```bash
# Stop the current process
pm2 stop abo-tracker

# Delete the old process
pm2 delete abo-tracker

# Start with NODE_ENV=production explicitly set
NODE_ENV=production pm2 start app.js --name abo-tracker

# Save PM2 configuration
pm2 save
```

### 8. Check the logs
```bash
pm2 logs abo-tracker --lines 50
```

### 9. What to look for in logs:
✅ **Good signs:**
- `Loaded from: .env`
- `DB_URI: SET`
- `QSTASH_TOKEN: SET`
- `Connected to database in production mode`
- `Server running on http://0.0.0.0:5501`

❌ **Bad signs:**
- `Loaded from: .env (default)` - means .env file not found
- `DB_URI: MISSING` - .env file not loading
- `DB_URI not defined` - .env file missing or wrong path

## If It Still Doesn't Work

### Option A: Check file location
```bash
pwd  # Should show /root/abo-tracker (or your project path)
ls -la | grep .env  # Should show .env file
```

### Option B: Use PM2 ecosystem file (more reliable)

Create `ecosystem.config.js` in your project root:

```bash
nano ecosystem.config.js
```

Paste this:
```javascript
module.exports = {
  apps: [{
    name: 'abo-tracker',
    script: 'app.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5501,
      SERVER_URL: 'http://72.62.38.240:5501',
      // Add all your other env vars here OR use env_file
    },
    env_file: '.env',  // This tells PM2 to load .env file
  }]
};
```

Then restart:
```bash
pm2 delete abo-tracker
pm2 start ecosystem.config.js
pm2 save
```

### Option C: Set environment variables directly in PM2
```bash
pm2 delete abo-tracker
pm2 start app.js --name abo-tracker --update-env --env production
pm2 save
```

## Quick Test
```bash
# Test if server responds
curl http://localhost:5501

# Check PM2 status
pm2 status

# View real-time logs
pm2 logs abo-tracker
```

## Need Your Local Values?

If you don't have your local `.env.local` file values, you'll need to:
1. Check MongoDB Atlas for `DB_URI`
2. Check Arcjet dashboard for `ARCJET_KEY`
3. Check Upstash Console for `QSTASH_TOKEN`
4. Use your Gmail app password for `EMAIL_PASSWORD`

