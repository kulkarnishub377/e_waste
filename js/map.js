// map.js - Enhanced map functionality with Leaflet and clustering
let map;
let markers = [];
let centersData = [];
let userLocation = null;
let searchTimeout;
let markerClusterGroup;
let currentFilters = {
  itemType: 'all',
  searchQuery: '',
  radius: 50 // km
};

// Default center coordinates (Mumbai, India)
const DEFAULT_CENTER = [19.0760, 72.8777];
const DEFAULT_ZOOM = 11;

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMap();
});

export function initMap() {
  try {
    console.log('🗺️ Initializing map...');
    
    // Initialize map with improved settings
    map = L.map('centers-map', {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
      tap: true,
      maxZoom: 18,
      minZoom: 8
    });

    // Add multiple tile layers for better coverage
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
      subdomains: ['a', 'b', 'c']
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '© Esri © OpenStreetMap contributors'
    });

    // Add default layer
    osmLayer.addTo(map);

    // Layer control
    const baseMaps = {
      "Street Map": osmLayer,
      "Satellite": satelliteLayer
    };
    L.control.layers(baseMaps).addTo(map);

    // Initialize marker cluster group with custom styling
    markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80,
      iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();
        let className = 'marker-cluster-small';
        
        if (childCount < 10) {
          className = 'marker-cluster-small';
        } else if (childCount < 100) {
          className = 'marker-cluster-medium';
        } else {
          className = 'marker-cluster-large';
        }

        return new L.DivIcon({
          html: `<div><span>${childCount}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: new L.Point(40, 40)
        });
      }
    });
    
    map.addLayer(markerClusterGroup);

    // Add custom CSS for cluster styling
    addClusterStyles();

    // Get user location and update map
    getUserLocation();

    // Load centers data
    loadCenters();

    // Initialize search and filter functionality
    initSearch();
    initFilters();

    // Add map controls
    addCustomControls();

    console.log('✅ Map initialized successfully');

  } catch (error) {
    console.error('❌ Map initialization failed:', error);
    showMapError('Failed to initialize map. Please refresh the page.');
  }
}

function addClusterStyles() {
  if (document.getElementById('cluster-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'cluster-styles';
  style.textContent = `
    .marker-cluster-small {
      background-color: rgba(16, 185, 129, 0.8);
    }
    .marker-cluster-small div {
      background-color: rgba(16, 185, 129, 1);
    }
    .marker-cluster-medium {
      background-color: rgba(59, 130, 246, 0.8);
    }
    .marker-cluster-medium div {
      background-color: rgba(59, 130, 246, 1);
    }
    .marker-cluster-large {
      background-color: rgba(139, 92, 246, 0.8);
    }
    .marker-cluster-large div {
      background-color: rgba(139, 92, 246, 1);
    }
    .marker-cluster {
      border-radius: 50%;
    }
    .marker-cluster div {
      width: 30px;
      height: 30px;
      margin-left: 5px;
      margin-top: 5px;
      text-align: center;
      border-radius: 50%;
      font-size: 12px;
      font-weight: bold;
      color: white;
      line-height: 30px;
    }
  `;
  document.head.appendChild(style);
}

function getUserLocation() {
  if (!('geolocation' in navigator)) {
    console.warn('⚠️ Geolocation not supported');
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5 minutes
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = [position.coords.latitude, position.coords.longitude];
      console.log('📍 User location found:', userLocation);
      
      // Add user location marker
      const userIcon = L.divIcon({
        html: '<i class="fas fa-user-circle text-blue-500 text-2xl"></i>',
        iconSize: [30, 30],
        className: 'user-location-marker'
      });
      
      L.marker(userLocation, { 
        icon: userIcon,
        zIndexOffset: 1000 
      })
      .addTo(map)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-sm mb-1">Your Location</h3>
          <p class="text-xs text-gray-600">Current position</p>
        </div>
      `);

      // Center map on user location
      map.setView(userLocation, 13);
      
      // Update distance calculations
      updateDistances();
      
    },
    (error) => {
      console.warn('⚠️ Geolocation error:', error.message);
      handleLocationError(error);
    },
    options
  );
}

