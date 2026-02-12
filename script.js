class StockAlertApp {
    constructor() {
        this.chart = null;
        this.selectedStocks = ['VOO', 'QQQ', 'FENY', 'MSFT', 'AAPL', 'GOOGL', 'TSLA', 'XOM']; // Default stocks
        this.stockData = {};
        this.chartSettings = {
            type: 'percentage',
            showVolume: false
        };
        this.alertSettings = {
            threshold: 20,
            period: '3M'
        };
        this.triggeredAlerts = [];
        
        this.colors = [
            '#FF6B35', // Orange
            '#4285F4', // Blue  
            '#9C27B0', // Purple
            '#FF9800', // Amber
            '#4CAF50', // Green
            '#F44336', // Red
            '#00BCD4', // Cyan
            '#795548'  // Brown
        ];
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadSettings();
        await this.loadStockData();
        this.renderSelectedStocks();
        this.renderChart();
        // Don't check alerts automatically - wait for confirm button
    }

    setupEventListeners() {
        document.getElementById('addStock').addEventListener('click', () => this.addStock());
        document.getElementById('stockSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addStock();
        });
        document.getElementById('chartType').addEventListener('change', () => this.updateChartSettings());
        document.getElementById('showVolume').addEventListener('change', () => this.updateChartSettings());
        document.getElementById('timeframe').addEventListener('change', () => this.updateChart());
        document.getElementById('refresh-btn').addEventListener('click', () => this.refreshData());
        document.getElementById('confirmAlerts').addEventListener('click', () => this.confirmAlertRules());
    }

    loadSettings() {
        const saved = localStorage.getItem('stockChartSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.selectedStocks = settings.selectedStocks || this.selectedStocks;
            this.chartSettings = settings.chartSettings || this.chartSettings;
            this.alertSettings = settings.alertSettings || this.alertSettings;
            
            document.getElementById('chartType').value = this.chartSettings.type;
            document.getElementById('showVolume').checked = this.chartSettings.showVolume;
            document.getElementById('alertThreshold').value = this.alertSettings.threshold;
            document.getElementById('alertPeriod').value = this.alertSettings.period;
        }
    }

    saveSettings() {
        const settings = {
            selectedStocks: this.selectedStocks,
            chartSettings: this.chartSettings,
            alertSettings: this.alertSettings
        };
        localStorage.setItem('stockChartSettings', JSON.stringify(settings));
    }

    async addStock() {
        const input = document.getElementById('stockSearch');
        const symbol = input.value.trim().toUpperCase();
        
        if (!symbol || this.selectedStocks.includes(symbol)) {
            input.value = '';
            return;
        }

        if (this.selectedStocks.length >= 8) {
            alert('Maximum 8 stocks allowed for better chart readability');
            return;
        }

        // Show loading
        this.showLoading(true);
        
        try {
            await this.fetchStockData(symbol);
            this.selectedStocks.push(symbol);
            this.renderSelectedStocks();
            this.renderChart();
            this.saveSettings();
            input.value = '';
        } catch (error) {
            alert(`Failed to add ${symbol}. Please check the symbol and try again.`);
        } finally {
            this.showLoading(false);
        }
    }

    removeStock(symbol) {
        this.selectedStocks = this.selectedStocks.filter(s => s !== symbol);
        delete this.stockData[symbol];
        // Remove alerts for this stock if any
        this.triggeredAlerts = this.triggeredAlerts.filter(alert => alert.symbol !== symbol);
        this.renderSelectedStocks();
        this.renderTriggeredAlerts();
        this.renderChart();
        this.saveSettings();
    }

    async loadStockData() {
        this.showLoading(true);
        
        try {
            // Use Promise.allSettled to continue even if some fail
            const promises = this.selectedStocks.map(symbol => 
                this.fetchStockData(symbol).catch(error => {
                    console.error(`Failed to load ${symbol}:`, error);
                    return null; // Return null for failed stocks
                })
            );
            
            const results = await Promise.all(promises);
            const successCount = results.filter(r => r !== null).length;
            const failCount = results.filter(r => r === null).length;
            
            if (successCount === 0) {
                console.error('All stock data loading failed');
                const loadingDiv = document.getElementById('chartLoading');
                if (loadingDiv) {
                    loadingDiv.innerHTML = `
                        <div style="color: #dc3545; text-align: center;">
                            <p style="font-weight: bold;">⚠️ 无法加载股票数据</p>
                            <p style="font-size: 0.9rem;">请检查网络连接和API端点</p>
                            <p style="font-size: 0.8rem; margin-top: 10px;">检查浏览器控制台 (F12) 获取详细信息</p>
                        </div>
                    `;
                    return; // Don't hide loading, show error
                }
            } else if (failCount > 0) {
                console.warn(`${failCount} stock(s) failed to load, ${successCount} succeeded`);
            }
            
            console.log(`Successfully loaded ${successCount} out of ${this.selectedStocks.length} stocks`);
        } catch (error) {
            console.error('Error loading stock data:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async fetchStockData(symbol) {
        try {
            const apiUrl = `/api/stock/${symbol}`;
            console.log(`Fetching data for ${symbol} from ${apiUrl}`);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error for ${symbol}:`, response.status, errorText);
                throw new Error(`Failed to fetch data for ${symbol}: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`Successfully loaded ${symbol}:`, data.currentPrice);
            this.stockData[symbol] = data;
            return data;
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            // Show user-friendly error
            const loadingDiv = document.getElementById('chartLoading');
            if (loadingDiv) {
                loadingDiv.innerHTML = `
                    <div style="color: #dc3545; text-align: center;">
                        <p style="font-weight: bold;">⚠️ 加载股票数据失败</p>
                        <p style="font-size: 0.9rem;">${symbol}: ${error.message}</p>
                        <p style="font-size: 0.8rem; margin-top: 10px;">请检查浏览器控制台获取详细信息</p>
                    </div>
                `;
            }
            throw error;
        }
    }


    renderSelectedStocks() {
        const container = document.getElementById('selectedStocks');
        
        if (this.selectedStocks.length === 0) {
            container.innerHTML = '<p class="no-stocks">No stocks selected</p>';
            return;
        }

        container.innerHTML = this.selectedStocks.map((symbol, index) => {
            const data = this.stockData[symbol];
            const color = this.colors[index % this.colors.length];
            const changeClass = data && data.change24h >= 0 ? 'positive' : 'negative';
            const hasAlert = this.triggeredAlerts.some(alert => alert.symbol === symbol);
            
            return `
                <div class="stock-item ${hasAlert ? 'has-alert' : ''}">
                    <div class="stock-info">
                        <div class="stock-color" style="width: 10px; height: 10px; background: ${color}; border-radius: 50%;"></div>
                        <span class="stock-symbol">${symbol}</span>
                        ${hasAlert ? '<span class="alert-badge">!</span>' : ''}
                        ${data ? `
                            <span class="stock-price">$${data.currentPrice.toFixed(2)}</span>
                            <span class="stock-change ${changeClass}">${data.change24h >= 0 ? '+' : ''}${data.change24h.toFixed(2)}%</span>
                        ` : ''}
                    </div>
                    <button class="remove-stock" onclick="app.removeStock('${symbol}')">×</button>
                </div>
            `;
        }).join('');
    }

    renderChart() {
        const ctx = document.getElementById('stockChart').getContext('2d');
        const timeframe = document.getElementById('timeframe').value;
        
        if (this.chart) {
            this.chart.destroy();
        }

        const datasets = this.selectedStocks.map((symbol, index) => {
            const data = this.stockData[symbol];
            if (!data) return null;

            const filteredData = this.filterDataByTimeframe(data.data, timeframe);
            const chartData = this.chartSettings.type === 'percentage' 
                ? this.normalizeData(filteredData)
                : filteredData;

            return {
                label: symbol,
                data: chartData.map(point => ({
                    x: point.date,
                    y: this.chartSettings.type === 'percentage' ? point.normalizedPrice : point.price
                })),
                borderColor: this.colors[index % this.colors.length],
                backgroundColor: this.colors[index % this.colors.length] + '10',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 4,
                yAxisID: 'y'
            };
        }).filter(dataset => dataset !== null);

        // Add volume datasets if showVolume is enabled
        if (this.chartSettings.showVolume && this.chartSettings.type === 'price') {
            this.selectedStocks.forEach((symbol, index) => {
                const data = this.stockData[symbol];
                if (!data) return;

                const filteredData = this.filterDataByTimeframe(data.data, timeframe);
                
                datasets.push({
                    label: `${symbol} Volume`,
                    data: filteredData.map(point => ({
                        x: point.date,
                        y: point.volume
                    })),
                    type: 'bar',
                    backgroundColor: this.colors[index % this.colors.length] + '30',
                    borderColor: this.colors[index % this.colors.length] + '60',
                    borderWidth: 1,
                    yAxisID: 'y1',
                    order: 2
                });
            });
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false // We show legend in the sidebar
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: (context) => {
                                return new Date(context[0].parsed.x).toLocaleDateString();
                            },
                            label: (context) => {
                                const label = context.dataset.label;
                                
                                if (label.includes('Volume')) {
                                    return `${label}: ${(context.parsed.y / 1000000).toFixed(2)}M`;
                                }
                                
                                const symbol = label;
                                const originalData = this.stockData[symbol];
                                if (!originalData) return '';
                                
                                const dataIndex = context.dataIndex;
                                const filteredData = this.filterDataByTimeframe(originalData.data, timeframe);
                                const actualPrice = filteredData[dataIndex]?.price || 0;
                                
                                if (this.chartSettings.type === 'percentage') {
                                    return `${symbol}: $${actualPrice.toFixed(2)} (${context.parsed.y.toFixed(1)}%)`;
                                } else {
                                    return `${symbol}: $${actualPrice.toFixed(2)}`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: timeframe === '1M' ? 'day' : timeframe === '3M' ? 'week' : 'month'
                        },
                        grid: {
                            color: '#f0f0f0'
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: false,
                        grid: {
                            color: '#f0f0f0'
                        },
                        ticks: {
                            color: '#666',
                            callback: (value) => {
                                if (this.chartSettings.type === 'percentage') {
                                    return value.toFixed(1) + '%';
                                } else {
                                    return '$' + value.toFixed(2);
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: this.chartSettings.type === 'percentage' ? 'Percentage Change (%)' : 'Price ($)',
                            color: '#666'
                        }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        display: this.chartSettings.showVolume && this.chartSettings.type === 'price',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            color: '#666',
                            callback: (value) => {
                                return (value / 1000000).toFixed(0) + 'M';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Volume',
                            color: '#666'
                        }
                    }
                }
            }
        });
    }

    filterDataByTimeframe(data, timeframe) {
        const now = new Date();
        let startDate = new Date(now);
        
        switch(timeframe) {
            case '1M':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case '3M':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case '6M':
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case '1Y':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }
        
        return data.filter(point => new Date(point.date) >= startDate);
    }

    normalizeData(data) {
        if (data.length === 0) return [];
        
        const basePrice = data[0].price;
        return data.map(point => ({
            ...point,
            normalizedPrice: ((point.price - basePrice) / basePrice) * 100
        }));
    }

    updateChartSettings() {
        this.chartSettings.type = document.getElementById('chartType').value;
        this.chartSettings.showVolume = document.getElementById('showVolume').checked;
        
        // Volume only works with price view
        if (this.chartSettings.showVolume && this.chartSettings.type !== 'price') {
            document.getElementById('chartType').value = 'price';
            this.chartSettings.type = 'price';
        }
        
        this.saveSettings();
        this.renderChart();
    }

    confirmAlertRules() {
        this.alertSettings.threshold = parseFloat(document.getElementById('alertThreshold').value);
        this.alertSettings.period = document.getElementById('alertPeriod').value;
        this.saveSettings();
        this.checkAlerts();
        this.renderSelectedStocks();
        this.renderTriggeredAlerts();
        
        // Show visual feedback
        const button = document.getElementById('confirmAlerts');
        const originalText = button.textContent;
        button.textContent = '✓ Applied';
        button.style.background = '#218838';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }

    checkAlerts() {
        this.triggeredAlerts = [];
        
        this.selectedStocks.forEach(symbol => {
            const data = this.stockData[symbol];
            if (!data || !data.data || data.data.length === 0) return;
            
            // Get data for the alert period
            const periodData = this.filterDataByTimeframe(data.data, this.alertSettings.period);
            if (periodData.length === 0) return;
            
            // Find highest price in the period
            const highestPrice = Math.max(...periodData.map(p => p.price));
            const currentPrice = data.currentPrice;
            
            // Calculate drop percentage
            const dropPercentage = ((highestPrice - currentPrice) / highestPrice) * 100;
            
            // Check if alert threshold is met
            if (dropPercentage >= this.alertSettings.threshold) {
                this.triggeredAlerts.push({
                    symbol,
                    currentPrice,
                    highestPrice,
                    dropPercentage: dropPercentage.toFixed(1),
                    period: this.alertSettings.period
                });
            }
        });
        
        this.renderTriggeredAlerts();
    }

    renderTriggeredAlerts() {
        const container = document.getElementById('triggeredAlerts');
        const alertsSection = document.getElementById('alertsSection');
        
        if (this.triggeredAlerts.length === 0) {
            alertsSection.style.display = 'none';
            return;
        }
        
        alertsSection.style.display = 'block';
        container.innerHTML = this.triggeredAlerts.map(alert => `
            <div class="alert-item">
                <div class="alert-symbol">${alert.symbol}</div>
                <div class="alert-details">
                    -${alert.dropPercentage}% from ${alert.period} high<br>
                    $${alert.currentPrice.toFixed(2)} (was $${alert.highestPrice.toFixed(2)})
                </div>
            </div>
        `).join('');
    }

    updateChart() {
        this.renderChart();
    }

    async refreshData() {
        await this.loadStockData();
        this.renderChart();
        this.renderSelectedStocks();
        // Don't check alerts automatically - user must click Confirm
    }

    showLoading(show) {
        const loading = document.getElementById('chartLoading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StockAlertApp();
});

// Auto-refresh every 5 minutes during market hours
setInterval(() => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Only refresh during market hours (9:30 AM - 4:00 PM EST, Mon-Fri)
    if (day >= 1 && day <= 5 && hour >= 9 && hour <= 16) {
        window.app.refreshData();
    }
}, 5 * 60 * 1000); // 5 minutes