# GitHub Actions Setup Guide

## 📋 Overview

This guide explains how to set up **daily automated stock alert checking** using GitHub Actions.

**Important Note**: GitHub Actions is perfect for **daily alert checking**, but **NOT for hosting the web application**. The web UI needs to be hosted separately (see hosting options below).

---

## ✅ What GitHub Actions Will Do

- ✅ Run daily stock alert checks (Monday-Friday after market close)
- ✅ Check if stocks meet your alert criteria
- ✅ Create GitHub Issues when alerts are triggered
- ✅ Can be triggered manually anytime
- ✅ Free for public repos (2000 minutes/month for private repos)

---

## 🚀 Setup Steps

### 1. Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit with GitHub Actions workflow"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Configure Repository Variables (Optional)

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **Variables**

Add these variables to customize alert settings:

| Variable Name | Default Value | Description |
|---------------|---------------|-------------|
| `WATCH_STOCKS` | `VOO,QQQ,FENY,MSFT,AAPL,GOOGL,TSLA,XOM` | Comma-separated stock symbols |
| `ALERT_THRESHOLD` | `20` | Percentage drop threshold |
| `ALERT_PERIOD` | `3M` | Period (1M, 3M, 6M, 1Y) |

**Note**: If you don't set these, defaults will be used.

### 3. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. If prompted, click **"I understand my workflows, go ahead and enable them"**

### 4. Test the Workflow

**Manual Test**:
1. Go to **Actions** tab
2. Click **"Daily Stock Alerts"** workflow
3. Click **"Run workflow"** button
4. Select branch: `main`
5. Click **"Run workflow"**

**Wait for completion**:
- Check the logs to see if it works
- If alerts are triggered, a GitHub Issue will be created

### 5. Schedule Configuration

The workflow runs automatically:
- **Schedule**: Monday-Friday at 9:00 PM UTC (4:00 PM EST / 1:00 PM PST)
- **After market close**: Perfect timing to check daily performance

**To change schedule**, edit `.github/workflows/daily-alerts.yml`:
```yaml
- cron: '0 21 * * 1-5'  # Change this line
```

**Cron format**: `minute hour day month weekday`
- `0 21 * * 1-5` = 9:00 PM UTC, Mon-Fri
- `0 16 * * 1-5` = 4:00 PM UTC, Mon-Fri (9:00 AM PST)

---

## 📧 Notification Options

### Option 1: GitHub Issues (Built-in)
- ✅ Already configured
- ✅ Creates issue when alerts trigger
- ✅ Updates issue if already exists today
- ✅ Labeled with `stock-alert` and `automated`

### Option 2: Email Notifications
Add email step to workflow (requires email service):

```yaml
- name: Send Email Alert
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USER }}
    password: ${{ secrets.EMAIL_PASS }}
    subject: Stock Alert Triggered
    to: your-email@example.com
    body: ${{ steps.parse-report.outputs.report }}
```

### Option 3: Slack/Discord Webhooks
Add webhook notification step (search GitHub Actions marketplace).

---

## 🔍 How It Works

### Daily Workflow:
1. **Trigger**: Runs automatically Mon-Fri at scheduled time
2. **Check Stocks**: Fetches data from Yahoo Finance API
3. **Calculate Drops**: Compares current price to period high
4. **Check Criteria**: If drop >= threshold, trigger alert
5. **Create Issue**: If alerts found, create GitHub Issue
6. **Log Results**: Upload logs as artifact

### Manual Trigger:
- Go to Actions tab → Click workflow → "Run workflow"
- Useful for testing or checking alerts anytime

---

## 📊 Viewing Results

### GitHub Issues:
- Go to **Issues** tab in your repository
- Look for issues labeled `stock-alert`
- Each issue shows:
  - Date of check
  - Stocks that triggered alerts
  - Drop percentages
  - Current vs. high prices

### Workflow Logs:
- Go to **Actions** tab
- Click on latest workflow run
- View detailed logs for each step

### Artifacts:
- Download logs from workflow run
- Useful for debugging

