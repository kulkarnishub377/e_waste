/**
 * E-Zero - Booking Form JavaScript
 * Placeholder for booking modal logic (the Django version uses server-side forms).
 */

// This file provides JS support for the booking form
document.addEventListener('DOMContentLoaded', () => {
  // Auto-set minimum date to today for pickup date fields
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });
});
