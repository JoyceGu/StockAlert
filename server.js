const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Stock data service using Yahoo Finance API via direct HTTP calls
class StockDataService {
    constructor() {
        this.baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';
    }

    async getStockData(symbol, timeframe = '3M') {
        try {
            // Calculate date range based on timeframe
            const endDate = Math.floor(Date.now() / 1000);
            let startDate;
            
            switch(timeframe) {
                case '1M':
                    startDate = endDate - (30 * 24 * 60 * 60); // 30 days
                    break;
                case '3M':
                    startDate = endDate - (90 * 24 * 60 * 60); // 90 days
                    break;
                case '6M':
                    startDate = endDate - (180 * 24 * 60 * 60); // 180 days
                    break;
                case '1Y':
                    startDate = endDate - (365 * 24 * 60 * 60); // 365 days
                    break;
                default:
                    startDate = endDate - (90 * 24 * 60 * 60); // Default 90 days
            }

            // Fetch data from Yahoo Finance API
            const url = `${this.baseUrl}${symbol}?period1=${startDate}&period2=${endDate}&interval=1d`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.chart || !result.chart.result || result.chart.result.length === 0) {
                throw new Error(`No data found for symbol: ${symbol}`);
            }

            const chartData = result.chart.result[0];
            const timestamps = chartData.timestamp;
            const prices = chartData.indicators.quote[0];
            const meta = chartData.meta || {};
            
            if (!timestamps || !prices.close) {
                throw new Error(`Invalid data format for symbol: ${symbol}`);
            }

            // Extract stock name from metadata
            const stockName = meta.longName || meta.shortName || symbol;

            // Transform data to our format
            const data = timestamps.map((timestamp, index) => ({
                date: new Date(timestamp * 1000).toISOString().split('T')[0],
                price: prices.close[index],
                volume: prices.volume ? prices.volume[index] : 0
            })).filter(item => item.price !== null && item.price !== undefined);

            if (data.length === 0) {
                throw new Error(`No valid price data found for symbol: ${symbol}`);
            }

            const currentPrice = data[data.length - 1].price;
            const previousPrice = data[data.length - 2]?.price || currentPrice;
            const change24h = ((currentPrice - previousPrice) / previousPrice) * 100;

            return {
                symbol,
                name: stockName,
                data,
                currentPrice,
                change24h
            };
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error.message);
            throw error;
        }
    }
}

const stockService = new StockDataService();

// API Routes
app.get('/api/stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { timeframe } = req.query;
        
        const data = await stockService.getStockData(symbol.toUpperCase(), timeframe);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve test page
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-api.html'));
});


// Export for Vercel serverless
module.exports = app;

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 Stock Alert Server running on port ${PORT}`);
        console.log(`📊 Dashboard: http://localhost:${PORT}`);
        console.log(`💡 API Health: http://localhost:${PORT}/api/health`);
    });
}