---

## ⚙️ Customization

### Change Alert Settings:
Edit repository variables (Settings → Secrets and variables → Actions → Variables)

### Change Schedule:
Edit `.github/workflows/daily-alerts.yml`:
```yaml
schedule:
  - cron: '0 21 * * 1-5'  # Your custom schedule
```

### Add More Stocks:
Update `WATCH_STOCKS` variable or edit default in workflow file

### Change Threshold:
Update `ALERT_THRESHOLD` variable (e.g., 15 for 15% drop)

---

## 🐛 Troubleshooting

### Workflow Not Running:
- ✅ Check if Actions are enabled (Settings → Actions)
- ✅ Verify cron syntax is correct
- ✅ Check GitHub Actions usage limits

### No Alerts Showing:
- ✅ Verify stocks are valid symbols
- ✅ Check threshold isn't too high
- ✅ Ensure market data is available

### API Errors:
- ✅ Yahoo Finance API is free but rate-limited
- ✅ Wait a few minutes between manual runs
- ✅ Check internet connectivity in workflow logs

### Issues Not Created:
- ✅ Check GitHub token permissions
- ✅ Verify workflow has write access
- ✅ Check Actions tab for errors

---

## 💰 GitHub Actions Limits

### Free Tier (Public Repos):
- ✅ Unlimited minutes
- ✅ Unlimited runs
- ✅ Perfect for daily checks

### Free Tier (Private Repos):
- ⚠️ 2,000 minutes/month
- ✅ Daily checks use ~2 minutes/day = ~60 minutes/month
- ✅ Well within limits

### Paid Plans:
- More minutes available if needed
- Usually not necessary for daily checks

---

## 🌐 Hosting the Web Application

**GitHub Actions cannot host web apps** (runs in ephemeral containers).

### Recommended Hosting Options:

#### 1. **Vercel** (Recommended - Free)
```bash
npm install -g vercel
vercel
```
- ✅ Free tier available
- ✅ Auto-deploy from GitHub
- ✅ Serverless functions supported
- ✅ Perfect for Node.js apps

#### 2. **Netlify** (Free)
```bash
npm install -g netlify-cli
netlify deploy
```
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Good for static + API

#### 3. **Railway** (Free Trial)
- ✅ Easy deployment
- ✅ Good for full-stack apps
- ⚠️ Free trial, then paid

#### 4. **Render** (Free Tier)
- ✅ Free tier available
- ✅ Auto-deploy from GitHub
- ✅ Good for Node.js apps

#### 5. **GitHub Pages** (Free, but...)
- ⚠️ Static sites only
- ❌ No backend/API support
- ❌ Would need to rewrite as static

### Quick Deploy to Vercel:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd StockAlert
   vercel
   ```

3. **Connect to GitHub**:
   - Go to vercel.com
   - Import your GitHub repository
   - Auto-deploy on every push

4. **Environment Variables**:
   - Add in Vercel dashboard
   - Same as `.env` file

---

## 📝 Summary

### What GitHub Actions Does:
✅ Daily automated alert checking  
✅ Creates GitHub Issues for alerts  
✅ Can be triggered manually  
✅ Free for public repos  

### What GitHub Actions Doesn't Do:
❌ Host web application (use Vercel/Netlify/etc.)  
❌ Run continuously (runs on schedule)  
❌ Provide web UI (that needs separate hosting)  

### Recommended Setup:
1. **GitHub Actions**: Daily alert checking → GitHub Issues
2. **Vercel/Netlify**: Host web application → Public URL
3. **Best of Both**: Automated alerts + interactive web UI

---

## 🎯 Next Steps

1. ✅ Push code to GitHub
2. ✅ Enable GitHub Actions
3. ✅ Test workflow manually
4. ✅ Configure repository variables (optional)
5. ✅ Deploy web app to Vercel/Netlify (separate step)
6. ✅ Set up email notifications (optional)

**You're all set! Your daily stock alerts will run automatically!** 🚀📊
