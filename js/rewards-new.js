// rewards.js - Advanced rewards and gamification system with real-time updates

class RewardsSystem {
  constructor() {
    this.userData = {
      points: 0,
      level: 1,
      achievements: [],
      activities: [],
      streak: 0,
      totalRecycled: 0,
      badges: [],
      lastActivity: null,
      joinDate: new Date().toISOString(),
      preferences: {
        notifications: true,
        leaderboard: true,
        achievements: true
      }
    };

    this.achievements = [
      { 
        id: 'first_pickup', 
        name: 'First Steps', 
        description: 'Complete your first e-waste pickup', 
        points: 50, 
        icon: 'fas fa-star', 
        category: 'milestone',
        rarity: 'common'
      },
      { 
        id: 'recycle_5', 
        name: 'Eco Warrior', 
        description: 'Recycle 5 different items', 
        points: 100, 
        icon: 'fas fa-shield-alt',
        category: 'milestone',
        rarity: 'uncommon'
      },
      { 
        id: 'points_500', 
        name: 'Point Master', 
        description: 'Accumulate 500 total points', 
        points: 200, 
        icon: 'fas fa-trophy',
        category: 'points',
        rarity: 'rare'
      },
      { 
        id: 'streak_7', 
        name: 'Consistent Recycler', 
        description: 'Maintain a 7-day recycling streak', 
        points: 150, 
        icon: 'fas fa-fire',
        category: 'streak',
        rarity: 'rare'
      },
      { 
        id: 'level_5', 
        name: 'Eco Champion', 
        description: 'Reach level 5', 
        points: 300, 
        icon: 'fas fa-crown',
        category: 'level',
        rarity: 'epic'
      },
      { 
        id: 'referral_3', 
        name: 'Community Builder', 
        description: 'Successfully refer 3 friends', 
        points: 250, 
        icon: 'fas fa-users',
        category: 'social',
        rarity: 'rare'
      },
      { 
        id: 'earth_saver', 
        name: 'Earth Saver', 
        description: 'Recycle 100kg of e-waste', 
        points: 500, 
        icon: 'fas fa-globe-americas',
        category: 'impact',
        rarity: 'legendary'
      },
      { 
        id: 'night_owl', 
        name: 'Night Owl', 
        description: 'Schedule pickup between 6PM-8PM', 
        points: 25, 
        icon: 'fas fa-moon',
        category: 'special',
        rarity: 'uncommon'
      },
      { 
        id: 'early_bird', 
        name: 'Early Bird', 
        description: 'Schedule pickup before 10AM', 
        points: 25, 
        icon: 'fas fa-sun',
        category: 'special',
        rarity: 'uncommon'
      },
      { 
        id: 'weekend_warrior', 
        name: 'Weekend Warrior', 
        description: 'Recycle on weekends', 
        points: 30, 
        icon: 'fas fa-calendar-weekend',
        category: 'special',
        rarity: 'uncommon'
      }
    ];

    this.pointValues = {
      pickup: 25,
      referral: 50,
      review: 10,
      share: 5,
      daily_login: 5,
      achievement: 0, // Variable based on achievement
      bonus_weekend: 10,
      bonus_streak: 5
    };

    this.levelSystem = {
      pointsPerLevel: 100,
      maxLevel: 50,
      levelBonuses: {
        5: { type: 'discount', value: 5, description: '5% pickup discount' },
        10: { type: 'discount', value: 10, description: '10% pickup discount' },
        15: { type: 'priority', value: 1, description: 'Priority pickup scheduling' },
        20: { type: 'discount', value: 15, description: '15% pickup discount' },
        25: { type: 'exclusive', value: 1, description: 'Access to exclusive events' },
        30: { type: 'discount', value: 20, description: '20% pickup discount' },
        40: { type: 'vip', value: 1, description: 'VIP customer status' },
        50: { type: 'legend', value: 1, description: 'Legend status & special badge' }
      }
    };

    this.redeemableRewards = [
      { 
        id: 'discount_5', 
        name: '5% Pickup Discount', 
        cost: 100, 
        category: 'discount',
        icon: 'fas fa-percentage',
        description: 'Get 5% off your next pickup',
        availability: 'unlimited'
      },
      { 
        id: 'discount_10', 
        name: '10% Pickup Discount', 
        cost: 200, 
        category: 'discount',
        icon: 'fas fa-tags',
        description: 'Get 10% off your next pickup',
        availability: 'unlimited'
      },
      { 
        id: 'priority_slot', 
        name: 'Priority Time Slot', 
        cost: 150, 
        category: 'service',
        icon: 'fas fa-clock',
        description: 'Get priority booking for preferred time slots',
        availability: 'limited'
      },
      { 
        id: 'free_pickup', 
        name: 'Free Pickup Service', 
        cost: 500, 
        category: 'service',
        icon: 'fas fa-truck',
        description: 'One free pickup service (up to 5 items)',
        availability: 'limited'
      },
      { 
        id: 'eco_certificate', 
        name: 'Eco-Warrior Certificate', 
        cost: 300, 
        category: 'certificate',
        icon: 'fas fa-certificate',
        description: 'Digital certificate of your environmental contribution',
        availability: 'unlimited'
      },
      { 
        id: 'plant_tree', 
        name: 'Plant a Tree', 
        cost: 250, 
        category: 'impact',
        icon: 'fas fa-tree',
        description: 'We plant a tree in your name',
        availability: 'limited'
      }
    ];

    this.init();
  }