function handleLocationError(error) {
  let message = 'Unable to get your location. ';
  
  switch(error.code) {
    case error.PERMISSION_DENIED:
      message += 'Location access denied by user.';
      break;
    case error.POSITION_UNAVAILABLE:
      message += 'Location information unavailable.';
      break;
    case error.TIMEOUT:
      message += 'Location request timed out.';
      break;
    default:
      message += 'Unknown location error.';
  }
  
  console.warn(message);
  
  // Show notification using global utility
  if (window.EZero?.utils?.showNotification) {
    window.EZero.utils.showNotification(message, 'warning');
  }
}

async function loadCenters() {
  try {
    console.log('📊 Loading centers data...');
    
    const response = await fetch('/data/centers.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    centersData = await response.json();
    console.log(`✅ Loaded ${centersData.length} centers`);
    
    // Display centers on map
    displayCenters(centersData);
    
    // Update center cards
    updateCenterCards(centersData);
    
  } catch (error) {
    console.error('❌ Failed to load centers:', error);
    showMapError('Failed to load recycling centers. Please try again.');
  }
}

function displayCenters(centers) {
  // Clear existing markers
  markerClusterGroup.clearLayers();
  markers = [];

  centers.forEach(center => {
    const marker = createCenterMarker(center);
    if (marker) {
      markers.push(marker);
      markerClusterGroup.addLayer(marker);
    }
  });
}

function createCenterMarker(center) {
  if (!center.latitude || !center.longitude) {
    console.warn('⚠️ Center missing coordinates:', center.name);
    return null;
  }

  // Create custom icon based on center type
  const iconColor = getIconColor(center);
  const icon = L.divIcon({
    html: `<div class="custom-marker" style="background-color: ${iconColor};">
             <i class="fas fa-recycle text-white"></i>
           </div>`,
    iconSize: [40, 40],
    className: 'custom-marker-container'
  });

  const marker = L.marker([center.latitude, center.longitude], { icon })
    .bindPopup(createPopupContent(center), {
      maxWidth: 300,
      className: 'custom-popup'
    });

  // Add click handler
  marker.on('click', () => {
    showCenterDetails(center);
    trackEvent('center_clicked', { center_id: center.id });
  });

  return marker;
}

function getIconColor(center) {
  if (center.verified) {
    return '#10B981'; // Green for verified
  } else if (center.rating >= 4) {
    return '#3B82F6'; // Blue for high rating
  } else {
    return '#8B5CF6'; // Purple for others
  }
}

function createPopupContent(center) {
  const distance = userLocation ? 
    calculateDistance(userLocation, [center.latitude, center.longitude]) : 
    null;
    
  const distanceText = distance ? `<span class="text-sm text-gray-500">${distance.toFixed(1)} km away</span>` : '';
  
  return `
    <div class="p-4 max-w-sm">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-bold text-lg text-gray-900">${center.name}</h3>
        ${center.verified ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Verified</span>' : ''}
      </div>
      
      <p class="text-gray-600 text-sm mb-2">${center.address}</p>
      
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-1">
          ${generateStarRating(center.rating)}
          <span class="text-sm text-gray-600 ml-1">(${center.rating})</span>
        </div>
        ${distanceText}
      </div>
      
      <div class="mb-3">
        <p class="text-sm font-semibold text-gray-900 mb-1">Accepted Items:</p>
        <div class="flex flex-wrap gap-1">
          ${center.acceptedItems.slice(0, 3).map(item => 
            `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${item}</span>`
          ).join('')}
          ${center.acceptedItems.length > 3 ? `<span class="text-xs text-gray-500">+${center.acceptedItems.length - 3} more</span>` : ''}
        </div>
      </div>
      
      <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
        <span><i class="fas fa-clock mr-1"></i>${center.timings}</span>
        <span><i class="fas fa-phone mr-1"></i>${center.contact}</span>
      </div>
      
      <div class="flex gap-2">
        <button onclick="getDirections(${center.latitude}, ${center.longitude})" 
                class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          <i class="fas fa-directions mr-1"></i>Directions
        </button>
        <button onclick="schedulePickup('${center.id}')" 
                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          <i class="fas fa-calendar-plus mr-1"></i>Schedule
        </button>
      </div>
    </div>
  `;
}

function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<i class="fas fa-star text-yellow-400"></i>';
    } else if (i === fullStars && hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    } else {
      stars += '<i class="far fa-star text-gray-300"></i>';
    }
  }
  
  return stars;
}

