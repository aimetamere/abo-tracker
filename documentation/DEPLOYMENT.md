# Quick Deployment Guide for Hostinger VPS

## Prerequisites
- Hostinger VPS with SSH access
- Domain name (optional but recommended)
- MongoDB Atlas account (free tier) - [Sign up here](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Install Node.js and PM2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Verify installation
node --version
npm --version
pm2 --version
```

---

## Step 2: Install Nginx

```bash
sudo apt install -y nginx
```

---

## Step 3: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
2. Click "Connect" → "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
4. Go to "Network Access" → "Add IP Address" → Add your VPS IP (or `0.0.0.0/0` for testing)
5. Save the connection string - you'll need it in Step 5

---

## Step 4: Clone and Install Dependencies

```bash
# Navigate to web directory
cd /var/www

# Clone your repository (replace with your GitHub URL)
git clone https://github.com/yourusername/abo-tracker.git
cd abo-tracker

# Install dependencies
npm install --production
```

---

## Step 5: Create Environment File

```bash
# Create production environment file
nano .env.production.local
```

### Migration from Development to Production

**You can copy most values from your `.env.development.local`, but you need to change:**

1. **MongoDB (DB_URI)** - Copy as-is from development
2. **JWT_SECRET** - Copy as-is from development (or generate new one for extra security)
3. **JWT_EXPIRES_IN** - Copy as-is from development
4. **ARCJET_KEY** - Copy as-is from development
5. **QSTASH_TOKEN** - Copy as-is from development
6. **EMAIL_USER** - Copy as-is from development
7. **EMAIL_PASSWORD** - Copy as-is from development
8. **SERVER_URL** - **MUST CHANGE** from ngrok URL to your real domain
9. **ARCJET_ENV** - Change from `DEVELOPMENT` to `PRODUCTION`
10. **NODE_ENV** - Change from `development` to `production`

### Production Environment File Template

**Copy this template and fill in your values from development:**

```env
NODE_ENV=production
PORT=5501
SERVER_URL=https://yourdomain.com

# Copy from .env.development.local
DB_URI=your-mongodb-connection-string-from-development

# Copy from .env.development.local (or generate new: openssl rand -base64 32)
JWT_SECRET=your-jwt-secret-from-development
JWT_EXPIRES_IN=7d

# Change to PRODUCTION, copy key from development
ARCJET_ENV=PRODUCTION
ARCJET_KEY=your-arcjet-key-from-development

# Copy from .env.development.local
QSTASH_TOKEN=your-qstash-token-from-development
QSTASH_URL=https://qstash.upstash.io

# Copy from .env.development.local
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-from-development
```

### Example Migration

**Your Development (.env.development.local):**
```env
NODE_ENV=development
SERVER_URL=https://sheathier-unconfiscable-laurette.ngrok-free.dev/
DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/abo-tracker
JWT_SECRET=your-secret-key
ARCJET_ENV=DEVELOPMENT
ARCJET_KEY=your-key
QSTASH_TOKEN=your-token
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

**Your Production (.env.production.local) - Copy and Change:**
```env
NODE_ENV=production
PORT=5501
SERVER_URL=https://yourdomain.com

DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/abo-tracker
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

ARCJET_ENV=PRODUCTION
ARCJET_KEY=your-key

QSTASH_TOKEN=your-token
QSTASH_URL=https://qstash.upstash.io

EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

**Important Changes:**
- Replace `https://sheathier-unconfiscable-laurette.ngrok-free.dev/` with `https://yourdomain.com`
- Change `ARCJET_ENV` from `DEVELOPMENT` to `PRODUCTION`
- Change `NODE_ENV` from `development` to `production`
- Everything else can be copied from development

**Save the file:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## Step 6: Start Application with PM2

```bash
# Start the application
pm2 start app.js --name abo-tracker

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot (run the command it outputs)
pm2 startup

# Check status
pm2 status
pm2 logs abo-tracker
```

---

## Step 7: Configure Nginx

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/abo-tracker
```

**Paste this configuration (replace `yourdomain.com` with your domain):**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5501;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/abo-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 8: Set Up SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts (enter your email, agree to terms)
```

Certbot will automatically configure SSL and update your Nginx config.

---

## Step 9: Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Step 10: Update Domain DNS

1. Go to your domain registrar (where you bought the domain)
2. Add an A record:
   - **Type:** A
   - **Name:** @ (or leave blank)
   - **Value:** Your VPS IP address
   - **TTL:** 3600 (or default)
3. Add another A record for www:
   - **Type:** A
   - **Name:** www
   - **Value:** Your VPS IP address
   - **TTL:** 3600

**Wait 5-10 minutes for DNS to propagate**

---

## Step 11: Test Your Deployment

```bash
# Test locally
curl http://localhost:5501

# Check PM2 logs
pm2 logs abo-tracker

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

**Visit your domain in a browser:** `https://yourdomain.com`

---

## Quick Reference Commands

```bash
# Restart application
pm2 restart abo-tracker

# View logs
pm2 logs abo-tracker

# Stop application
pm2 stop abo-tracker

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# Check PM2 status
pm2 status
```

---

## Troubleshooting

### Application won't start
```bash
pm2 logs abo-tracker
# Check for errors in the logs
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Can't connect to MongoDB
- Verify MongoDB Atlas IP whitelist includes your VPS IP
- Check connection string format in `.env.production.local`

### QStash not working
- Ensure `SERVER_URL` in `.env.production.local` is your public domain (not localhost)
- Verify domain is accessible: `curl https://yourdomain.com`

---

## Update Application (After Code Changes)

```bash
cd /var/www/abo-tracker
git pull origin main
npm install --production
pm2 restart abo-tracker
```

---

## Important Notes

1. **SERVER_URL** must be your public domain (e.g., `https://yourdomain.com`) - QStash needs this to reach your server
2. **Never commit** `.env.production.local` to Git
3. **MongoDB Atlas** - Make sure your VPS IP is whitelisted
4. **SSL certificates** auto-renew every 90 days via Certbot

---

## That's It!

Your application should now be live at `https://yourdomain.com`

If you encounter any issues, check the logs:
- Application: `pm2 logs abo-tracker`
- Nginx: `sudo tail -f /var/log/nginx/error.log`
