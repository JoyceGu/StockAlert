#!/usr/bin/env node

const fetch = require('node-fetch');
require('dotenv').config();

class AlertChecker {
    constructor() {
        this.baseUrl = process.env.API_BASE_URL || 'https://query1.finance.yahoo.com/v8/finance/chart/';
        this.stocks = (process.env.WATCH_STOCKS || 'VOO,QQQ,FENY,MSFT,AAPL,GOOGL,TSLA,XOM').split(',');
        this.alertThreshold = parseFloat(process.env.ALERT_THRESHOLD || '20');
        this.alertPeriod = process.env.ALERT_PERIOD || '3M';
        
        console.log('🔍 Alert Checker initialized');
        console.log(`📊 Watching stocks: ${this.stocks.join(', ')}`);
        console.log(`⚠️  Alert threshold: ${this.alertThreshold}%`);
        console.log(`📅 Period: ${this.alertPeriod}`);
    }

    async checkAllStocks() {
        console.log('\n🚀 Starting daily stock alert check...');
        
        const alerts = [];
        
        for (const symbol of this.stocks) {
            try {
                console.log(`📈 Checking ${symbol}...`);
                const alert = await this.checkStock(symbol);
                if (alert) {
                    alerts.push(alert);
                    console.log(`🚨 ALERT: ${symbol} dropped ${alert.dropPercentage}%`);
                }
            } catch (error) {
                console.error(`❌ Error checking ${symbol}:`, error.message);
            }
        }
        
        return alerts;
    }

    async checkStock(symbol) {
        try {
            const stockData = await this.fetchStockData(symbol);
            const periodHigh = this.getPeriodHigh(stockData.data);
            const currentPrice = stockData.currentPrice;
            
            const dropPercentage = ((periodHigh - currentPrice) / periodHigh) * 100;
            
            if (dropPercentage >= this.alertThreshold) {
                return {
                    symbol,
                    currentPrice,
                    periodHigh,
                    dropPercentage: dropPercentage.toFixed(1),
                    period: this.alertPeriod,
                    date: new Date().toISOString()
                };
            }
            
            return null;
        } catch (error) {
            console.error(`Error checking stock ${symbol}:`, error);
            return null;
        }
    }

    async fetchStockData(symbol) {
        try {
            const endDate = Math.floor(Date.now() / 1000);
            let startDate;
            
            switch(this.alertPeriod) {
                case '1M':
                    startDate = endDate - (30 * 24 * 60 * 60);
                    break;
                case '3M':
                    startDate = endDate - (90 * 24 * 60 * 60);
                    break;
                case '6M':
                    startDate = endDate - (180 * 24 * 60 * 60);
                    break;
                case '1Y':
                    startDate = endDate - (365 * 24 * 60 * 60);
                    break;
                default:
                    startDate = endDate - (90 * 24 * 60 * 60);
            }

            const url = `${this.baseUrl}${symbol}?period1=${startDate}&period2=${endDate}&interval=1d`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.chart || !result.chart.result || result.chart.result.length === 0) {
                throw new Error(`No data found for ${symbol}`);
            }

            const chartData = result.chart.result[0];
            const timestamps = chartData.timestamp;
            const prices = chartData.indicators.quote[0];
            
            if (!timestamps || !prices.close) {
                throw new Error(`Invalid data format for ${symbol}`);
            }

            const data = timestamps.map((timestamp, index) => ({
                date: new Date(timestamp * 1000).toISOString().split('T')[0],
                price: prices.close[index],
                volume: prices.volume ? prices.volume[index] : 0
            })).filter(item => item.price !== null && item.price !== undefined);

            if (data.length === 0) {
                throw new Error(`No valid price data found for ${symbol}`);
            }

            return {
                symbol,
                data,
                currentPrice: data[data.length - 1].price
            };
        } catch (error) {
            throw new Error(`Failed to fetch data for ${symbol}: ${error.message}`);
        }
    }

    getPeriodHigh(data) {
        return Math.max(...data.map(point => point.price));
    }

    generateReport(alerts) {
        if (alerts.length === 0) {
            return {
                title: '✅ No Stock Alerts Triggered',
                body: `**Daily Stock Alert Check**\n\n📅 Date: ${new Date().toLocaleDateString()}\n\n✅ No stocks met the alert criteria.\n\n**Settings:**\n- Threshold: ${this.alertThreshold}%\n- Period: ${this.alertPeriod}\n- Stocks Monitored: ${this.stocks.join(', ')}`
            };
        }

        const alertList = alerts.map(alert => 
            `- **${alert.symbol}**: Down ${alert.dropPercentage}% from ${alert.period} high\n  - Current: $${alert.currentPrice.toFixed(2)}\n  - High: $${alert.periodHigh.toFixed(2)}`
        ).join('\n\n');

        return {
            title: `🚨 Stock Alert: ${alerts.length} stock${alerts.length > 1 ? 's' : ''} triggered`,
            body: `**Daily Stock Alert Check**\n\n📅 Date: ${new Date().toLocaleDateString()}\n\n⚠️ **${alerts.length} Alert${alerts.length > 1 ? 's' : ''} Triggered:**\n\n${alertList}\n\n**Settings:**\n- Threshold: ${this.alertThreshold}%\n- Period: ${this.alertPeriod}\n- Stocks Monitored: ${this.stocks.join(', ')}`
        };
    }
}

// Main execution
async function main() {
    try {
        const checker = new AlertChecker();
        const alerts = await checker.checkAllStocks();
        const report = checker.generateReport(alerts);
        
        console.log('\n📊 Daily check completed');
        console.log(`🎯 Total alerts: ${alerts.length}`);
        
        // Output report for GitHub Actions
        console.log('\n---REPORT---');
        console.log(JSON.stringify(report, null, 2));
        console.log('---END REPORT---\n');
        
        // Exit with appropriate code
        process.exit(alerts.length > 0 ? 1 : 0);
    } catch (error) {
        console.error('❌ Fatal error during alert check:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = AlertChecker;