function showCenterDetails(center) {
  const detailsContainer = document.getElementById('center-details');
  if (!detailsContainer) return;

  const distance = userLocation ? 
    calculateDistance(userLocation, [center.latitude, center.longitude]) : 
    null;

  detailsContainer.innerHTML = `
    <div class="flex items-start space-x-4">
      <div class="flex-shrink-0">
        <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
          <i class="fas fa-recycle text-white text-2xl"></i>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900">${center.name}</h3>
            <p class="text-gray-600 mt-1">${center.address}</p>
          </div>
          ${center.verified ? '<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Verified</span>' : ''}
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-semibold text-gray-900">Rating:</span>
            <div class="flex items-center mt-1">
              ${generateStarRating(center.rating)}
              <span class="ml-1 text-gray-600">(${center.rating}/5)</span>
            </div>
          </div>
          <div>
            <span class="font-semibold text-gray-900">Distance:</span>
            <div class="mt-1 text-gray-600">
              ${distance ? `${distance.toFixed(1)} km away` : 'Location unavailable'}
            </div>
          </div>
          <div>
            <span class="font-semibold text-gray-900">Hours:</span>
            <div class="mt-1 text-gray-600">${center.timings}</div>
          </div>
          <div>
            <span class="font-semibold text-gray-900">Contact:</span>
            <div class="mt-1 text-gray-600">${center.contact}</div>
          </div>
        </div>
        
        <div class="mt-4">
          <span class="font-semibold text-gray-900">Accepted Items:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            ${center.acceptedItems.map(item => 
              `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">${item}</span>`
            ).join('')}
          </div>
        </div>
        
        <div class="mt-4 flex gap-3">
          <button onclick="getDirections(${center.latitude}, ${center.longitude})" 
                  class="btn btn-primary">
            <i class="fas fa-directions mr-2"></i>Get Directions
          </button>
          <button onclick="schedulePickup('${center.id}')" 
                  class="btn btn-secondary">
            <i class="fas fa-calendar-plus mr-2"></i>Schedule Pickup
          </button>
        </div>
      </div>
    </div>
  `;
  
  detailsContainer.classList.remove('hidden');
}

function initSearch() {
  const searchInput = document.getElementById('location-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    currentFilters.searchQuery = query;
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filterCenters();
    }, 300);
  });
  
  // Add clear search functionality
  const clearBtn = document.createElement('button');
  clearBtn.className = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600';
  clearBtn.innerHTML = '<i class="fas fa-times"></i>';
  clearBtn.onclick = () => {
    searchInput.value = '';
    currentFilters.searchQuery = '';
    filterCenters();
  };
  
  if (searchInput.parentElement.classList.contains('relative')) {
    searchInput.parentElement.appendChild(clearBtn);
  }
}

function initFilters() {
  const itemFilter = document.getElementById('item-filter');
  if (!itemFilter) return;

  itemFilter.addEventListener('change', (e) => {
    currentFilters.itemType = e.target.value;
    filterCenters();
  });
}

function filterCenters() {
  let filteredCenters = [...centersData];

  // Filter by search query
  if (currentFilters.searchQuery) {
    const query = currentFilters.searchQuery.toLowerCase();
    filteredCenters = filteredCenters.filter(center =>
      center.name.toLowerCase().includes(query) ||
      center.address.toLowerCase().includes(query) ||
      center.acceptedItems.some(item => item.toLowerCase().includes(query))
    );
  }

  // Filter by item type
  if (currentFilters.itemType && currentFilters.itemType !== 'all') {
    filteredCenters = filteredCenters.filter(center =>
      center.acceptedItems.some(item => 
        item.toLowerCase().includes(currentFilters.itemType.toLowerCase())
      )
    );
  }

  // Display filtered results
  displayCenters(filteredCenters);
  updateCenterCards(filteredCenters);
  
  console.log(`🔍 Filtered to ${filteredCenters.length} centers`);
}

function updateCenterCards(centers) {
  const cardsContainer = document.getElementById('centers-grid');
  if (!cardsContainer) return;

  if (centers.length === 0) {
    cardsContainer.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <i class="fas fa-search text-gray-400 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Centers Found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
        <button onclick="resetFilters()" class="btn btn-primary">
          <i class="fas fa-refresh mr-2"></i>Reset Filters
        </button>
      </div>
    `;
    return;
  }

  cardsContainer.innerHTML = centers.map(center => createCenterCard(center)).join('');
}

