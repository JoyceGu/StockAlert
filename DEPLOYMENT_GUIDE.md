# Deployment Guide

## 🎯 Two-Part Setup

Your stock alert system has **two components** that need different hosting approaches:

### 1. Daily Alert Checking (GitHub Actions) ✅
- **What**: Automated daily stock checks
- **Where**: GitHub Actions (free)
- **When**: Runs Mon-Fri after market close
- **Output**: Creates GitHub Issues when alerts trigger

### 2. Web Application (Separate Hosting) 🌐
- **What**: Interactive chart and UI
- **Where**: Vercel, Netlify, Railway, etc. (free tiers available)
- **When**: Always running (24/7)
- **Output**: Public web URL for accessing charts

---

## 📋 Quick Setup Checklist

### GitHub Actions (Daily Checks):
- [ ] Push code to GitHub
- [ ] Enable GitHub Actions
- [ ] Test workflow manually
- [ ] Configure repository variables (optional)
- [ ] Wait for daily run

### Web Hosting (Optional):
- [ ] Choose hosting provider (Vercel recommended)
- [ ] Deploy application
- [ ] Configure environment variables
- [ ] Get public URL
- [ ] Share URL with users

---

## 🚀 GitHub Actions Setup (5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Add GitHub Actions workflow"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Enable Actions
1. Go to repository → **Settings** → **Actions**
2. Enable workflows if prompted

### Step 3: Test
1. Go to **Actions** tab
2. Click **"Daily Stock Alerts"**
3. Click **"Run workflow"**
4. Watch it run!

### Step 4: Configure (Optional)
- Go to **Settings** → **Secrets and variables** → **Actions** → **Variables**
- Add `WATCH_STOCKS`, `ALERT_THRESHOLD`, `ALERT_PERIOD`

**Done!** Daily checks will run automatically.

---

## 🌐 Web Hosting Options

### Option 1: Vercel (Recommended) ⭐

**Why**: Free, easy, perfect for Node.js

**Steps**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd StockAlert
vercel

# Follow prompts, then:
# 1. Connect to GitHub
# 2. Auto-deploy on push
# 3. Get public URL
```

**Features**:
- ✅ Free tier
- ✅ Auto-deploy from GitHub
- ✅ HTTPS included
- ✅ Custom domain support
- ✅ Serverless functions

### Option 2: Netlify

**Steps**:
```bash
npm install -g netlify-cli
netlify deploy
```

**Features**:
- ✅ Free tier
- ✅ Easy GitHub integration
- ✅ Good documentation

### Option 3: Railway

**Steps**:
1. Go to railway.app
2. New Project → Deploy from GitHub
3. Select repository
4. Auto-deploys

**Features**:
- ✅ Free trial
- ✅ Easy setup
- ✅ Good for full-stack apps

### Option 4: Render

**Steps**:
1. Go to render.com
2. New Web Service
3. Connect GitHub repo
4. Deploy

**Features**:
- ✅ Free tier
- ✅ Auto-deploy
- ✅ Good for Node.js

---

## ⚙️ Environment Variables

### For GitHub Actions:
Set in **Repository Settings** → **Secrets and variables** → **Actions** → **Variables**

```
WATCH_STOCKS=VOO,QQQ,FENY,MSFT,AAPL,GOOGL,TSLA,XOM
ALERT_THRESHOLD=20
ALERT_PERIOD=3M
```

### For Web Hosting:
Set in hosting provider dashboard (Vercel/Netlify/etc.)

```
PORT=3000
# (No API keys needed - uses Yahoo Finance)
```

---

## 📊 What Runs Where?

### GitHub Actions:
- ✅ Daily alert checking script
- ✅ Creates GitHub Issues
- ✅ Runs Mon-Fri at 9 PM UTC
- ✅ Free for public repos

### Web Hosting:
- ✅ Express server (server.js)
- ✅ Web UI (index.html, script.js)
- ✅ Chart display
- ✅ Interactive features
- ✅ Always accessible via URL

---

## 🔄 Workflow

### Daily Automated Flow:
```
1. GitHub Actions runs daily (9 PM UTC)
   ↓
2. Checks all stocks against criteria
   ↓
3. If alerts triggered → Creates GitHub Issue
   ↓
4. You get notification (if configured)
```

### Manual Web Access:
```
1. Open web URL (e.g., your-app.vercel.app)
   ↓
2. View charts and stock data
   ↓
3. Configure alerts manually
   ↓
4. Click "Confirm" to check alerts
```

---

## 💡 Best Practice Setup

### Recommended Architecture:

```
┌─────────────────────────────────┐
│  GitHub Repository              │
│  ┌───────────────────────────┐ │
│  │ GitHub Actions Workflow    │ │
│  │ (Daily checks → Issues)    │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Web App Code               │ │
│  │ (Deployed to Vercel)      │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
         │                    │
         ▼                    ▼
┌──────────────┐    ┌──────────────┐
│ GitHub       │    │ Vercel       │
│ Issues       │    │ Web App      │
│ (Alerts)     │    │ (Charts)     │
└──────────────┘    └──────────────┘
```

---

## 🎯 Summary

### GitHub Actions = ✅ Perfect for Daily Checks
- Runs on schedule
- Creates issues
- Free for public repos
- No hosting needed

### Web Hosting = ✅ Perfect for Web UI
- Always accessible
- Interactive charts
- User-friendly interface
- Free tiers available

### Together = ✅ Complete Solution
- Automated daily monitoring (GitHub Actions)
- Interactive web interface (Hosted app)
- Best of both worlds!

---

## 📚 Next Steps

1. **Set up GitHub Actions** (see GITHUB_ACTIONS_SETUP.md)
2. **Deploy web app** (choose Vercel/Netlify/etc.)
3. **Configure notifications** (optional)
4. **Share with users** (web URL)

**You're ready to deploy!** 🚀
