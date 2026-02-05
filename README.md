# Stock Chart Dashboard 📊

A modern stock monitoring application with interactive charts and real-time data. Features a clean, professional interface similar to trading platforms with Yahoo Finance integration.

![Stock Chart](https://img.shields.io/badge/Status-Ready-green) ![Node.js](https://img.shields.io/badge/Node.js-18+-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **Interactive Stock Chart**: Clean, professional chart interface with multiple stock comparison
- **Real Stock Data**: Yahoo Finance API integration for live historical data
- **Chart Modes**: Switch between percentage change and absolute price views
- **Multiple Timeframes**: 1M, 3M, 6M, and 1Y data visualization
- **Real-time Updates**: Live data fetching and chart updates
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd StockAlert
npm install
```

### 2. Configure Environment (Optional)

```bash
cp .env.example .env
# Edit .env if you want to customize default settings
```

### 3. Run Locally

```bash
# Start the development server
npm run dev

# Or start production server
npm start
```

Visit `http://localhost:3000` to see your stock alert dashboard.

## ⚙️ Configuration

### Environment Variables (Optional)

```env
PORT=3000                                 # Server port
DEFAULT_STOCKS=AAPL,GOOGL,MSFT,TSLA     # Default stocks to display
```

### Data Source

The application uses Yahoo Finance API which:
- Provides real-time stock data
- Requires no API key or registration
- Includes historical data for charts
- Updates automatically during market hours

## 📱 Usage

### Web Interface

1. **Add Stocks**: Use the search box to add stocks by symbol (e.g., AAPL)
2. **Chart Settings**: Switch between percentage change and absolute price views
3. **Time Periods**: Select 1M, 3M, 6M, or 1Y timeframes
4. **Monitor**: Watch real-time price changes and performance

### Chart Features

- **Multi-stock Comparison**: Compare up to 8 stocks simultaneously
- **Dual Chart Modes**: Percentage change or absolute price display
- **Time Periods**: Switch between 1M, 3M, 6M, and 1Y views
- **Interactive Tooltips**: Hover for detailed price information
- **Real-time Data**: Live updates from Yahoo Finance
- **Performance Indicators**: Color-coded daily changes

## 🛠️ Development

### Project Structure

```
StockAlert/
├── index.html          # Main dashboard interface
├── styles.css          # Styling and responsive design
├── script.js           # Frontend JavaScript logic
├── server.js           # Express server and API endpoints
├── scripts/
│   └── check-alerts.js # Alert checking logic for GitHub Actions
├── .github/workflows/
│   └── daily-alerts.yml # GitHub Actions workflow
└── package.json        # Dependencies and scripts
```

### Available Scripts

```bash
npm start              # Start production server
npm run dev           # Start development server with auto-reload
```

### API Endpoints

- `GET /api/stock/:symbol` - Get stock data for a symbol with historical prices
- `GET /api/health` - Health check endpoint

## 🔧 Troubleshooting

### Common Issues

1. **Stock data not loading**:
   - Check internet connection
   - Verify stock symbols are valid (e.g., AAPL, not Apple)
   - Check browser console for errors
   - Some symbols may not be available on Yahoo Finance

2. **Chart not displaying**:
   - Ensure JavaScript is enabled
   - Check browser compatibility (modern browsers required)
   - Verify Chart.js is loading properly

3. **Server errors**:
   - Check if port 3000 is available
   - Verify all dependencies are installed (`npm install`)
   - Check server logs for detailed error messages

### Testing

```bash
# Test stock data fetching
curl http://localhost:3000/api/stock/AAPL

# Test health endpoint
curl http://localhost:3000/api/health
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Issues**: Use GitHub Issues for bug reports
- **Questions**: Check existing issues or create a new one
---

**Happy Trading! 📈**