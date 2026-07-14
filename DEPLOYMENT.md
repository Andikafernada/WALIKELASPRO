# 🚀 Deployment Guide - WALIKELASPRO ke walas.my.id

## Prerequisites

1. VPS/Server dengan Ubuntu/Debian
2. Domain: `walas.my.id` sudah dikonfigurasi di Cloudflare
3. Node.js 18+ terinstall
4. Nginx terinstall
5. PM2 atau systemd untuk process management

---

## Langkah 1: Persiapan Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2 untuk process management
sudo npm install -g pm2
```

---

## Langkah 2: Buat User untuk App

```bash
# Buat user
sudo adduser walas
sudo usermod -aG www-data walas

# Buat directory
sudo mkdir -p /var/www/walas.my.id
sudo chown walas:www-data /var/www/walas.my.id
```

---

## Langkah 3: Upload Project ke Server

**Opsi A: Git Clone**
```bash
sudo -u walas git clone https://github.com/Andikafernada/WALIKELASPRO.git /var/www/walas.my.id
```

**Opsi B: Rsync dari lokal**
```bash
# Di komputer lokal, jalankan:
rsync -avz --exclude 'node_modules' --exclude '.git' /path/to/WALIKELASPRO/ walas@YOUR_SERVER_IP:/var/www/walas.my.id/
```

---

## Langkah 4: Install Dependencies & Build

```bash
cd /var/www/walas.my.id

# Install dependencies
npm install

# Build untuk production
npm run build
```

---

## Langkah 5: Konfigurasi Environment

```bash
# Buat file .env production
sudo nano /var/www/walas.my.id/.env
```

```env
APP_NAME=WALIKELASPRO
APP_ENV=production
APP_DEBUG=false
APP_URL=https://walas.my.id
PORT=3000
HOST=127.0.0.1
NODE_ENV=production
```

---

## Langkah 6: Konfigurasi PM2

```bash
# Buat ecosystem file
sudo nano /var/www/walas.my.id/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'walaspro',
    script: 'dist/server.js',
    cwd: '/var/www/walas.my.id',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

```bash
# Start dengan PM2
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup
```

---

## Langkah 7: Konfigurasi Nginx

```bash
# Copy nginx config
sudo cp /var/www/walas.my.id/deploy/nginx.conf /etc/nginx/sites-available/walas.my.id

# Enable site
sudo ln -s /etc/nginx/sites-available/walas.my.id /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## Langkah 8: Konfigurasi Cloudflare

Di Cloudflare Dashboard:

1. **DNS Settings** - Tambahkan record:
   ```
   Type: A
   Name: walas
   Content: YOUR_SERVER_IP
   Proxy: ✅ Proxied (orange cloud)
   ```

2. **SSL/TLS Settings** - Set ke **Full** atau **Full (Strict)**

3. **Page Rules** (optional):
   ```
   If URL matches: walas.my.id/*
   Then settings: Cache Level = Standard
   ```

---

## Langkah 9: Firewall (UFW)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Langkah 10: Verifikasi Deployment

```bash
# Cek status PM2
sudo pm2 status

# Cek nginx
sudo systemctl status nginx

# Test endpoint
curl http://localhost:3000/api/auth/me
```

Buka browser: **https://walas.my.id**

---

## 🔧 Troubleshooting

### App tidak bisa diakses
```bash
# Cek log PM2
sudo pm2 logs walaspro

# Restart app
sudo pm2 restart walaspro
```

### SSL Error
Pastikan Cloudflare SSL设置为Full或Full Strict

### 502 Bad Gateway
```bash
# Pastikan app running
sudo pm2 status

# Cek port 3000
sudo lsof -i :3000
```

### Update App
```bash
cd /var/www/walas.my.id
git pull
npm install
npm run build
sudo pm2 restart walaspro
```

---

## 📊 Monitor

```bash
# Monitor real-time
sudo pm2 monit

# Log files
sudo pm2 logs --lines 100
```

---

## 🆘 Emergency Rollback

```bash
# Stop everything
sudo pm2 stop walaspro
sudo systemctl stop nginx

# Restart when fixed
sudo pm2 start walaspro
sudo systemctl start nginx
```