  init() {
    this.loadUserData();
    this.setupUI();
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupNotifications();
    this.updateRealTimeData();
    console.log('🏆 Rewards system initialized');
  }

  loadUserData() {
    const saved = localStorage.getItem('eZero_userData');
    if (saved) {
      this.userData = { ...this.userData, ...JSON.parse(saved) };
    } else {
      // Initialize with sample data for demo
      this.userData = {
        ...this.userData,
        points: 485,
        level: 4,
        achievements: ['first_pickup', 'recycle_5', 'points_500'],
        activities: [
          { 
            type: 'pickup', 
            description: 'Recycled laptop and accessories', 
            points: 50, 
            date: new Date(Date.now() - 86400000).toISOString(),
            icon: 'fas fa-laptop',
            impact: '2.5kg e-waste recycled'
          },
          { 
            type: 'referral', 
            description: 'Referred Sarah Johnson', 
            points: 50, 
            date: new Date(Date.now() - 172800000).toISOString(),
            icon: 'fas fa-user-plus',
            impact: 'New user joined'
          },
          { 
            type: 'achievement', 
            description: 'Unlocked Point Master achievement', 
            points: 200, 
            date: new Date(Date.now() - 259200000).toISOString(),
            icon: 'fas fa-trophy',
            impact: 'Achievement unlocked'
          },
          { 
            type: 'pickup', 
            description: 'Recycled mobile phones and chargers', 
            points: 30, 
            date: new Date(Date.now() - 345600000).toISOString(),
            icon: 'fas fa-mobile-alt',
            impact: '1.2kg e-waste recycled'
          }
        ],
        streak: 3,
        totalRecycled: 15,
        badges: ['eco-warrior', 'point-master'],
        lastActivity: new Date(Date.now() - 86400000).toISOString()
      };
    }
    this.saveUserData();
  }

  saveUserData() {
    localStorage.setItem('eZero_userData', JSON.stringify(this.userData));
  }

  setupUI() {
    this.renderDashboard();
    this.renderAchievements();
    this.renderLeaderboard();
    this.renderRedeemableRewards();
    this.renderActivityHistory();
    this.renderProgressTracking();
  }

