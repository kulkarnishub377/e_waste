// charts.js - Advanced analytics and data visualization system

class AnalyticsCharts {
  constructor() {
    this.charts = {};
    this.updateInterval = null;
    this.chartConfigs = {
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: true
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    };
    this.mockData = this.generateMockData();
    this.init();
  }

  init() {
    this.createAllCharts();
    this.setupRealTimeUpdates();
    this.setupExportFeatures();
    this.setupInteractivity();
    console.log('📊 Analytics charts initialized');
  }

  generateMockData() {
    return {
      impactData: {
        labels: ['Electronics', 'Batteries', 'Cables', 'Appliances', 'Computers', 'Mobile Phones'],
        data: [35, 15, 20, 12, 10, 8],
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#06B6D4', '#EF4444']
      },
      monthlyTrends: this.generateMonthlyData(),
      userEngagement: this.generateEngagementData(),
      environmentalImpact: this.generateEnvironmentalData(),
      geographicData: this.generateGeographicData(),
      performanceMetrics: this.generatePerformanceData()
    };
  }

  generateMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      pickups: Math.floor(Math.random() * 200) + 100 + (index * 10),
      revenue: Math.floor(Math.random() * 50000) + 25000 + (index * 2000),
      recycled: Math.floor(Math.random() * 1000) + 500 + (index * 50),
      users: Math.floor(Math.random() * 150) + 75 + (index * 8)
    }));
  }

  generateEngagementData() {
    const days = Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });
    
    return days.map(day => ({
      date: day,
      activeUsers: Math.floor(Math.random() * 100) + 50,
      newUsers: Math.floor(Math.random() * 20) + 5,
      sessions: Math.floor(Math.random() * 150) + 75,
      avgSessionTime: Math.floor(Math.random() * 10) + 5
    }));
  }

  generateEnvironmentalData() {
    return {
      co2Saved: 2450,
      energySaved: 3200,
      waterSaved: 1800,
      wasteReduced: 5600,
      treesEquivalent: 45,
      recyclingRate: 87
    };
  }

  generateGeographicData() {
    return [
      { city: 'Mumbai', pickups: 450, percentage: 35 },
      { city: 'Delhi', pickups: 320, percentage: 25 },
      { city: 'Bangalore', pickups: 280, percentage: 22 },
      { city: 'Chennai', pickups: 150, percentage: 12 },
      { city: 'Kolkata', pickups: 80, percentage: 6 }
    ];
  }

  generatePerformanceData() {
    const hours = Array.from({length: 24}, (_, i) => i);
    return hours.map(hour => ({
      hour: hour + ':00',
      avgResponseTime: Math.random() * 2 + 1,
      systemLoad: Math.random() * 80 + 20,
      successRate: 95 + Math.random() * 5,
      activeConnections: Math.floor(Math.random() * 200) + 50
    }));
  }

  createAllCharts() {
    this.createImpactChart();
    this.createTrendsChart();
    this.createEngagementChart();
    this.createEnvironmentalChart();
    this.createGeographicChart();
    this.createPerformanceChart();
    this.createRealtimeChart();
  }

  createImpactChart() {
    const canvas = document.getElementById('impact-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = this.mockData.impactData;

    this.charts.impact = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: data.colors,
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverBorderWidth: 4,
          hoverOffset: 10
        }]
      },
      options: {
        ...this.chartConfigs,
        plugins: {
          ...this.chartConfigs.plugins,
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.raw / total) * 100).toFixed(1);
                return context.label + ': ' + context.raw + '% (' + percentage + '%)';
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000
        }
      }
    });
  }

  createTrendsChart() {
    const canvas = document.getElementById('trends-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = this.mockData.monthlyTrends;

    this.charts.trends = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.month),
        datasets: [
          {
            label: 'Total Pickups',
            data: data.map(item => item.pickups),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: 'New Users',
            data: data.map(item => item.users),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Items Recycled (100s)',
            data: data.map(item => Math.floor(item.recycled / 100)),
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        ...this.chartConfigs,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  createEngagementChart() {
    const canvas = document.getElementById('engagement-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = this.mockData.userEngagement.slice(-14); // Last 14 days

    this.charts.engagement = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Active Users',
            data: data.map(item => item.activeUsers),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3B82F6',
            borderWidth: 1
          },
          {
            label: 'New Users',
            data: data.map(item => item.newUsers),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10B981',
            borderWidth: 1
          }
        ]
      },
      options: {
        ...this.chartConfigs,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic'
        }
      }
    });
  }

  createEnvironmentalChart() {
    const canvas = document.getElementById('environmental-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = this.mockData.environmentalImpact;

    this.charts.environmental = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['CO₂ Reduced', 'Energy Saved', 'Water Saved', 'Waste Reduced', 'Trees Saved', 'Recycling Rate'],
        datasets: [{
          label: 'Environmental Impact',
          data: [
            (data.co2Saved / 3000) * 100,
            (data.energySaved / 4000) * 100,
            (data.waterSaved / 2500) * 100,
            (data.wasteReduced / 7000) * 100,
            (data.treesEquivalent / 60) * 100,
            data.recyclingRate
          ],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: '#10B981',
          borderWidth: 2,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        ...this.chartConfigs,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                size: 12
              }
            }
          }
        },
        animation: {
          duration: 2500,
          easing: 'easeInOutElastic'
        }
      }
    });
  }

  createGeographicChart() {
    const canvas = document.getElementById('geographic-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = this.mockData.geographicData;

    this.charts.geographic = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: data.map(item => item.city),
        datasets: [{
          data: data.map(item => item.pickups),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#8B5CF6',
            '#EF4444'
          ],
          borderWidth: 2
        }]
      },
      options: {
        ...this.chartConfigs,
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          ...this.chartConfigs.plugins,
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.raw / total) * 100).toFixed(1);
                return context.label + ': ' + context.raw + ' pickups (' + percentage + '%)';
              }
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutBounce'
        }
      }
    });
  }

  createPerformanceChart() {
    const canvas = document.getElementById('performance-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = this.mockData.performanceData.filter((_, i) => i % 2 === 0); // Every 2 hours

    this.charts.performance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.hour),
        datasets: [
          {
            label: 'Response Time (sec)',
            data: data.map(item => item.avgResponseTime),
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            yAxisID: 'y',
            tension: 0.4
          },
          {
            label: 'Success Rate (%)',
            data: data.map(item => item.successRate),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            yAxisID: 'y1',
            tension: 0.4
          }
        ]
      },
      options: {
        ...this.chartConfigs,
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            max: 5,
            title: {
              display: true,
              text: 'Response Time (sec)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 90,
            max: 100,
            title: {
              display: true,
              text: 'Success Rate (%)'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }

  createRealtimeChart() {
    const canvas = document.getElementById('realtime-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const initialData = Array(20).fill(0);

    this.charts.realtime = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({length: 20}, (_, i) => '-' + (19 - i) + 's'),
        datasets: [{
          label: 'Active Users',
          data: initialData,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        ...this.chartConfigs,
        scales: {
          y: {
            beginAtZero: true,
            max: 200
          }
        },
        animation: {
          duration: 0
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  setupRealTimeUpdates() {
    // Update charts every 30 seconds
    this.updateInterval = setInterval(() => {
      this.updateRealtimeChart();
      this.updateRandomData();
    }, 3000);

    console.log('🔄 Real-time updates started');
  }

  updateRealtimeChart() {
    if (!this.charts.realtime) return;

    const chart = this.charts.realtime;
    const newValue = Math.floor(Math.random() * 150) + 50;

    // Remove oldest data point and add new one
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(newValue);

    // Update labels
    chart.data.labels.shift();
    chart.data.labels.push('Now');

    chart.update('none'); // No animation for smooth real-time updates
  }

  updateRandomData() {
    // Simulate small changes in other charts
    Object.keys(this.charts).forEach(chartKey => {
      if (chartKey !== 'realtime' && this.charts[chartKey]) {
        // Small random updates to make charts feel alive
        const chart = this.charts[chartKey];
        if (chart.data.datasets && Math.random() > 0.7) {
          // Randomly update some data points slightly
          chart.data.datasets.forEach(dataset => {
            dataset.data = dataset.data.map(value => {
              if (typeof value === 'number' && Math.random() > 0.8) {
                const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
                return Math.max(0, value + (value * variation));
              }
              return value;
            });
          });
          chart.update('none');
        }
      }
    });
  }

  setupExportFeatures() {
    // Add export buttons to chart containers
    Object.keys(this.charts).forEach(chartKey => {
      const chartCanvas = document.getElementById(chartKey + '-chart');
      if (chartCanvas) {
        const container = chartCanvas.parentNode;
        if (!container.querySelector('.export-btn')) {
          const exportBtn = document.createElement('button');
          exportBtn.className = 'export-btn';
          exportBtn.innerHTML = '<i class="fas fa-download"></i>';
          exportBtn.title = 'Export Chart';
          exportBtn.onclick = () => this.exportChart(chartKey);
          container.style.position = 'relative';
          container.appendChild(exportBtn);
        }
      }
    });
  }

  setupInteractivity() {
    // Add click handlers for chart interactions
    document.addEventListener('click', (e) => {
      if (e.target.closest('.chart-filter')) {
        this.handleChartFilter(e.target.closest('.chart-filter'));
      }
    });

    // Add resize observer for responsive charts
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
              chart.resize();
            }
          });
        });
      });

      const chartsContainer = document.querySelector('.analytics-dashboard');
      if (chartsContainer) {
        resizeObserver.observe(chartsContainer);
      }
    }
  }

  exportChart(chartKey) {
    const chart = this.charts[chartKey];
    if (!chart) return;

    try {
      // Create download link
      const link = document.createElement('a');
      link.download = 'e-zero-' + chartKey + '-chart.png';
      link.href = chart.toBase64Image();
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('📊 Chart exported:', chartKey);
      
      // Show notification
      this.showNotification('Chart exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      this.showNotification('Export failed. Please try again.', 'error');
    }
  }

  handleChartFilter(filterElement) {
    const chartType = filterElement.dataset.chart;
    const filterValue = filterElement.dataset.filter;
    
    // Update chart based on filter
    console.log('🔍 Filtering chart:', chartType, 'with value:', filterValue);
    
    // Implement specific filtering logic here
    this.applyFilter(chartType, filterValue);
  }

  applyFilter(chartType, filterValue) {
    const chart = this.charts[chartType];
    if (!chart) return;

    // Example filter implementation
    switch (filterValue) {
      case 'last-7-days':
        this.updateChartDateRange(chart, 7);
        break;
      case 'last-30-days':
        this.updateChartDateRange(chart, 30);
        break;
      case 'last-year':
        this.updateChartDateRange(chart, 365);
        break;
      default:
        console.log('Unknown filter:', filterValue);
    }
  }

  updateChartDateRange(chart, days) {
    // Regenerate data for the specified date range
    const newData = this.generateDataForPeriod(days);
    
    if (newData && chart.data) {
      chart.data.labels = newData.labels;
      chart.data.datasets.forEach((dataset, index) => {
        if (newData.datasets[index]) {
          dataset.data = newData.datasets[index].data;
        }
      });
      chart.update();
    }
  }

  generateDataForPeriod(days) {
    // Generate mock data for the specified period
    const labels = Array.from({length: days}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      labels,
      datasets: [{
        data: Array.from({length: days}, () => Math.floor(Math.random() * 100) + 20)
      }]
    };
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'chart-notification notification-' + type;
    notification.innerHTML = 
      '<i class="fas fa-' + (type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info') + '-circle"></i>' +
      '<span>' + message + '</span>';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  destroy() {
    // Clean up intervals
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Destroy all charts
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.destroy) {
        chart.destroy();
      }
    });

    this.charts = {};
    console.log('📊 Charts destroyed');
  }

  // Public API methods
  updateChart(chartKey, newData) {
    const chart = this.charts[chartKey];
    if (chart && newData) {
      chart.data = { ...chart.data, ...newData };
      chart.update();
    }
  }

  getChartData(chartKey) {
    const chart = this.charts[chartKey];
    return chart ? chart.data : null;
  }

  refreshAllCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.update) {
        chart.update();
      }
    });
  }
}

// Chart.js library loader (if not already loaded)
if (typeof Chart === 'undefined') {
  // Dynamically load Chart.js if not available
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  script.onload = () => {
    console.log('📈 Chart.js loaded dynamically');
    if (document.getElementById('impact-chart')) {
      window.analyticsCharts = new AnalyticsCharts();
    }
  };
  document.head.appendChild(script);
} else {
  // Initialize immediately if Chart.js is already loaded
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('impact-chart')) {
      window.analyticsCharts = new AnalyticsCharts();
    }
  });
}

// Export for module systems
export { AnalyticsCharts };