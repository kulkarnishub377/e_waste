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

        const sidebarList = document.getElementById('centers-sidebar-list');
        if (sidebarList) {
          sidebarList.innerHTML = ''; // clear loading state
        }
        
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

          // Build sidebar item
          if (sidebarList) {
            const card = document.createElement('div');
            card.className = 'sidebar-item';
            card.dataset.city = center.city || '';
            card.innerHTML = `
              <h5 style="color:var(--text-pure); margin-bottom:0.25rem;">${center.name}</h5>
              <p style="color:var(--text-muted); font-size:0.875rem; margin-bottom:0.5rem;"><i class="fas fa-map-marker-alt"></i> ${center.address}</p>
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                ${center.services.slice(0, 2).map(s => `<span class="badge badge-cyan" style="font-size:0.65rem;">${s}</span>`).join('')}
              </div>
            `;
            card.addEventListener('click', () => {
              map.setView([center.lat, center.lng], 14);
              marker.openPopup();
            });
            sidebarList.appendChild(card);
          }
        });

        map.addLayer(markers);
      }
    })
    .catch(err => console.error('Failed to load centers:', err));

  // Location search
  const searchInput = document.getElementById('center-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.sidebar-item').forEach(card => {
        const city = (card.dataset.city || '').toLowerCase();
        const text = card.textContent.toLowerCase();
        card.style.display = (text.includes(query) || city.includes(query)) ? '' : 'none';
      });
    });
  }
}
