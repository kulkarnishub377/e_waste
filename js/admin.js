// admin.js - Administrative dashboard functionality

class AdminDashboard {
  constructor() {
    this.currentSection = 'dashboard';
    this.mockData = this.generateMockData();
    this.charts = {};
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupEventListeners();
    this.initializeDashboard();
    this.setupRealTimeUpdates();
    console.log('👨‍💼 Admin dashboard initialized');
  }

  generateMockData() {
    return {
      pickups: this.generatePickupData(),
      users: this.generateUserData(),
      centers: this.generateCenterData(),
      analytics: this.generateAnalyticsData(),
      activities: this.generateActivityData()
    };
  }

  generatePickupData() {
    const statuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    const items = ['Electronics', 'Batteries', 'Computers', 'Mobile Phones', 'Appliances'];
    
    return Array.from({length: 50}, (_, i) => ({
      id: 'PU' + (1000 + i),
      customer: 'Customer ' + (i + 1),
      email: 'customer' + (i + 1) + '@example.com',
      phone: '+91 ' + (9000000000 + Math.floor(Math.random() * 999999999)),
      date: this.getRandomDate(),
      items: Math.floor(Math.random() * 3) + 1,
      itemTypes: items.slice(0, Math.floor(Math.random() * 3) + 1),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: Math.floor(Math.random() * 500) + 100,
      address: 'Address ' + (i + 1) + ', City, State',
      createdAt: this.getRandomDate(),
      assignedTo: 'Driver ' + (Math.floor(Math.random() * 10) + 1)
    }));
  }

  generateUserData() {
    const roles = ['user', 'premium', 'admin'];
    
    return Array.from({length: 100}, (_, i) => ({
      id: 'USR' + (1000 + i),
      name: 'User ' + (i + 1),
      email: 'user' + (i + 1) + '@example.com',
      phone: '+91 ' + (9000000000 + Math.floor(Math.random() * 999999999)),
      joinDate: this.getRandomDate(),
      lastActive: this.getRandomDate(),
      pickups: Math.floor(Math.random() * 20) + 1,
      points: Math.floor(Math.random() * 1000) + 50,
      level: Math.floor(Math.random() * 10) + 1,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      role: roles[Math.floor(Math.random() * roles.length)],
      avatar: 'https://i.pravatar.cc/150?img=' + (i + 1)
    }));
  }

  generateCenterData() {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];
    
