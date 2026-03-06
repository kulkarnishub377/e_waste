/**
 * E-Zero - Map Integration JavaScript
 * Uses Leaflet for showing recycling center locations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMap();
});

function initMap() {
  const mapContainer = document.getElementById('centers-map');
  if (!mapContainer) return;

  const map = L.map('centers-map').setView([20.5937, 78.9629], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);
  
  // Fix for map rendering issues in hidden or dynamic flex containers
  setTimeout(() => {
      map.invalidateSize();
  }, 100);

  // Load centers
  const apiUrl = window.CENTERS_API_URL || '/centers/api/';
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (data.centers && data.centers.length > 0) {
        const markers = L.markerClusterGroup();

        data.centers.forEach(center => {
          const marker = L.marker([center.lat, center.lng]);
          marker.bindPopup(`
            <div class="map-popup">
              <h4>${center.name}</h4>
              <p><i class="fas fa-map-marker-alt"></i> ${center.address}</p>
              <p><i class="fas fa-star"></i> ${center.rating} / 5.0</p>
              <p><i class="fas fa-clock"></i> ${center.hours}</p>
              ${center.contact ? `<p><i class="fas fa-phone"></i> ${center.contact}</p>` : ''}
              <div class="map-popup-services">
                ${center.services.map(s => `<span class="service-tag">${s}</span>`).join('')}
              </div>
            </div>
          `);
          markers.addLayer(marker);
        });

        map.addLayer(markers);
      }
    })
    .catch(err => console.error('Failed to load centers:', err));

  // Location search
  const searchInput = document.getElementById('location-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.center-card').forEach(card => {
        const city = (card.dataset.city || '').toLowerCase();
        const text = card.textContent.toLowerCase();
        card.style.display = (text.includes(query) || city.includes(query)) ? '' : 'none';
      });
    });
  }
}