  renderDashboard() {
    const dashboardContainer = document.getElementById('rewards-dashboard');
    if (!dashboardContainer) return;

    const currentLevel = this.userData.level;
    const pointsForCurrentLevel = (currentLevel - 1) * this.levelSystem.pointsPerLevel;
    const pointsForNextLevel = currentLevel * this.levelSystem.pointsPerLevel;
    const progressPercent = ((this.userData.points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;

    dashboardContainer.innerHTML = 
      '<div class="rewards-summary">' +
        '<div class="stats-grid">' +
          '<div class="stat-card primary">' +
            '<div class="stat-icon"><i class="fas fa-coins"></i></div>' +
            '<div class="stat-content">' +
              '<h3 class="stat-value" data-count="' + this.userData.points + '">0</h3>' +
              '<p class="stat-label">Total Points</p>' +
            '</div>' +
          '</div>' +
          '<div class="stat-card secondary">' +
            '<div class="stat-icon"><i class="fas fa-level-up-alt"></i></div>' +
            '<div class="stat-content">' +
              '<h3 class="stat-value">Level ' + this.userData.level + '</h3>' +
              '<p class="stat-label">Current Level</p>' +
            '</div>' +
          '</div>' +
          '<div class="stat-card success">' +
            '<div class="stat-icon"><i class="fas fa-fire"></i></div>' +
            '<div class="stat-content">' +
              '<h3 class="stat-value">' + this.userData.streak + ' days</h3>' +
              '<p class="stat-label">Current Streak</p>' +
            '</div>' +
          '</div>' +
          '<div class="stat-card warning">' +
            '<div class="stat-icon"><i class="fas fa-trophy"></i></div>' +
            '<div class="stat-content">' +
              '<h3 class="stat-value">' + this.userData.achievements.length + '/' + this.achievements.length + '</h3>' +
              '<p class="stat-label">Achievements</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        
        '<div class="level-progress">' +
          '<div class="progress-header">' +
            '<h4>Level Progress</h4>' +
            '<span class="level-info">Level ' + currentLevel + ' → ' + (currentLevel + 1) + '</span>' +
          '</div>' +
          '<div class="progress-bar">' +
            '<div class="progress-fill" style="width: ' + Math.min(progressPercent, 100) + '%"></div>' +
          '</div>' +
          '<div class="progress-text">' +
            '<span>' + (this.userData.points - pointsForCurrentLevel) + ' / ' + (pointsForNextLevel - pointsForCurrentLevel) + ' points</span>' +
          '</div>' +
        '</div>' +

        '<div class="quick-actions">' +
          '<h4>Quick Actions</h4>' +
          '<div class="action-buttons">' +
            '<button class="action-btn" onclick="schedulePickup()"><i class="fas fa-calendar-plus"></i> Schedule Pickup</button>' +
            '<button class="action-btn" onclick="inviteFriend()"><i class="fas fa-user-plus"></i> Invite Friend</button>' +
            '<button class="action-btn" onclick="shareAchievement()"><i class="fas fa-share"></i> Share Achievement</button>' +
            '<button class="action-btn" onclick="viewCertificate()"><i class="fas fa-certificate"></i> View Certificate</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    this.animateCounters();
  }

  renderAchievements() {
    const achievementsContainer = document.getElementById('achievements-grid');
    if (!achievementsContainer) return;

    const achievementsHTML = this.achievements.map(achievement => {
      const isUnlocked = this.userData.achievements.includes(achievement.id);
      const rarityClass = 'rarity-' + achievement.rarity;
      
      return '<div class="achievement-card ' + (isUnlocked ? 'unlocked' : 'locked') + ' ' + rarityClass + '">' +
        '<div class="achievement-icon">' +
          '<i class="' + achievement.icon + '"></i>' +
          (isUnlocked ? '<div class="unlock-badge"><i class="fas fa-check"></i></div>' : '') +
        '</div>' +
        '<div class="achievement-content">' +
          '<h4 class="achievement-name">' + achievement.name + '</h4>' +
          '<p class="achievement-description">' + achievement.description + '</p>' +
          '<div class="achievement-meta">' +
            '<span class="achievement-points"><i class="fas fa-coins"></i> ' + achievement.points + ' points</span>' +
            '<span class="achievement-rarity">' + achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1) + '</span>' +
          '</div>' +
          (isUnlocked ? 
            '<div class="achievement-unlocked">Unlocked!</div>' : 
            '<div class="achievement-progress">Progress: ' + this.getAchievementProgress(achievement) + '</div>'
          ) +
        '</div>' +
      '</div>';
    }).join('');

    achievementsContainer.innerHTML = achievementsHTML;
  }

  renderLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard-list');
    if (!leaderboardContainer) return;

    // Mock leaderboard data
    const leaderboardData = [
      { rank: 1, name: 'Alex Chen', points: 1250, avatar: '👨‍💼', level: 8 },
      { rank: 2, name: 'Sarah Wilson', points: 1100, avatar: '👩‍🔬', level: 7 },
      { rank: 3, name: 'Mike Johnson', points: 950, avatar: '👨‍🎓', level: 6 },
      { rank: 4, name: 'You', points: this.userData.points, avatar: '👤', level: this.userData.level },
      { rank: 5, name: 'Emma Davis', points: 420, avatar: '👩‍🎨', level: 3 },
      { rank: 6, name: 'John Smith', points: 380, avatar: '👨‍🔧', level: 3 },
      { rank: 7, name: 'Lisa Brown', points: 340, avatar: '👩‍💻', level: 2 },
      { rank: 8, name: 'David Lee', points: 290, avatar: '👨‍🏫', level: 2 }
    ];

    // Sort by points and update ranks
    leaderboardData.sort((a, b) => b.points - a.points);
    leaderboardData.forEach((user, index) => {
      user.rank = index + 1;
    });

    const leaderboardHTML = leaderboardData.map(user => {
      const isCurrentUser = user.name === 'You';
      const rankClass = user.rank <= 3 ? 'top-rank rank-' + user.rank : '';
      
      return '<div class="leaderboard-entry ' + (isCurrentUser ? 'current-user' : '') + ' ' + rankClass + '">' +
        '<div class="rank-badge">' +
          (user.rank === 1 ? '<i class="fas fa-crown"></i>' : 
           user.rank === 2 ? '<i class="fas fa-medal"></i>' : 
           user.rank === 3 ? '<i class="fas fa-award"></i>' : 
           '#' + user.rank) +
        '</div>' +
        '<div class="user-avatar">' + user.avatar + '</div>' +
        '<div class="user-info">' +
          '<h4 class="user-name">' + user.name + '</h4>' +
          '<p class="user-level">Level ' + user.level + '</p>' +
        '</div>' +
        '<div class="user-points">' +
          '<span class="points-value">' + user.points.toLocaleString() + '</span>' +
          '<span class="points-label">points</span>' +
        '</div>' +
      '</div>';
    }).join('');

    leaderboardContainer.innerHTML = leaderboardHTML;
  }