    return Array.from({length: 25}, (_, i) => ({
      id: 'CTR' + (100 + i),
      name: 'Recycling Center ' + (i + 1),
      address: 'Address ' + (i + 1) + ', ' + cities[Math.floor(Math.random() * cities.length)],
      phone: '+91 ' + (9000000000 + Math.floor(Math.random() * 999999999)),
      email: 'center' + (i + 1) + '@e-zero.com',
      capacity: Math.floor(Math.random() * 500) + 200,
      currentLoad: Math.floor(Math.random() * 300) + 50,
      rating: (Math.random() * 2 + 3).toFixed(1),
      verified: Math.random() > 0.3,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      manager: 'Manager ' + (i + 1),
      coordinates: [
        19.0760 + (Math.random() - 0.5) * 0.5,
        72.8777 + (Math.random() - 0.5) * 0.5
      ]
    }));
  }

  generateAnalyticsData() {
    return {
      revenue: {
        total: 2345670,
        monthly: Array.from({length: 12}, () => Math.floor(Math.random() * 200000) + 150000),
        growth: 18.2
      },
      pickups: {
        total: 15632,
        monthly: Array.from({length: 12}, () => Math.floor(Math.random() * 2000) + 1000),
        growth: 15.7
      },
      users: {
        total: 8920,
        monthly: Array.from({length: 12}, () => Math.floor(Math.random() * 200) + 100),
        growth: 8.3
      },
      satisfaction: 4.8
    };
  }

  generateActivityData() {
    const activities = [
      'New pickup scheduled',
      'User registered',
      'Pickup completed',
      'Payment received',
      'Center verified',
      'Report generated'
    ];
    
    return Array.from({length: 20}, (_, i) => ({
      id: i + 1,
      type: activities[Math.floor(Math.random() * activities.length)],
      description: 'Activity description ' + (i + 1),
      user: 'User ' + (Math.floor(Math.random() * 100) + 1),
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      icon: ['fas fa-calendar', 'fas fa-user-plus', 'fas fa-check', 'fas fa-money-bill', 'fas fa-shield-check', 'fas fa-file-alt'][Math.floor(Math.random() * 6)]
    }));
  }

  getRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.closest('.nav-link').dataset.section;
        this.switchSection(section);
      });
    });
  }

  switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
      section.classList.remove('active');
    });

    // Remove active class from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Add active class to nav link
    const targetNavLink = document.querySelector('[data-section="' + sectionName + '"]');
    if (targetNavLink) {
      targetNavLink.classList.add('active');
    }

    this.currentSection = sectionName;

    // Initialize section-specific content
    this.initializeSection(sectionName);
  }

  initializeSection(sectionName) {
    switch (sectionName) {
      case 'dashboard':
        this.initializeDashboard();
        break;
      case 'pickups':
        this.initializePickups();
        break;
      case 'users':
        this.initializeUsers();
        break;
      case 'centers':
        this.initializeCenters();
        break;
      case 'analytics':
        this.initializeAnalytics();
        break;
      case 'settings':
        this.initializeSettings();
        break;
    }
  }

  initializeDashboard() {
    this.animateCounters();
    this.loadRecentActivity();
    this.createDashboardCharts();
  }

  animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      this.animateCounter(counter, target);
    });
  }

  animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (target - start) * this.easeOutQuart(progress));
      
      if (element.textContent.includes('₹')) {
        element.innerHTML = '₹<span data-count="' + target + '">' + current.toLocaleString() + '</span>';
      } else {
        element.textContent = current.toLocaleString();
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  loadRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;

    const activities = this.mockData.activities.slice(0, 10);
    
    const activityHTML = activities.map(activity => 
      '<div class="activity-item">' +
        '<div class="activity-icon">' +
          '<i class="' + activity.icon + '"></i>' +
        '</div>' +
        '<div class="activity-content">' +
          '<h4>' + activity.type + '</h4>' +
          '<p>' + activity.description + '</p>' +
          '<span class="activity-time">' + this.formatTimeAgo(new Date(activity.timestamp)) + '</span>' +
        '</div>' +
      '</div>'
    ).join('');

    activityContainer.innerHTML = activityHTML;
  }

  formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    return Math.floor(diffInSeconds / 86400) + ' days ago';
  }

  createDashboardCharts() {
    this.createTrendsChart();
    this.createDistributionChart();
  }

  createTrendsChart() {
    const canvas = document.getElementById('trends-chart');
    if (!canvas || this.charts.trends) return;

    const ctx = canvas.getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    this.charts.trends = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Pickups',
            data: this.mockData.analytics.pickups.monthly,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          },
          {
            label: 'Users',
            data: this.mockData.analytics.users.monthly,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createDistributionChart() {
    const canvas = document.getElementById('pickup-distribution-chart');
    if (!canvas || this.charts.distribution) return;

    const ctx = canvas.getContext('2d');
    const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
    const statusCounts = statuses.map(status => {
      return this.mockData.pickups.filter(pickup => 
        pickup.status === status.toLowerCase().replace(' ', '-')
      ).length;
    });

    this.charts.distribution = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: statuses,
        datasets: [{
          data: statusCounts,
          backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  initializePickups() {
    this.loadPickupsTable();
  }

  loadPickupsTable() {
    const tableBody = document.querySelector('#pickups-table tbody');
    if (!tableBody) return;

    const pickups = this.mockData.pickups.slice(0, 20);
    
    const tableHTML = pickups.map(pickup => 
      '<tr>' +
        '<td>' + pickup.id + '</td>' +
        '<td>' + pickup.customer + '</td>' +
        '<td>' + pickup.date.toLocaleDateString() + '</td>' +
        '<td>' + pickup.items + ' items</td>' +
        '<td><span class="status-badge ' + pickup.status + '">' + 
          pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1) +
        '</span></td>' +
        '<td>₹' + pickup.amount + '</td>' +
        '<td>' +
          '<button class="action-btn view" onclick="viewPickup(\'' + pickup.id + '\')">' +
            '<i class="fas fa-eye"></i>' +
          '</button>' +
          '<button class="action-btn edit" onclick="editPickup(\'' + pickup.id + '\')">' +
            '<i class="fas fa-edit"></i>' +
          '</button>' +
          '<button class="action-btn delete" onclick="deletePickup(\'' + pickup.id + '\')">' +
            '<i class="fas fa-trash"></i>' +
          '</button>' +
        '</td>' +
      '</tr>'
    ).join('');

    tableBody.innerHTML = tableHTML;
  }

  initializeUsers() {
    this.loadUsersTable();
  }

  loadUsersTable() {
    const tableBody = document.querySelector('#users-table tbody');
    if (!tableBody) return;

    const users = this.mockData.users.slice(0, 20);
    
    const tableHTML = users.map(user => 
      '<tr>' +
        '<td>' +
          '<div class="user-info">' +
            '<img src="' + user.avatar + '" alt="Avatar" class="user-avatar-small">' +
            '<span>' + user.name + '</span>' +
          '</div>' +
        '</td>' +
        '<td>' + user.email + '</td>' +
        '<td>' + user.joinDate.toLocaleDateString() + '</td>' +
        '<td>' + user.pickups + '</td>' +
        '<td><span class="status-badge ' + user.status + '">' + 
          user.status.charAt(0).toUpperCase() + user.status.slice(1) +
        '</span></td>' +
        '<td>' + user.points + '</td>' +
        '<td>' +
          '<button class="action-btn view" onclick="viewUser(\'' + user.id + '\')">' +
            '<i class="fas fa-eye"></i>' +
          '</button>' +
          '<button class="action-btn edit" onclick="editUser(\'' + user.id + '\')">' +
            '<i class="fas fa-edit"></i>' +
          '</button>' +
        '</td>' +
      '</tr>'
    ).join('');

    tableBody.innerHTML = tableHTML;
  }

  initializeCenters() {
    this.loadCentersGrid();
  }

  loadCentersGrid() {
    const centersGrid = document.getElementById('centers-grid');
    if (!centersGrid) return;

    const centers = this.mockData.centers;
    
    const centersHTML = centers.map(center => 
      '<div class="center-card">' +
        '<div class="center-header">' +
          '<h3>' + center.name + '</h3>' +
          '<span class="status-badge ' + center.status + '">' + center.status + '</span>' +
        '</div>' +
        '<div class="center-body">' +
          '<p><i class="fas fa-map-marker-alt"></i> ' + center.address + '</p>' +
          '<p><i class="fas fa-phone"></i> ' + center.phone + '</p>' +
          '<p><i class="fas fa-star"></i> ' + center.rating + ' rating</p>' +
          '<div class="capacity-bar">' +
            '<div class="capacity-label">Capacity: ' + center.currentLoad + '/' + center.capacity + '</div>' +
            '<div class="capacity-progress">' +
              '<div class="capacity-fill" style="width: ' + (center.currentLoad / center.capacity * 100) + '%"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="center-actions">' +
          '<button class="btn-secondary" onclick="viewCenter(\'' + center.id + '\')">' +
            '<i class="fas fa-eye"></i> View' +
          '</button>' +
          '<button class="btn-primary" onclick="editCenter(\'' + center.id + '\')">' +
            '<i class="fas fa-edit"></i> Edit' +
          '</button>' +
        '</div>' +
      '</div>'
    ).join('');

    centersGrid.innerHTML = centersHTML;
  }

  initializeAnalytics() {
    this.createAnalyticsCharts();
  }

  createAnalyticsCharts() {
    this.createRevenueChart();
    this.createUserGrowthChart();
    this.createEnvironmentalChart();
    this.createGeographicChart();
  }

  createRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas || this.charts.revenue) return;

    const ctx = canvas.getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    this.charts.revenue = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Revenue (₹)',
          data: this.mockData.analytics.revenue.monthly,
          backgroundColor: '#3B82F6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createUserGrowthChart() {
    const canvas = document.getElementById('user-growth-chart');
    if (!canvas || this.charts.userGrowth) return;

    const ctx = canvas.getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    this.charts.userGrowth = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'New Users',
          data: this.mockData.analytics.users.monthly,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createEnvironmentalChart() {
    const canvas = document.getElementById('environmental-chart');
    if (!canvas || this.charts.environmental) return;

    const ctx = canvas.getContext('2d');
    
    this.charts.environmental = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['CO₂ Reduced', 'Energy Saved', 'Water Saved', 'Waste Reduced', 'Trees Saved'],
        datasets: [{
          label: 'Environmental Impact',
          data: [85, 78, 92, 88, 76],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: '#10B981',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createGeographicChart() {
    const canvas = document.getElementById('geographic-chart');
    if (!canvas || this.charts.geographic) return;

    const ctx = canvas.getContext('2d');
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
    const pickupCounts = cities.map(() => Math.floor(Math.random() * 500) + 100);
    
    this.charts.geographic = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: cities,
        datasets: [{
          data: pickupCounts,
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  initializeSettings() {
    this.setupSettingsNavigation();
  }

  setupSettingsNavigation() {
    const settingsLinks = document.querySelectorAll('.settings-link');
    settingsLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links and sections
        settingsLinks.forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding section
        const targetId = link.getAttribute('href').substring(1) + '-settings';
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      });
    });
  }

  setupEventListeners() {
    // Search functionality
    this.setupSearchHandlers();
    
    // Filter functionality
    this.setupFilterHandlers();
    
    // Modal handlers
    this.setupModalHandlers();
    
    // Chart filter handlers
    this.setupChartFilterHandlers();
  }

  setupSearchHandlers() {
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        this.filterTableRows(searchTerm);
      });
    });
  }

  filterTableRows(searchTerm) {
    const currentTable = document.querySelector('.admin-section.active .data-table');
    if (!currentTable) return;

    const rows = currentTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  }

  setupFilterHandlers() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        this.applyFilter(filterValue);
      });
    });
  }

  applyFilter(filterValue) {
    // Implement filtering logic based on current section
    console.log('Applying filter:', filterValue);
  }

  setupModalHandlers() {
    const modal = document.getElementById('admin-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  setupChartFilterHandlers() {
    const chartFilters = document.querySelectorAll('.chart-filter');
    chartFilters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        const period = e.target.dataset.period;
        
        // Update active filter
        chartFilters.forEach(f => f.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update chart data based on period
        this.updateChartData(period);
      });
    });
  }

  updateChartData(period) {
    // Regenerate data based on selected period
    console.log('Updating charts for period:', period);
    
    // Update existing charts with new data
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.update) {
        // Generate new data based on period
        chart.update();
      }
    });
  }

  setupRealTimeUpdates() {
    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateRealTimeMetrics();
    }, 30000);
  }

  updateRealTimeMetrics() {
    // Simulate real-time metric updates
    const metrics = [
      { selector: '[data-count="1247"]', value: 1247 + Math.floor(Math.random() * 10) },
      { selector: '[data-count="892"]', value: 892 + Math.floor(Math.random() * 5) },
      { selector: '[data-count="15632"]', value: 15632 + Math.floor(Math.random() * 20) }
    ];

    metrics.forEach(metric => {
      const element = document.querySelector(metric.selector);
      if (element) {
        element.setAttribute('data-count', metric.value);
        this.animateCounter(element, metric.value, 1000);
      }
    });
  }

  showModal(title, content) {
    const modal = document.getElementById('admin-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.remove('hidden');
  }
}

