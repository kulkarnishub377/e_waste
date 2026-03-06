// ==========================================================================
// E-ZERO V2 MASTERPIECE SCRIPT
// Coordinates animations, dynamic interactions, and the calculator logic
// ==========================================================================

// Global Page Load & Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('ezero-preloader');
    if (preloader) {
        // Add fake delay for "OS Boot" effect if desired, or remove instantly
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.classList.remove('loading');
            
            // Trigger 3D Tilt Initialization
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
                    max: 15,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.2,
                });
            }
        }, 800);
    }
});

// Scroll Progress Engine
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
});

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. Dynamic Notification System (Django Messages)
     */
    const messageContainer = document.getElementById('django-messages');
    if (messageContainer) {
        const notifications = messageContainer.querySelectorAll('.notification');
        notifications.forEach((notif, i) => {
            setTimeout(() => {
                notif.style.opacity = '0';
                notif.style.transform = 'translateX(50px)';
                setTimeout(() => notif.remove(), 400); // Wait for transition
            }, 5000 + (i * 1000));
        });
    }

    /**
     * 2. V2 Reveal Animations (Intersection Observer)
     */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /**
     * 3. Header Scroll Effect
     */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /**
     * 4. V2 Value Calculator Engine
     */
    const itemsGrid = document.getElementById('items-grid');
    if (itemsGrid) {
        // Expose function globally for the onclick handlers in HTML
        window.calcUpdateQty = function(slug, change) {
            const qtyElement = document.getElementById(`calc-qty-${slug}`);
            if (!qtyElement) return;

            let currentQty = parseInt(qtyElement.textContent);
            let newQty = currentQty + change;
            if (newQty < 0) newQty = 0;

            // Optional: visual limit
            if (newQty > 99) newQty = 99;

            qtyElement.textContent = newQty;
            
            // Add pulse effect to the specific row on update class
            const parentRow = qtyElement.closest('.calc-item');
            if(parentRow) {
                parentRow.style.transform = 'scale(0.98)';
                setTimeout(() => { parentRow.style.transform = 'none'; }, 150);
            }

            recalculateTotals();
        };

        function recalculateTotals() {
            let totalItems = 0;
            let totalValue = 0;
            const items = document.querySelectorAll('.calc-item');

            items.forEach(item => {
                const slug = item.getAttribute('data-item');
                const price = parseFloat(item.getAttribute('data-price')) || 0;
                const qtyElement = document.getElementById(`calc-qty-${slug}`);
                
                if (qtyElement) {
                    const qty = parseInt(qtyElement.textContent) || 0;
                    totalItems += qty;
                    totalValue += (price * qty);
                }
            });

            // Update DOM
            const totalItemsEl = document.getElementById('total-items');
            const totalPointsEl = document.getElementById('total-points');

            if (totalItemsEl) {
                totalItemsEl.textContent = totalItems.toLocaleString();
            }

            if (totalPointsEl) {
                // Formatting for India Rupee standard
                const formatter = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                });
                totalPointsEl.textContent = formatter.format(totalValue);
                
                // Add quick flash effect on total
                totalPointsEl.style.transform = 'scale(1.1)';
                totalPointsEl.style.textShadow = '0 0 20px rgba(16, 185, 129, 0.8)';
                setTimeout(() => {
                    totalPointsEl.style.transform = 'none';
                    totalPointsEl.style.textShadow = 'none';
                }, 300);
            }
        }
    }
});

// Chat Widget Logic Globally Available
window.toggleChat = function() {
    const chat = document.getElementById('chat-window');
    if (chat) {
        chat.classList.toggle('active');
    }
};

window.sendQuickReply = function(text) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = text;
        window.sendChatMessage();
    }
};

window.handleChatKeypress = function(event) {
    if (event.key === 'Enter') {
        window.sendChatMessage();
    }
};

window.sendChatMessage = function() {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    
    if (input && input.value.trim() !== '' && messages) {
        const text = input.value.trim();
        input.value = '';
        
        // Add User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `<div class="message-content"><p>${text}</p><span class="message-time">Just now</span></div>`;
        
        // Remove quick replies temporarily
        const quickReplies = messages.querySelector('.chat-quick-replies');
        if (quickReplies) quickReplies.style.display = 'none';
        
        messages.appendChild(userMsg);
        messages.scrollTop = messages.scrollHeight;
        
        // Mock Bot Response
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            botMsg.innerHTML = `<div class="message-content"><p>An E-Zero specialist has been notified regarding: "${text}". Please stand by while we analyze the request.</p><span class="message-time">Just now</span></div>`;
            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    }
};