  renderRedeemableRewards() {
    const rewardsContainer = document.getElementById('redeemable-rewards');
    if (!rewardsContainer) return;

    const rewardsHTML = this.redeemableRewards.map(reward => {
      const canAfford = this.userData.points >= reward.cost;
      const availabilityClass = reward.availability === 'limited' ? 'limited' : 'unlimited';
      
      return '<div class="reward-card ' + availabilityClass + ' ' + (canAfford ? 'affordable' : 'expensive') + '">' +
        '<div class="reward-icon">' +
          '<i class="' + reward.icon + '"></i>' +
        '</div>' +
        '<div class="reward-content">' +
          '<h4 class="reward-name">' + reward.name + '</h4>' +
          '<p class="reward-description">' + reward.description + '</p>' +
          '<div class="reward-cost">' +
            '<i class="fas fa-coins"></i> ' + reward.cost + ' points' +
          '</div>' +
          '<button class="redeem-btn ' + (canAfford ? 'enabled' : 'disabled') + '" ' +
            'onclick="redeemReward(\'' + reward.id + '\')" ' +
            (canAfford ? '' : 'disabled') + '>' +
            (canAfford ? 'Redeem' : 'Insufficient Points') +
          '</button>' +
        '</div>' +
        (reward.availability === 'limited' ? 
          '<div class="availability-badge">Limited</div>' : 
          ''
        ) +
      '</div>';
    }).join('');

    rewardsContainer.innerHTML = rewardsHTML;
  }

