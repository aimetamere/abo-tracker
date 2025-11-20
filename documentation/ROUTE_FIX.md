# Route Fix - Deploy Updated Code

## Issues Fixed:

1. **Frontend API URL** - Now auto-detects server (was hardcoded to localhost)
2. **CORS Support** - Added CORS headers for API requests
3. **Route Order** - API routes now come before static files

## On Your VPS - Deploy the Fix:

```bash
# Navigate to your project
cd /var/www/abo-tracker

# Pull the latest code from GitHub
git pull origin main
# (or whatever branch you're using)

# Restart the application
pm2 restart abo-tracker

# Check logs to verify it's working
pm2 logs abo-tracker --lines 50
```

## Test the Routes:

```bash
# Test API endpoint directly
curl http://72.62.38.240:5501/api/v1/auth/sign-up

# Should return something (even if it's an error about missing data, that means the route works!)

# Test from browser
# Visit: http://72.62.38.240:5501
# Try to sign up or sign in
```

## If Routes Still Don't Work:

### Check 1: Verify PM2 is Running
```bash
pm2 status
# Should show abo-tracker as "online"
```

### Check 2: Check Application Logs
```bash
pm2 logs abo-tracker
# Look for any errors
```

### Check 3: Test Server Directly
```bash
# Test if server responds
curl http://localhost:5501

# Test API endpoint
curl -X POST http://localhost:5501/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@test.com","password":"test123"}'
```

### Check 4: Verify Environment Variables
```bash
# Check if .env.production.local exists
ls -la .env.production.local

# View first few lines (don't show passwords!)
head -5 .env.production.local
```

### Check 5: Check Nginx Configuration (if using Nginx)
```bash
# If you're using Nginx, check the config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Expected Behavior After Fix:

1. Visiting `http://72.62.38.240:5501` should show your app
2. Sign up form should work
3. Sign in form should work
4. API calls should go to `/api/v1/auth/sign-up` etc.

## If Still Having Issues:

Share the output of:
```bash
pm2 logs abo-tracker --lines 100
```

