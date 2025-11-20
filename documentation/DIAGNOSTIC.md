# Diagnostic Guide - Server Not Accessible

## What I Fixed:

1. **Route Order Issue** - Root route (`/`) was defined after error middleware, now fixed
2. **Error Middleware Placement** - Moved to the end (must be last)
3. **Arcjet Error Handling** - Now continues instead of blocking if Arcjet fails
4. **Added Health Check** - `/health` endpoint to test server
5. **Added Request Logging** - To see what requests are coming in

## Steps to Diagnose:

### 1. Restart Your Server

```bash
pm2 restart abo-tracker
pm2 logs abo-tracker --lines 50
```

### 2. Test Health Endpoint

```bash
# From your VPS machine
curl http://72.62.38.240:5501/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "database": "connected" or "disconnected"
}
```

### 3. Test Root Route

```bash
# From your VPS
curl http://localhost:5501

# Should return HTML content
```

### 4. Check Server Logs

Watch the logs to see incoming requests:

```bash
pm2 logs abo-tracker --lines 100
```

You should see logs like:
```
2024-... - GET / - IP: ::ffff:...
2024-... - GET /health - IP: ::ffff:...
```

### 5. Check What Port Server is Listening On

```bash
netstat -tuln | grep 5501
# Should show: tcp  0  0  0.0.0.0:5501  ...
```

If it shows `127.0.0.1:5501` instead of `0.0.0.0:5501`, that is a problem oups!

### 6. Check Firewall

```bash
sudo ufw status
sudo ufw allow 5501/tcp
sudo ufw reload
```

### 7. Test from Browser

Try accessing:
- `http://72.62.38.240:5501`
- `http://72.62.38.240:5501/health`

## Common Issues:

### Issue: "Connection Refused"
- **Cause**: Server not running or firewall blocking
- **Fix**: Check PM2 status, check firewall

### Issue: "Timeout" or "No Response"
- **Cause**: Server running but not listening on 0.0.0.0
- **Fix**: Check netstat output, verify app.js listens on '0.0.0.0'

### Issue: "403 Forbidden" from Arcjet
- **Cause**: Arcjet blocking requests
- **Fix**: Check Arcjet logs, temporarily disable Arcjet middleware to test

### Issue: Server responds locally but not externally
- **Cause**: Firewall or server listening on 127.0.0.1 only
- **Fix**: Check firewall, verify server listens on 0.0.0.0

## Quick Test Commands:

```bash
# 1. Check if server is running
pm2 status

# 2. Check logs
pm2 logs abo-tracker

# 3. Test locally
curl http://localhost:5501/health

# 4. Check port
netstat -tuln | grep 5501

# 5. Check firewall
sudo ufw status

# 6. Restart server
pm2 restart abo-tracker
```

## If Still Not Working:

Share the output of these commands:
```bash
pm2 logs abo-tracker --lines 50
netstat -tuln | grep 5501
curl -v http://localhost:5501/health
```