function createCenterCard(center) {
  const distance = userLocation ? 
    calculateDistance(userLocation, [center.latitude, center.longitude]) : 
    null;

  return `
    <div class="center-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
         onclick="focusOnCenter(${center.latitude}, ${center.longitude})">
      <div class="relative">
        <div class="h-48 bg-gradient-to-br ${getCardGradient(center)} flex items-center justify-center">
          <i class="fas fa-recycle text-white text-4xl"></i>
        </div>
        <div class="absolute top-4 right-4">
          ${center.verified ? 
            '<span class="bg-white bg-opacity-90 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">Verified</span>' :
            '<span class="bg-white bg-opacity-90 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">Unverified</span>'
          }
        </div>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-2">${center.name}</h3>
        <p class="text-gray-600 mb-4">${center.address}</p>
        
        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div class="flex items-center">
            <i class="fas fa-clock mr-1"></i>
            <span>${center.timings}</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-route mr-1"></i>
            <span>${distance ? `${distance.toFixed(1)} km` : 'N/A'}</span>
          </div>
        </div>
        
        <div class="flex items-center mb-4">
          ${generateStarRating(center.rating)}
          <span class="ml-2 text-sm text-gray-600">(${center.rating}/5)</span>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${center.acceptedItems.slice(0, 3).map(item => 
            `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">${item}</span>`
          ).join('')}
          ${center.acceptedItems.length > 3 ? 
            `<span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">+${center.acceptedItems.length - 3}</span>` : 
            ''
          }
        </div>
        
        <div class="flex gap-2">
          <button onclick="event.stopPropagation(); getDirections(${center.latitude}, ${center.longitude})" 
                  class="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-4 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm">
            <i class="fas fa-directions mr-1"></i>Directions
          </button>
          <button onclick="event.stopPropagation(); schedulePickup('${center.id}')" 
                  class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl transition-all duration-300 font-semibold text-sm">
            <i class="fas fa-calendar-plus mr-1"></i>Schedule
          </button>
        </div>
      </div>
    </div>
  `;
}

function getCardGradient(center) {
  if (center.verified) {
    return 'from-green-400 to-blue-500';
  } else if (center.rating >= 4) {
    return 'from-blue-400 to-purple-500';
  } else {
    return 'from-purple-400 to-pink-500';
  }
}

function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function updateDistances() {
  if (!userLocation) return;
  
  // Update distances in existing UI elements
  filterCenters();
}

function addCustomControls() {
  // Add location control
  const locationControl = L.Control.extend({
    onAdd: function(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.style.backgroundColor = 'white';
      container.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z\"/><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 11a3 3 0 11-6 0 3 3 0 016 0z\"/></svg>')";
      container.style.backgroundSize = '20px 20px';
      container.style.backgroundRepeat = 'no-repeat';
      container.style.backgroundPosition = 'center';
      container.style.width = '34px';
      container.style.height = '34px';
      container.style.cursor = 'pointer';
      container.title = 'Find my location';
      
      container.onclick = function() {
        getUserLocation();
      };
      
      return container;
    }
  });

  new locationControl({position: 'topright'}).addTo(map);
  
  // Add fullscreen control
  const fullscreenControl = L.Control.extend({
    onAdd: function(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.innerHTML = '<i class="fas fa-expand"></i>';
      container.style.backgroundColor = 'white';
      container.style.width = '34px';
      container.style.height = '34px';
      container.style.lineHeight = '34px';
      container.style.textAlign = 'center';
      container.style.cursor = 'pointer';
      container.title = 'Toggle fullscreen';
      
      container.onclick = function() {
        toggleFullscreen();
      };
      
      return container;
    }
  });

  new fullscreenControl({position: 'topright'}).addTo(map);
}

function toggleFullscreen() {
  const mapContainer = document.getElementById('centers-map');
  if (!mapContainer) return;

  if (!document.fullscreenElement) {
    mapContainer.requestFullscreen().then(() => {
      mapContainer.style.height = '100vh';
      map.invalidateSize();
    });
  } else {
    document.exitFullscreen().then(() => {
      mapContainer.style.height = '500px';
      map.invalidateSize();
    });
  }
}

function focusOnCenter(lat, lng) {
  if (map) {
    map.setView([lat, lng], 15);
    trackEvent('center_focused', { lat, lng });
  }
}

function showMapError(message) {
  const mapContainer = document.getElementById('centers-map');
  if (!mapContainer) return;

  mapContainer.innerHTML = `
    <div class="flex items-center justify-center h-full bg-gray-100 rounded-2xl">
      <div class="text-center p-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Map Error</h3>
        <p class="text-gray-600 mb-4">${message}</p>
        <button onclick="window.location.reload()" class="btn btn-primary">
          <i class="fas fa-refresh mr-2"></i>Reload Page
        </button>
      </div>
    </div>
  `;
}

// Global functions for HTML onclick handlers
window.getDirections = function(lat, lng) {
  if (userLocation) {
    const url = `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${lat},${lng}`;
    window.open(url, '_blank');
  } else {
    const url = `https://www.google.com/maps/search/${lat},${lng}`;
    window.open(url, '_blank');
  }
  trackEvent('directions_requested', { lat, lng });
};