  renderActivityHistory() {
    const activityContainer = document.getElementById('activity-history');
    if (!activityContainer) return;

    const activitiesHTML = this.userData.activities.slice(0, 10).map(activity => {
      const activityDate = new Date(activity.date);
      const timeAgo = this.getTimeAgo(activityDate);
      
      return '<div class="activity-item">' +
        '<div class="activity-icon">' +
          '<i class="' + activity.icon + '"></i>' +
        '</div>' +
        '<div class="activity-content">' +
          '<h4 class="activity-description">' + activity.description + '</h4>' +
          '<p class="activity-impact">' + activity.impact + '</p>' +
          '<div class="activity-meta">' +
            '<span class="activity-points">+' + activity.points + ' points</span>' +
            '<span class="activity-time">' + timeAgo + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    activityContainer.innerHTML = activitiesHTML || 
      '<div class="no-activities">' +
        '<i class="fas fa-clock"></i>' +
        '<p>No recent activities</p>' +
      '</div>';
  }

  renderProgressTracking() {
    const trackingContainer = document.getElementById('progress-tracking');
    if (!trackingContainer) return;

    const weeklyData = this.generateWeeklyData();
    const impactStats = this.calculateImpactStats();
    
    trackingContainer.innerHTML = 
      '<div class="progress-sections">' +
        '<div class="weekly-progress">' +
          '<h4><i class="fas fa-chart-line"></i> Weekly Progress</h4>' +
          '<div class="weekly-chart">' +
            this.renderWeeklyChart(weeklyData) +
          '</div>' +
        '</div>' +
        
        '<div class="impact-stats">' +
          '<h4><i class="fas fa-leaf"></i> Environmental Impact</h4>' +
          '<div class="impact-grid">' +
            '<div class="impact-item">' +
              '<div class="impact-icon"><i class="fas fa-weight"></i></div>' +
              '<div class="impact-value">' + impactStats.totalWeight + 'kg</div>' +
              '<div class="impact-label">E-waste Recycled</div>' +
            '</div>' +
            '<div class="impact-item">' +
              '<div class="impact-icon"><i class="fas fa-seedling"></i></div>' +
              '<div class="impact-value">' + impactStats.treesEquivalent + '</div>' +
              '<div class="impact-label">Trees Saved</div>' +
            '</div>' +
            '<div class="impact-item">' +
              '<div class="impact-icon"><i class="fas fa-bolt"></i></div>' +
              '<div class="impact-value">' + impactStats.energySaved + 'kWh</div>' +
              '<div class="impact-label">Energy Saved</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  getAchievementProgress(achievement) {
    switch (achievement.id) {
      case 'recycle_5':
        return Math.min(this.userData.totalRecycled, 5) + '/5';
      case 'points_500':
        return Math.min(this.userData.points, 500) + '/500';
      case 'streak_7':
        return Math.min(this.userData.streak, 7) + '/7 days';
      case 'level_5':
        return Math.min(this.userData.level, 5) + '/5';
      case 'referral_3':
        const referrals = this.userData.activities.filter(a => a.type === 'referral').length;
        return Math.min(referrals, 3) + '/3';
      default:
        return '0/1';
    }
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
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  setupEventListeners() {
    // Achievement modal handling
    document.addEventListener('click', (e) => {
      if (e.target.closest('.achievement-card.unlocked')) {
        this.showAchievementModal(e.target.closest('.achievement-card'));
      }
    });

    // Real-time updates
    this.setupRealtimeUpdates();
  }

  setupRealtimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
      this.checkForNewAchievements();
      this.updateStreakCounter();
    }, 30000); // Check every 30 seconds
  }

  initializeAnimations() {
    // Setup intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    });

    // Observe all reward cards and achievement cards
    document.querySelectorAll('.achievement-card, .reward-card, .stat-card').forEach(card => {
      observer.observe(card);
    });
  }

  setupNotifications() {
    if ('Notification' in window && this.userData.preferences.notifications) {
      Notification.requestPermission();
    }
  }

  updateRealTimeData() {
    // Simulate real-time leaderboard updates
    setInterval(() => {
      this.renderLeaderboard();
    }, 60000); // Update every minute
  }