// Global functions for action buttons
window.viewPickup = function(pickupId) {
  window.adminDashboard.showModal(
    'Pickup Details',
    '<p>Viewing details for pickup: ' + pickupId + '</p>' +
    '<div class="modal-actions">' +
      '<button class="btn-secondary" onclick="closeModal()">Close</button>' +
      '<button class="btn-primary" onclick="editPickup(\'' + pickupId + '\')">Edit</button>' +
    '</div>'
  );
};

window.editPickup = function(pickupId) {
  window.adminDashboard.showModal(
    'Edit Pickup',
    '<form class="edit-form">' +
      '<div class="form-group">' +
        '<label>Status</label>' +
        '<select>' +
          '<option>Pending</option>' +
          '<option>In Progress</option>' +
          '<option>Completed</option>' +
          '<option>Cancelled</option>' +
        '</select>' +
      '</div>' +
      '<div class="modal-actions">' +
        '<button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>' +
        '<button type="submit" class="btn-primary">Save Changes</button>' +
      '</div>' +
    '</form>'
  );
};

window.deletePickup = function(pickupId) {
  if (confirm('Are you sure you want to delete this pickup?')) {
    console.log('Deleting pickup:', pickupId);
    // Implement delete logic
  }
};

window.viewUser = function(userId) {
  window.adminDashboard.showModal(
    'User Details',
    '<p>Viewing details for user: ' + userId + '</p>'
  );
};

window.editUser = function(userId) {
  window.adminDashboard.showModal(
    'Edit User',
    '<p>Editing user: ' + userId + '</p>'
  );
};

window.viewCenter = function(centerId) {
  window.adminDashboard.showModal(
    'Center Details',
    '<p>Viewing details for center: ' + centerId + '</p>'
  );
};

window.editCenter = function(centerId) {
  window.adminDashboard.showModal(
    'Edit Center',
    '<p>Editing center: ' + centerId + '</p>'
  );
};

window.closeModal = function() {
  const modal = document.getElementById('admin-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
};

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adminDashboard = new AdminDashboard();
});

// Export for module systems
export { AdminDashboard };