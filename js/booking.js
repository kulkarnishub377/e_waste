/**
 * E-Zero - Professional Pickup Booking System
 * Multi-step form with validation, invoice generation, and print
 * @version 2.0.0
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    minPickupDate: 1, // Days from today
    maxPickupDate: 30,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    storageKey: 'ezero_bookings',
    companyInfo: {
      name: 'E-Zero Technologies Pvt. Ltd.',
      phone: '+91 98765 43210',
      email: 'info@ezero.in',
      address: '123 Green Business Park, Pune 411001',
      website: 'www.ezero.in'
    }
  };

  // Item definitions with earnings (matching calculator) and display names
  const ITEMS = {
    laptops: { name: 'Laptops', earn: 800, icon: 'fa-laptop' },
    desktops: { name: 'Desktop Computers', earn: 600, icon: 'fa-desktop' },
    phones: { name: 'Mobile Phones', earn: 300, icon: 'fa-mobile-alt' },
    tablets: { name: 'Tablets/iPads', earn: 400, icon: 'fa-tablet-alt' },
    monitors: { name: 'Monitors/TVs', earn: 350, icon: 'fa-tv' },
    printers: { name: 'Printers/Scanners', earn: 450, icon: 'fa-print' },
    keyboards: { name: 'Keyboards/Mouse', earn: 50, icon: 'fa-keyboard' },
    servers: { name: 'Servers', earn: 2000, icon: 'fa-server' },
    networking: { name: 'Routers/Switches', earn: 500, icon: 'fa-network-wired' },
    batteries: { name: 'Batteries/UPS', earn: 200, icon: 'fa-battery-full' },
    harddrives: { name: 'Hard Drives/SSDs', earn: 150, icon: 'fa-hdd' },
    cables: { name: 'Cables/Chargers', earn: 20, icon: 'fa-plug' }
  };

  // Time slots
  const TIME_SLOTS = [
    { value: '09:00-11:00', label: '09:00 AM - 11:00 AM' },
    { value: '11:00-13:00', label: '11:00 AM - 01:00 PM' },
    { value: '14:00-16:00', label: '02:00 PM - 04:00 PM' },
    { value: '16:00-18:00', label: '04:00 PM - 06:00 PM' }
  ];

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const state = {
    currentStep: 1,
    totalSteps: 4,
    isSubmitting: false,
    booking: {
      id: null,
      customer: {},
      items: {},
      schedule: {},
      services: [],
      images: [],
      createdAt: null,
      status: 'pending'
    }
  };

  // ============================================
  // DOM ELEMENTS CACHE
  // ============================================
  let elements = {};

  function cacheElements() {
    elements = {
      modal: document.getElementById('pickup-modal'),
      prevBtn: document.getElementById('prev-btn'),
      nextBtn: document.getElementById('next-btn'),
      submitBtn: document.getElementById('submit-btn'),
      doneBtn: document.getElementById('done-btn'),
      progressSteps: document.querySelectorAll('.progress-step'),
      formSteps: document.querySelectorAll('.form-step'),
      // Step 1 fields
      name: document.getElementById('pickup-name'),
      phone: document.getElementById('pickup-phone'),
      email: document.getElementById('pickup-email'),
      company: document.getElementById('pickup-company'),
      address: document.getElementById('pickup-address'),
      city: document.getElementById('pickup-city'),
      pincode: document.getElementById('pickup-pincode'),
      // Step 2
      totalItems: document.getElementById('total-items'),
      totalPoints: document.getElementById('total-points'),
      uploadInput: document.getElementById('image-upload'),
      uploadPreview: document.getElementById('upload-preview'),
      // Step 3
      pickupDate: document.getElementById('pickup-date'),
      pickupTime: document.getElementById('pickup-time'),
      instructions: document.getElementById('pickup-instructions'),
      serviceData: document.getElementById('service-data'),
      serviceCertificate: document.getElementById('service-certificate'),
      // Step 4 (Invoice)
      bookingId: document.getElementById('booking-id'),
      invoiceDate: document.getElementById('invoice-date'),
      customerDetails: document.getElementById('customer-details'),
      pickupDetails: document.getElementById('pickup-details'),
      invoiceItems: document.getElementById('invoice-items'),
      invoiceTotalPoints: document.getElementById('invoice-total-points')
    };
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    cacheElements();
    bindEvents();
    setDateConstraints();
    generateItemGrid();
    console.log('📦 E-Zero Booking System v2.0 Initialized');
  }

  function bindEvents() {
    // Close modal events
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.modal?.classList.contains('active')) {
        closeModal();
      }
    });

    // Image upload
    if (elements.uploadInput) {
      elements.uploadInput.addEventListener('change', handleImageUpload);
    }

    // Real-time validation
    ['name', 'phone', 'email', 'address', 'city', 'pincode'].forEach(field => {
      if (elements[field]) {
        elements[field].addEventListener('blur', () => validateField(field));
        elements[field].addEventListener('input', () => clearFieldError(field));
      }
    });
  }

  function setDateConstraints() {
    if (!elements.pickupDate) return;

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + CONFIG.minPickupDate);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + CONFIG.maxPickupDate);

    elements.pickupDate.min = formatDateForInput(minDate);
    elements.pickupDate.max = formatDateForInput(maxDate);
  }

  // ============================================
  // MODAL CONTROL
  // ============================================
  window.openPickupModal = function() {
    if (!elements.modal) cacheElements();
    
    resetState();
    elements.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first field
    setTimeout(() => elements.name?.focus(), 300);
  };

  window.closePickupModal = function() {
    closeModal();
  };

  window.printInvoice = function() {
    window.print();
  };

  window.downloadInvoice = function() {
    // Print dialog allows save as PDF
    window.print();
    showToast('Select "Save as PDF" in the print dialog', 'info');
  };

  function closeModal() {
    if (elements.modal) {
      elements.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ============================================
  // STEP NAVIGATION
  // ============================================
  window.nextStep = function() {
    if (state.isSubmitting) return;
    
    if (!validateCurrentStep()) return;
    saveCurrentStepData();
    
    if (state.currentStep < state.totalSteps) {
      state.currentStep++;
      updateUI();
      
      if (state.currentStep === 4) {
        generateInvoice();
      }
    }
  };

  window.prevStep = function() {
    if (state.currentStep > 1) {
      state.currentStep--;
      updateUI();
    }
  };

  function updateUI() {
    // Update form steps
    elements.formSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx + 1 === state.currentStep);
    });

    // Update progress indicators
    elements.progressSteps.forEach((step, idx) => {
      step.classList.remove('active', 'completed');
      if (idx + 1 === state.currentStep) {
        step.classList.add('active');
      } else if (idx + 1 < state.currentStep) {
        step.classList.add('completed');
      }
    });

    // Update buttons
    elements.prevBtn.style.display = state.currentStep > 1 && state.currentStep < 4 ? 'inline-flex' : 'none';
    elements.nextBtn.style.display = state.currentStep < 3 ? 'inline-flex' : 'none';
    elements.submitBtn.style.display = state.currentStep === 3 ? 'inline-flex' : 'none';
    elements.doneBtn.style.display = state.currentStep === 4 ? 'inline-flex' : 'none';

    // Scroll to top of modal body
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
  }

  // ============================================
  // VALIDATION
  // ============================================
  function validateCurrentStep() {
    switch (state.currentStep) {
      case 1: return validateStep1();
      case 2: return validateStep2();
      case 3: return validateStep3();
      default: return true;
    }
  }

  function validateStep1() {
    const fields = ['name', 'phone', 'email', 'address', 'city', 'pincode'];
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToast('Please fill in all required fields correctly', 'error');
    }

    return isValid;
  }

  function validateField(field) {
    const el = elements[field];
    if (!el) return true;

    const value = el.value.trim();
    let isValid = true;
    let message = '';

    switch (field) {
      case 'name':
        isValid = value.length >= 2;
        message = 'Name must be at least 2 characters';
        break;
      case 'phone':
        isValid = /^[\d\s\-+()]{10,15}$/.test(value.replace(/\s/g, ''));
        message = 'Please enter a valid phone number';
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        message = 'Please enter a valid email address';
        break;
      case 'address':
        isValid = value.length >= 10;
        message = 'Please enter a complete address';
        break;
      case 'city':
        isValid = value.length >= 2;
        message = 'Please enter a valid city';
        break;
      case 'pincode':
        isValid = /^\d{6}$/.test(value);
        message = 'Please enter a valid 6-digit pincode';
        break;
    }

    if (!isValid) {
      setFieldError(el, message);
    } else {
      clearFieldError(field);
    }

    return isValid;
  }

  function setFieldError(el, message) {
    el.classList.add('error');
    let errorEl = el.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      el.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    const el = elements[field];
    if (!el) return;
    el.classList.remove('error');
    const errorEl = el.parentElement.querySelector('.field-error');
    if (errorEl) errorEl.remove();
  }

  function validateStep2() {
    const total = getTotalItems();
    if (total === 0) {
      showToast('Please select at least one item for pickup', 'error');
      return false;
    }
    return true;
  }

  function validateStep3() {
    const date = elements.pickupDate?.value;
    const time = elements.pickupTime?.value;

    if (!date) {
      showToast('Please select a pickup date', 'error');
      elements.pickupDate?.focus();
      return false;
    }

    if (!time) {
      showToast('Please select a time slot', 'error');
      elements.pickupTime?.focus();
      return false;
    }

    // Validate date is not in past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      showToast('Please select a future date', 'error');
      return false;
    }

    return true;
  }

  // ============================================
  // DATA MANAGEMENT
  // ============================================
  function saveCurrentStepData() {
    switch (state.currentStep) {
      case 1:
        state.booking.customer = {
          name: elements.name?.value.trim() || '',
          phone: elements.phone?.value.trim() || '',
          email: elements.email?.value.trim() || '',
          company: elements.company?.value.trim() || '',
          address: elements.address?.value.trim() || '',
          city: elements.city?.value.trim() || '',
          pincode: elements.pincode?.value.trim() || ''
        };
        break;
      case 2:
        state.booking.items = getSelectedItems();
        break;
      case 3:
        state.booking.schedule = {
          date: elements.pickupDate?.value || '',
          time: elements.pickupTime?.value || '',
          instructions: elements.instructions?.value.trim() || ''
        };
        state.booking.services = [];
        if (elements.serviceData?.checked) state.booking.services.push('Data Destruction');
        if (elements.serviceCertificate?.checked) state.booking.services.push('Compliance Certificate');
        break;
    }
  }

  function resetState() {
    state.currentStep = 1;
    state.isSubmitting = false;
    state.booking = {
      id: null,
      customer: {},
      items: {},
      schedule: {},
      services: [],
      images: [],
      createdAt: null,
      status: 'pending'
    };

    // Reset form fields
    document.querySelectorAll('#pickup-modal input, #pickup-modal textarea, #pickup-modal select').forEach(el => {
      if (el.type === 'checkbox') {
        el.checked = false;
      } else {
        el.value = '';
      }
      el.classList.remove('error');
    });

    // Reset quantities
    Object.keys(ITEMS).forEach(item => {
      const el = document.getElementById(`qty-${item}`);
      if (el) el.textContent = '0';
      document.querySelector(`[data-item="${item}"]`)?.classList.remove('active');
    });

    // Reset summary
    if (elements.totalItems) elements.totalItems.textContent = '0 items';
    if (elements.totalPoints) elements.totalPoints.textContent = '0';

    // Reset upload preview
    if (elements.uploadPreview) elements.uploadPreview.innerHTML = '';

    // Clear field errors
    document.querySelectorAll('.field-error').forEach(el => el.remove());

    // Update UI
    setDateConstraints();
    updateUI();
  }

  // ============================================
  // ITEM QUANTITY MANAGEMENT
  // ============================================
  window.updateQty = function(item, delta) {
    const el = document.getElementById(`qty-${item}`);
    if (!el) return;

    let qty = parseInt(el.textContent) || 0;
    qty = Math.max(0, Math.min(99, qty + delta));
    el.textContent = qty;

    // Update card visual state
    const card = el.closest('.calc-item-card');
    if (card) {
      card.classList.toggle('active', qty > 0);
    }

    updateItemsSummary();
  };

  // Generate dynamic item grid
  function generateItemGrid() {
    const container = document.getElementById('items-grid');
    if (!container) return;

    container.innerHTML = Object.entries(ITEMS).map(([key, item]) => `
      <div class="calc-item-card" data-item="${key}" onclick="if(event.target.closest('button')) return; updateQty('${key}', 1)">
        <div class="calc-card-top">
          <div class="calc-card-icon"><i class="fas ${item.icon}"></i></div>
          <div class="calc-card-info">
            <div class="calc-card-title">${item.name}</div>
            <div class="calc-card-price">Earn ₹${item.earn}</div>
          </div>
        </div>
        
        <div class="calc-card-actions">
          <button class="calc-btn" type="button" onclick="event.stopPropagation(); updateQty('${key}', -1)">-</button>
          <span class="calc-qty" id="qty-${key}">0</span>
          <button class="calc-btn" type="button" onclick="event.stopPropagation(); updateQty('${key}', 1)">+</button>
        </div>
      </div>
    `).join('');
  }

  function getSelectedItems() {
    const items = {};
    Object.keys(ITEMS).forEach(item => {
      const qty = parseInt(document.getElementById(`qty-${item}`)?.textContent) || 0;
      if (qty > 0) items[item] = qty;
    });
    return items;
  }

  function getTotalItems() {
    return Object.values(getSelectedItems()).reduce((sum, qty) => sum + qty, 0);
  }

  function getTotalPoints() {
    const items = getSelectedItems();
    return Object.entries(items).reduce((sum, [item, qty]) => {
      // Changed from .points to .earn to match logic
      return sum + (ITEMS[item]?.earn || 0) * qty;
    }, 0);
  }

  function updateItemsSummary() {
    const total = getTotalItems();
    const points = getTotalPoints();

    if (elements.totalItems) {
      elements.totalItems.textContent = `${total} item${total !== 1 ? 's' : ''}`;
    }
    if (elements.totalPoints) {
      elements.totalPoints.textContent = '₹' + points.toLocaleString();
    }
  }

  // ============================================
  // IMAGE UPLOAD
  // ============================================
  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Validate file type
      if (!CONFIG.allowedFileTypes.includes(file.type)) {
        showToast(`${file.name}: Invalid file type. Use JPG, PNG, or WebP`, 'error');
        return;
      }

      // Validate file size
      if (file.size > CONFIG.maxFileSize) {
        showToast(`${file.name}: File too large (max 5MB)`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        state.booking.images.push({
          name: file.name,
          data: event.target.result,
          size: file.size
        });
        renderImagePreviews();
      };
      reader.readAsDataURL(file);
    });

    // Clear input
    e.target.value = '';
  }

  function renderImagePreviews() {
    if (!elements.uploadPreview) return;

    elements.uploadPreview.innerHTML = state.booking.images.map((img, idx) => `
      <div class="preview-item">
        <img src="${img.data}" alt="${img.name}" title="${img.name}">
        <button type="button" class="remove-image" onclick="removeImage(${idx})" title="Remove">&times;</button>
      </div>
    `).join('');
  }

  window.removeImage = function(idx) {
    state.booking.images.splice(idx, 1);
    renderImagePreviews();
  };

  // ============================================
  // INVOICE GENERATION
  // ============================================
  function generateInvoice() {
    // Generate booking ID
    state.booking.id = generateBookingId();
    state.booking.createdAt = new Date().toISOString();

    // Update invoice elements
    if (elements.bookingId) {
      elements.bookingId.textContent = state.booking.id;
    }

    if (elements.invoiceDate) {
      elements.invoiceDate.textContent = formatDate(new Date(), 'long');
    }

    // Customer details
    if (elements.customerDetails) {
      const c = state.booking.customer;
      elements.customerDetails.innerHTML = `
        <p><strong>${escapeHtml(c.name)}</strong></p>
        ${c.company ? `<p>${escapeHtml(c.company)}</p>` : ''}
        <p><i class="fas fa-envelope"></i> ${escapeHtml(c.email)}</p>
        <p><i class="fas fa-phone"></i> ${escapeHtml(c.phone)}</p>
      `;
    }

    // Pickup details
    if (elements.pickupDetails) {
      const c = state.booking.customer;
      const s = state.booking.schedule;
      const timeLabel = TIME_SLOTS.find(t => t.value === s.time)?.label || s.time;

      elements.pickupDetails.innerHTML = `
        <p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(c.address)}</p>
        <p><i class="fas fa-city"></i> ${escapeHtml(c.city)} - ${escapeHtml(c.pincode)}</p>
        <p><i class="fas fa-calendar"></i> ${formatDate(new Date(s.date), 'long')}</p>
        <p><i class="fas fa-clock"></i> ${timeLabel}</p>
        ${state.booking.services.length ? `<p><i class="fas fa-cog"></i> ${state.booking.services.join(', ')}</p>` : ''}
        ${s.instructions ? `<p><i class="fas fa-sticky-note"></i> ${escapeHtml(s.instructions)}</p>` : ''}
      `;
    }

    // Items table
    if (elements.invoiceItems) {
      elements.invoiceItems.innerHTML = Object.entries(state.booking.items).map(([item, qty]) => {
        const itemInfo = ITEMS[item];
        const earnings = itemInfo.earn * qty;
        return `
          <tr>
            <td><i class="fas ${itemInfo.icon}"></i> ${itemInfo.name}</td>
            <td>${qty}</td>
            <td>₹${earnings.toLocaleString()}</td>
          </tr>
        `;
      }).join('');
    }

    // Total points
    if (elements.invoiceTotalPoints) {
      elements.invoiceTotalPoints.textContent = '₹' + getTotalPoints().toLocaleString();
    }
  }

  function generateBookingId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EZ-${timestamp.slice(-4)}${random}`;
  }

  // ============================================
  // SUBMIT BOOKING
  // ============================================
  window.submitBooking = function() {
    if (state.isSubmitting) return;
    
    state.isSubmitting = true;
    
    // Update button state
    const btn = elements.submitBtn;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      try {
        // Save to localStorage
        saveBookingToStorage();

        // Move to confirmation step
        state.currentStep = 4;
        updateUI();
        generateInvoice();

        showToast('Booking confirmed successfully!', 'success');

      } catch (error) {
        console.error('Booking error:', error);
        showToast('Failed to save booking. Please try again.', 'error');
      } finally {
        state.isSubmitting = false;
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    }, 1500);
  };

  function saveBookingToStorage() {
    const bookings = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
    
    // Don't store image data in localStorage (too large)
    const bookingToSave = {
      ...state.booking,
      images: state.booking.images.map(img => ({ name: img.name, size: img.size }))
    };
    
    bookings.unshift(bookingToSave);
    
    // Keep only last 50 bookings
    if (bookings.length > 50) bookings.length = 50;
    
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(bookings));
  }

  // ============================================
  // PRINT & DOWNLOAD
  // ============================================
  window.printInvoice = function() {
    const invoiceContent = document.getElementById('invoice-preview');
    if (!invoiceContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>E-Zero Pickup Booking - ${state.booking.id}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .invoice-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #10B981; color: white; border-radius: 10px; margin-bottom: 30px; }
          .invoice-logo { display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: bold; }
          .invoice-logo i { font-size: 28px; }
          .invoice-meta { text-align: right; }
          .invoice-id { font-size: 18px; font-weight: bold; }
          .invoice-section { margin-bottom: 25px; padding: 20px; background: #f8fafc; border-radius: 8px; }
          .invoice-section h4 { color: #10B981; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          .invoice-section p { margin-bottom: 8px; }
          .invoice-section i { color: #10B981; width: 20px; margin-right: 8px; }
          .invoice-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .invoice-table th, .invoice-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          .invoice-table th { background: #f1f5f9; font-size: 12px; text-transform: uppercase; color: #64748b; }
          .invoice-table tfoot td { background: #ecfdf5; font-weight: bold; }
          .invoice-footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
          .invoice-footer p { font-weight: 600; color: #10B981; }
          .company-info { margin-top: 20px; font-size: 12px; color: #64748b; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${invoiceContent.innerHTML}
        <div class="company-info">
          <p><strong>${CONFIG.companyInfo.name}</strong></p>
          <p>${CONFIG.companyInfo.address} | ${CONFIG.companyInfo.phone} | ${CONFIG.companyInfo.email}</p>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  window.downloadInvoice = function() {
    // Create downloadable HTML file
    const invoiceContent = document.getElementById('invoice-preview');
    if (!invoiceContent) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>E-Zero Booking ${state.booking.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .invoice-header { display: flex; justify-content: space-between; padding: 20px; background: #10B981; color: white; border-radius: 10px; }
          .invoice-section { margin: 20px 0; padding: 15px; background: #f8f8f8; border-radius: 8px; }
          .invoice-section h4 { color: #10B981; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>${invoiceContent.innerHTML}</body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EZero-Booking-${state.booking.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Invoice downloaded successfully!', 'success');
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function formatDate(date, style = 'short') {
    if (style === 'long') {
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    return date.toLocaleDateString('en-IN');
  }

  function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.booking-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `booking-toast booking-toast-${type}`;

    const colors = {
      success: '#22C55E',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    };

    const icons = {
      success: 'check-circle',
      error: 'times-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${colors[type]};
      color: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 10001;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      font-size: 14px;
      max-width: 400px;
      animation: toastSlideIn 0.3s ease;
    `;

    toast.innerHTML = `<i class="fas fa-${icons[type]}"></i><span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);

    // Add animation styles if not present
    if (!document.getElementById('booking-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'booking-toast-styles';
      style.textContent = `
        @keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes toastSlideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        .field-error { display: block; color: #EF4444; font-size: 12px; margin-top: 4px; }
        .form-input.error { border-color: #EF4444 !important; }
      `;
      document.head.appendChild(style);
    }

    // Auto remove
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ============================================
  // INITIALIZE ON DOM READY
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();