window.schedulePickup = function(centerId) {
  console.log('📅 Scheduling pickup for center:', centerId);
  window.scrollToSection('pickup');
  
  // Pre-fill center information if available
  const center = centersData.find(c => c.id === centerId);
  if (center && window.prefillPickupForm) {
    window.prefillPickupForm(center);
  }
  
  trackEvent('pickup_scheduled', { center_id: centerId });
  
  if (window.EZero?.utils?.showNotification) {
    window.EZero.utils.showNotification('Redirecting to pickup form...', 'info');
  }
};

window.resetFilters = function() {
  currentFilters = {
    itemType: 'all',
    searchQuery: '',
    radius: 50
  };
  
  // Reset UI elements
  const searchInput = document.getElementById('location-search');
  const itemFilter = document.getElementById('item-filter');
  
  if (searchInput) searchInput.value = '';
  if (itemFilter) itemFilter.value = 'all';
  
  // Refresh display
  filterCenters();
  
  console.log('🔄 Filters reset');
};

function trackEvent(eventName, data = {}) {
  console.log(`📊 Event: ${eventName}`, data);
  // In a real app, send to analytics service
}

// Auto-initialize map when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
} 
                  class="btn btn-primary">
            <i class="fas fa-directions mr-2"></i>Get Directions
          </button>
          <button onclick="schedulePickup('${center.id}')" 
                  class="btn btn-secondary">
            <i class="fas fa-calendar-plus mr-2"></i>Schedule Pickup
          </button>
        </div>
      </div>
    </div>
  `;
  
  detailsContainer.classList.remove('hidden');
}

        // Add user location marker
        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
          iconSize: [16, 16]
        });

        L.marker(userLocation, { icon: userIcon })
          .addTo(map)
          .bindPopup('Your Location');

        // Center map on user location
        map.setView(userLocation, 13);
      },
      error => {
        console.log('Geolocation error:', error);
        // Fallback to default location
        map.setView([18.5204, 73.8567], 11);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
}

async function loadCenters() {
  try {
    const response = await fetch('data/centers.json');
    const data = await response.json();
    centersData = data.centers;
    displayCenters(centersData);
  } catch (error) {
    console.error('Error loading centers:', error);
    showNotification('Failed to load recycling centers. Please try again.', 'error');
  }
}

function displayCenters(centers) {
  // Clear existing markers
  markerClusterGroup.clearLayers();
  markers = [];

  const centersList = document.getElementById('centers-list');
  centersList.innerHTML = '';

  if (centers.length === 0) {
    centersList.innerHTML = '<p class="text-gray-500 text-center py-8">No centers found matching your criteria.</p>';
    return;
  }

  centers.forEach(center => {
    // Create custom marker icon
    const markerIcon = createMarkerIcon(center);

    const marker = L.marker([center.lat, center.lng], { icon: markerIcon });

    // Enhanced popup content
    const popupContent = createPopupContent(center);
    marker.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup'
    });

    // Add marker to cluster group
    markerClusterGroup.addLayer(marker);
    markers.push(marker);

    // Add to list with enhanced card
    const centerCard = createCenterCard(center);
    centersList.appendChild(centerCard);
  });

  // Fit map bounds to show all markers
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

function createMarkerIcon(center) {
  let markerClass = 'recycling-marker';
  let color = '#10B981'; // green for verified

  if (!center.verified) {
    color = '#F59E0B'; // amber for unverified
  }

  if (center.rating >= 4.5) {
    color = '#059669'; // emerald for highly rated
  }

  return L.divIcon({
    className: markerClass,
    html: `
      <div class="marker-pin" style="background-color: ${color}">
        <div class="marker-icon">
          <i class="fas fa-recycle text-white text-xs"></i>
        </div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
  });
}