  addPoints(amount, reason, activityData = {}) {
    this.userData.points += amount;
    
    // Add to activity history
    this.userData.activities.unshift({
      type: activityData.type || 'points',
      description: reason,
      points: amount,
      date: new Date().toISOString(),
      icon: activityData.icon || 'fas fa-coins',
      impact: activityData.impact || 'Points earned'
    });

    // Check for level up
    this.checkLevelUp();
    
    // Check for achievements
    this.checkForNewAchievements();
    
    // Save data
    this.saveUserData();
    
    // Update UI
    this.renderDashboard();
    this.renderActivityHistory();
    
    // Show notification
    this.showPointsNotification(amount, reason);
  }

  checkLevelUp() {
    const newLevel = Math.floor(this.userData.points / this.levelSystem.pointsPerLevel) + 1;
    
    if (newLevel > this.userData.level && newLevel <= this.levelSystem.maxLevel) {
      const oldLevel = this.userData.level;
      this.userData.level = newLevel;
      
      // Check for level bonus
      const bonus = this.levelSystem.levelBonuses[newLevel];
      if (bonus) {
        this.showLevelUpModal(oldLevel, newLevel, bonus);
      } else {
        this.showLevelUpModal(oldLevel, newLevel);
      }
    }
  }

  checkForNewAchievements() {
    this.achievements.forEach(achievement => {
      if (!this.userData.achievements.includes(achievement.id)) {
        if (this.isAchievementUnlocked(achievement)) {
          this.unlockAchievement(achievement);
        }
      }
    });
  }

  isAchievementUnlocked(achievement) {
    switch (achievement.id) {
      case 'first_pickup':
        return this.userData.activities.some(a => a.type === 'pickup');
      case 'recycle_5':
        return this.userData.totalRecycled >= 5;
      case 'points_500':
        return this.userData.points >= 500;
      case 'streak_7':
        return this.userData.streak >= 7;
      case 'level_5':
        return this.userData.level >= 5;
      case 'referral_3':
        return this.userData.activities.filter(a => a.type === 'referral').length >= 3;
      case 'earth_saver':
        return this.calculateTotalWeight() >= 100;
      default:
        return false;
    }
  }

  unlockAchievement(achievement) {
    this.userData.achievements.push(achievement.id);
    this.userData.points += achievement.points;
    
    // Add activity
    this.userData.activities.unshift({
      type: 'achievement',
      description: 'Unlocked "' + achievement.name + '" achievement',
      points: achievement.points,
      date: new Date().toISOString(),
      icon: achievement.icon,
      impact: 'Achievement unlocked'
    });

    this.saveUserData();
    this.renderAchievements();
    this.renderDashboard();
    this.showAchievementModal(achievement, true);
  }

  showAchievementModal(achievement, isNew = false) {
    // Create modal for achievement details
    const modal = document.createElement('div');
    modal.className = 'achievement-modal';
    modal.innerHTML = 
      '<div class="modal-content achievement-modal-content">' +
        '<div class="modal-header">' +
          '<h3>' + (isNew ? '🎉 Achievement Unlocked!' : 'Achievement Details') + '</h3>' +
          '<button class="close-modal" onclick="closeModal()">&times;</button>' +
        '</div>' +
        '<div class="achievement-details">' +
          '<div class="achievement-icon-large">' +
            '<i class="' + achievement.icon + '"></i>' +
          '</div>' +
          '<h2>' + achievement.name + '</h2>' +
          '<p>' + achievement.description + '</p>' +
          '<div class="achievement-reward">' +
            '<i class="fas fa-coins"></i> ' + achievement.points + ' Points Earned' +
          '</div>' +
        '</div>' +
      '</div>';
    
    document.body.appendChild(modal);
    
    // Auto-close after 3 seconds if new achievement
    if (isNew) {
      setTimeout(() => {
        this.closeModal(modal);
      }, 3000);
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.remove();
    } else {
      const existingModal = document.querySelector('.achievement-modal');
      if (existingModal) existingModal.remove();
    }
  }

