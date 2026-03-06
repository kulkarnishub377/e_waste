/**
 * E-Zero - Pricing Calculator JavaScript
 */

// Calculator state
const calcState = {};

function calcUpdateQty(itemSlug, delta) {
  if (!calcState[itemSlug]) calcState[itemSlug] = 0;
  calcState[itemSlug] = Math.max(0, calcState[itemSlug] + delta);

  const qtyEl = document.getElementById(`calc-qty-${itemSlug}`);
  if (qtyEl) qtyEl.textContent = calcState[itemSlug];

  updateCalcTotal();
}
window.calcUpdateQty = calcUpdateQty;

function updateCalcTotal() {
  let totalEarnings = 0;
  let totalItems = 0;

  document.querySelectorAll('.calc-item').forEach(item => {
    const slug = item.dataset.item;
    const price = parseFloat(item.dataset.price) || 0;
    const qty = calcState[slug] || 0;
    totalEarnings += price * qty;
    totalItems += qty;
  });

  const totalAmountEl = document.getElementById('total-points');
  const totalItemsEl = document.getElementById('total-items');

  if (totalAmountEl) totalAmountEl.textContent = `₹${totalEarnings.toLocaleString('en-IN')}`;
  if (totalItemsEl) totalItemsEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} selected`;
}
window.updateCalcTotal = updateCalcTotal;