function createPopupContent(center) {
  const ratingStars = createRatingStars(center.rating);
  const distance = userLocation ? calculateDistance(userLocation, [center.lat, center.lng]) : null;

  return `
    <div class="popup-content">
      <div class="popup-header">
        <h3 class="font-bold text-lg text-gray-900">${center.name}</h3>
        ${center.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
      </div>
      <div class="popup-body">
        <p class="text-sm text-gray-600 mb-2"><i class="fas fa-map-marker-alt mr-1"></i>${center.address}</p>
        <div class="rating mb-2">
          ${ratingStars}
          <span class="text-sm text-gray-600 ml-1">(${center.rating})</span>
        </div>
        ${distance ? `<p class="text-sm text-gray-600 mb-2"><i class="fas fa-route mr-1"></i>${distance.toFixed(1)} km away</p>` : ''}
        <div class="accepts mb-3">
          <p class="text-sm font-medium text-gray-700 mb-1">Accepts:</p>
          <div class="flex flex-wrap gap-1">
            ${center.accepts.map(item => `<span class="accept-tag">${item}</span>`).join('')}
          </div>
        </div>
        <div class="popup-actions">
          <button onclick="viewCenterDetails(${center.id})" class="btn-secondary text-xs">
            <i class="fas fa-info-circle mr-1"></i>Details
          </button>
          <button onclick="getDirections(${center.lat}, ${center.lng})" class="btn-primary text-xs ml-2">
            <i class="fas fa-directions mr-1"></i>Directions
          </button>
        </div>
      </div>
    </div>
  `;
}

function createRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return `
    ${'<i class="fas fa-star text-yellow-400"></i>'.repeat(fullStars)}
    ${hasHalfStar ? '<i class="fas fa-star-half-alt text-yellow-400"></i>' : ''}
    ${'<i class="far fa-star text-gray-300"></i>'.repeat(emptyStars)}
  `;
}

function createCenterCard(center) {
  const card = document.createElement('div');
  card.className = 'center-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300';

  const ratingStars = createRatingStars(center.rating);
  const distance = userLocation ? calculateDistance(userLocation, [center.lat, center.lng]) : null;

  card.innerHTML = `
    <div class="p-4">
      <div class="flex items-start justify-between mb-2">
        <h4 class="font-semibold text-gray-900">${center.name}</h4>
        ${center.verified ? '<i class="fas fa-check-circle text-green-500 text-sm"></i>' : ''}
      </div>
      <p class="text-sm text-gray-600 mb-2"><i class="fas fa-map-marker-alt mr-1"></i>${center.address}</p>
      <div class="flex items-center mb-2">
        ${ratingStars}
        <span class="text-sm text-gray-600 ml-1">(${center.rating})</span>
      </div>
      ${distance ? `<p class="text-xs text-gray-500 mb-2"><i class="fas fa-route mr-1"></i>${distance.toFixed(1)} km away</p>` : ''}
      <div class="flex flex-wrap gap-1 mb-3">
        ${center.accepts.slice(0, 3).map(item => `<span class="accept-tag-small">${item}</span>`).join('')}
        ${center.accepts.length > 3 ? `<span class="text-xs text-gray-500">+${center.accepts.length - 3} more</span>` : ''}
      </div>
      <div class="flex gap-2">
        <button onclick="viewCenterDetails(${center.id})" class="btn-secondary flex-1 text-sm">
          <i class="fas fa-info-circle mr-1"></i>Details
        </button>
        <button onclick="schedulePickup(${center.id})" class="btn-primary flex-1 text-sm">
          <i class="fas fa-calendar-plus mr-1"></i>Book
        </button>
      </div>
    </div>
  `;

  return card;
}

function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const dLat = (point2[0] - point1[0]) * Math.PI / 180;
  const dLon = (point2[1] - point1[1]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function initSearch() {
  const searchInput = document.getElementById('search-input');

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchCenters();
    }, 300);
  });

  // Search on Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchCenters();
    }
  });
}

function initFilters() {
  const filterSelect = document.getElementById('filter-select');
  const verifiedFilter = document.getElementById('verified-filter');
  const ratingFilter = document.getElementById('rating-filter');
  const sortSelect = document.getElementById('sort-select');

  [filterSelect, verifiedFilter, ratingFilter, sortSelect].forEach(filter => {
    filter.addEventListener('change', searchCenters);
  });
}

