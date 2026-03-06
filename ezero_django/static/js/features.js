/**
 * E-Zero - Additional Features JavaScript
 * FAQ toggle is handled in app.js
 * This file contains any additional interactive features.
 */

// Smooth reveal for article modals (if used)
function openArticleModal(articleSlug) {
  // In Django version, articles open as separate pages
  window.location.href = `/blog/${articleSlug}/`;
}
window.openArticleModal = openArticleModal;

function closeArticleModal() {
  // Handled by page navigation in Django version
  window.history.back();
}
window.closeArticleModal = closeArticleModal;
