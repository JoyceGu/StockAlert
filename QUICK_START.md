# Quick Start Guide

## 🚀 Server is Running!

Your stock chart application is live at: **http://localhost:3000**

---

## ✅ What's Been Fixed & Added

### 1. ✨ Volume Display (NOW WORKING!)
**Before**: Checkbox did nothing  
**Now**: Displays trading volume as bar chart

**How to use**:
1. Select "Absolute Price" from Chart Type dropdown
2. Check "Show Volume" checkbox
3. See volume bars with right-side axis

### 2. 🎯 Alert Rules System (NEW!)
Automatically identifies stocks falling below your threshold

**How to use**:
1. Set "Alert when stock drops": e.g., 20%
2. Choose period: "3 Month" or "6 Month"
3. Click "Apply Alert Rules"
4. Check "Triggered Alerts" section below

### 3. 🔔 Visual Indicators (NEW!)
Stocks meeting alert criteria show:
- Red "!" badge next to symbol
- Pink background highlight
- Detailed info in "Triggered Alerts" panel

---

## 📊 Quick Usage

### Basic Monitoring:
```
1. Open http://localhost:3000
2. Default stocks loaded: AAPL, GOOGL, MSFT, TSLA
3. Chart displays automatically
```

### Add a Stock:
```
1. Type symbol in search box (e.g., "NVDA")
2. Press Enter or click "Add"
3. Stock appears in chart and list
```

### Set Up Alerts:
```
1. Scroll to "Alert Rules" section
2. Enter threshold: 20 (for 20% drop)
3. Select period: 3 Month or 6 Month
4. Click "Apply Alert Rules"
5. View results in "Triggered Alerts"
```

### View Volume:
```
1. Select "Absolute Price" chart type
2. Check "Show Volume" box
3. Volume bars appear with secondary Y-axis
```

### Change Timeframe:
```
1. Use dropdown at top: 1M, 3M, 6M, 1Y
2. Chart updates automatically
```

---

## 🎨 Visual Features

### Stock List:
- **Color dot**: Matches chart line color
- **Symbol**: Stock ticker
- **Badge**: Red "!" if alert triggered
- **Price**: Current price
- **Change**: Daily percentage (green/red)
- **X button**: Remove stock

### Chart:
- **Multiple lines**: Each stock in different color
- **Time axis**: Dates on X-axis
- **Price/% axis**: Left Y-axis
- **Volume axis**: Right Y-axis (when enabled)
- **Hover**: Tooltips show details

### Alert Indicators:
- **Pink background**: Stock row with alert
- **Yellow card**: Each triggered alert
- **Details**: Symbol, drop %, current vs. high price

---

## 💡 Example Workflows

### Find Discounted Stocks:
```
Goal: Find stocks down 20%+ from 3-month high
Steps:
  1. Set threshold: 20%
  2. Period: 3 Month
  3. Click "Apply Alert Rules"
  4. Review "Triggered Alerts"
  5. Research highlighted stocks
```

### Volume Analysis:
```
Goal: Identify unusual trading activity
Steps:
  1. Switch to "Absolute Price"
  2. Enable "Show Volume"
  3. Look for volume spikes
  4. Compare with price movement
  5. High volume + drop = strong selling
```

### Conservative Monitoring:
```
Goal: Early warning for 10% drops
Steps:
  1. Set threshold: 10%
  2. Period: 6 Month
  3. More alerts = earlier warning
  4. Monitor daily
```

---

## 🔧 Settings Persistence

All settings automatically saved:
- ✅ Selected stocks
- ✅ Chart type (percentage/price)
- ✅ Volume display preference
- ✅ Alert threshold
- ✅ Alert period

Settings survive:
- Page refresh
- Browser restart
- Closing/reopening browser

---

## 📱 Browser Tips

### Performance:
- Limit to 6-8 stocks for best speed
- Disable volume if chart lags
- Close other browser tabs if slow

### Keyboard:
- **Enter**: Add stock (in search box)
- **F5**: Refresh data and page

### Mobile:
- Responsive design works on phones
- Sidebar stacks on top of chart
- Touch-friendly buttons

---

## 🐛 Troubleshooting

### Volume not showing:
✅ Must be in "Absolute Price" mode  
✅ Check the "Show Volume" box  
✅ Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Alerts not working:
✅ Click "Apply Alert Rules" button  
✅ Wait for data to load  
✅ Check threshold is reasonable  
✅ Try "Refresh Data" button

### Chart not displaying:
✅ Check browser console (F12)  
✅ Clear browser cache  
✅ Verify server is running on port 3000  
✅ Try different browser

### Stock won't add:
✅ Use valid symbol (AAPL, not Apple)  
✅ Check internet connection  
✅ Symbol might not exist on Yahoo Finance  
✅ Try different symbol

---

## 📚 More Information

- **Full Features**: See `NEW_FEATURES.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`
- **Technical Docs**: See `README.md`

---

## 🎯 Default Alert Settings

Out of the box:
- **Threshold**: 20%
- **Period**: 3 Month
- **Applied**: Automatically on load

Good for:
- Identifying significant drops
- Catching potential opportunities
- Balanced sensitivity

Adjust based on:
- Risk tolerance
- Investment strategy
- Market conditions

---

## ⚡ Quick Commands

### Server:
```bash
npm start           # Start server
npm run dev        # Start with auto-reload
```

### Testing:
```bash
# Health check
curl http://localhost:3000/api/health

# Test stock data
curl http://localhost:3000/api/stock/AAPL

# View in browser
open http://localhost:3000
```

### Process Management:
```bash
# Kill server
pkill -f "node.*server.js"

# Check port usage
lsof -i:3000
```

---

**You're all set! Open http://localhost:3000 and start monitoring! 📈**