export function searchCenters() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const itemFilter = document.getElementById('filter-select').value;
  const verifiedOnly = document.getElementById('verified-filter').checked;
  const minRating = parseFloat(document.getElementById('rating-filter').value) || 0;
  const sortBy = document.getElementById('sort-select').value;

  let filtered = centersData.filter(center => {
    // Text search
    const matchesQuery = !query ||
      center.name.toLowerCase().includes(query) ||
      center.address.toLowerCase().includes(query) ||
      center.accepts.some(item => item.toLowerCase().includes(query));

    // Item type filter
    const matchesItem = !itemFilter || center.accepts.includes(itemFilter);

    // Verified filter
    const matchesVerified = !verifiedOnly || center.verified;

    // Rating filter
    const matchesRating = center.rating >= minRating;

    return matchesQuery && matchesItem && matchesVerified && matchesRating;
  });

  // Sort results
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        if (userLocation) {
          const distA = calculateDistance(userLocation, [a.lat, a.lng]);
          const distB = calculateDistance(userLocation, [b.lat, b.lng]);
          return distA - distB;
        }
        return 0;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  displayCenters(filtered);
}

// Global functions for popup buttons
window.viewCenterDetails = function(centerId) {
  const center = centersData.find(c => c.id === centerId);
  if (center) {
    showCenterDetailsModal(center);
  }
};

window.getDirections = function(lat, lng) {
  if (userLocation) {
    const url = `https://www.openstreetmap.org/directions?from=${userLocation[0]},${userLocation[1]}&to=${lat},${lng}&route=car`;
    window.open(url, '_blank');
  } else {
    showNotification('Unable to get directions without your location.', 'error');
  }
};

window.schedulePickup = function(centerId) {
  const center = centersData.find(c => c.id === centerId);
  if (center) {
    // Scroll to booking section
    document.getElementById('pickup').scrollIntoView({ behavior: 'smooth' });

    // Pre-fill center selection if possible
    const itemTypeSelect = document.getElementById('item-type');
    if (itemTypeSelect && center.accepts.length > 0) {
      itemTypeSelect.value = center.accepts[0];
    }

    showNotification(`Selected ${center.name} for pickup scheduling.`, 'success');
  }
};

function showCenterDetailsModal(center) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">${center.name}</h2>
            ${center.verified ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1"><i class="fas fa-check-circle mr-1"></i>Verified Center</span>' : ''}
          </div>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <h3 class="font-semibold text-gray-900 mb-2">Location & Contact</h3>
              <p class="text-gray-600 mb-2"><i class="fas fa-map-marker-alt mr-2"></i>${center.address}</p>
              <p class="text-gray-600 mb-2"><i class="fas fa-phone mr-2"></i>${center.phone || 'Not available'}</p>
              <p class="text-gray-600"><i class="fas fa-clock mr-2"></i>${center.hours || '9 AM - 6 PM'}</p>
            </div>

            <div class="mb-4">
              <h3 class="font-semibold text-gray-900 mb-2">Rating</h3>
              <div class="flex items-center">
                ${createRatingStars(center.rating)}
                <span class="ml-2 text-gray-600">(${center.rating})</span>
              </div>
              <p class="text-sm text-gray-500 mt-1">${center.reviews || 0} reviews</p>
            </div>
          </div>

          <div>
            <div class="mb-4">
              <h3 class="font-semibold text-gray-900 mb-2">Accepted Items</h3>
              <div class="grid grid-cols-2 gap-2">
                ${center.accepts.map(item => `
                  <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-check text-green-500 mr-2"></i>
                    ${item}
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="mb-4">
              <h3 class="font-semibold text-gray-900 mb-2">Services</h3>
              <div class="space-y-1">
                ${center.services ? center.services.map(service => `
                  <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-check text-green-500 mr-2"></i>
                    ${service}
                  </div>
                `).join('') : '<p class="text-gray-500">No additional services listed</p>'}
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button onclick="getDirections(${center.lat}, ${center.lng})" class="btn-primary flex-1">
            <i class="fas fa-directions mr-2"></i>Get Directions
          </button>
          <button onclick="schedulePickup(${center.id}); this.closest('.fixed').remove()" class="btn-secondary flex-1">
            <i class="fas fa-calendar-plus mr-2"></i>Schedule Pickup
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

document.addEventListener('DOMContentLoaded', initMap);