  generateWeeklyData() {
    // Generate mock weekly data for the chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day: day,
      points: Math.floor(Math.random() * 50) + 10,
      activities: Math.floor(Math.random() * 3) + 1
    }));
  }

  renderWeeklyChart(data) {
    const maxPoints = Math.max(...data.map(d => d.points));
    
    return '<div class="chart-container">' +
      data.map(dayData => 
        '<div class="chart-bar">' +
          '<div class="bar" style="height: ' + (dayData.points / maxPoints * 100) + '%" title="' + dayData.points + ' points"></div>' +
          '<span class="bar-label">' + dayData.day + '</span>' +
        '</div>'
      ).join('') +
    '</div>';
  }

  calculateImpactStats() {
    const totalWeight = this.calculateTotalWeight();
    return {
      totalWeight: totalWeight,
      treesEquivalent: Math.floor(totalWeight * 0.1),
      energySaved: Math.floor(totalWeight * 15.5)
    };
  }

  calculateTotalWeight() {
    return this.userData.activities
      .filter(a => a.type === 'pickup')
      .reduce((total, activity) => {
        const weight = parseFloat((activity.impact || '0').match(/[\d.]+/)?.[0] || 0);
        return total + weight;
      }, 0);
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + ' days ago';
    return Math.floor(diffInSeconds / 604800) + ' weeks ago';
  }

  showPointsNotification(points, reason) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Points Earned!', {
        body: '+' + points + ' points for ' + reason,
        icon: '/favicon.ico'
      });
    }

    // Show in-app notification
    this.showInAppNotification('+' + points + ' points earned!', 'success');
  }

  showInAppNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = 
      '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'info-circle') + '"></i>' +
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
}

// Global functions for HTML onclick handlers
window.schedulePickup = function() {
  window.scrollToSection('pickup');
  console.log('📅 Redirecting to pickup scheduling');
};

window.inviteFriend = function() {
  if (navigator.share) {
    navigator.share({
      title: 'Join E-Zero - Eco-friendly E-Waste Recycling',
      text: 'I\'ve been using E-Zero for recycling e-waste. Join me and earn points for helping the environment!',
      url: window.location.origin
    });
  } else {
    // Fallback for browsers without Web Share API
    const shareUrl = encodeURIComponent(window.location.origin);
    const shareText = encodeURIComponent('Join me on E-Zero for eco-friendly e-waste recycling!');
    window.open('https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareUrl, '_blank');
  }
  
  console.log('👥 Sharing referral link');
};

window.shareAchievement = function() {
  const latestAchievement = window.rewardsSystem?.userData.achievements.slice(-1)[0];
  const shareText = latestAchievement ? 
    'I just unlocked a new achievement on E-Zero! 🏆' : 
    'Check out my progress on E-Zero! 🌱';
    
  if (navigator.share) {
    navigator.share({
      title: 'E-Zero Achievement',
      text: shareText,
      url: window.location.origin
    });
  } else {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText), '_blank');
  }
};

window.viewCertificate = function() {
  alert('Certificate feature coming soon! 📜');
  console.log('📜 Viewing eco-warrior certificate');
};

window.redeemReward = function(rewardId) {
  if (!window.rewardsSystem) return;
  
  const reward = window.rewardsSystem.redeemableRewards.find(r => r.id === rewardId);
  if (!reward) return;
  
  if (window.rewardsSystem.userData.points >= reward.cost) {
    if (confirm('Redeem "' + reward.name + '" for ' + reward.cost + ' points?')) {
      window.rewardsSystem.userData.points -= reward.cost;
      window.rewardsSystem.saveUserData();
      window.rewardsSystem.renderDashboard();
      window.rewardsSystem.renderRedeemableRewards();
      
      window.rewardsSystem.showInAppNotification('Successfully redeemed: ' + reward.name, 'success');
      console.log('🎁 Redeemed reward:', reward.name);
    }
  } else {
    alert('Insufficient points to redeem this reward.');
  }
};

window.closeModal = function() {
  const modal = document.querySelector('.achievement-modal');
  if (modal) modal.remove();
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rewards-dashboard')) {
    window.rewardsSystem = new RewardsSystem();
  }
});

// Export for module systems
export { RewardsSystem };