/**
 * E-Zero - Chat Widget JavaScript
 */

function toggleChat() {
  const chatWindow = document.getElementById('chat-window');
  const chatBadge = document.querySelector('.chat-badge');
  if (chatWindow) {
    chatWindow.classList.toggle('active');
    if (chatBadge) chatBadge.style.display = 'none';
  }
}
window.toggleChat = toggleChat;

function sendQuickReply(message) {
  addChatMessage(message, 'user');

  setTimeout(() => {
    let response = '';
    if (message.includes('schedule') || message.includes('pickup')) {
      response = "I'd be happy to help you schedule a pickup! You can use our <a href='/bookings/create/'>booking form</a> or call us at +91 98765 43210.";
    } else if (message.includes('quote') || message.includes('price')) {
      response = "You can use our <a href='/calculator/'>pricing calculator</a> to get an instant estimate, or fill out our <a href='/contact/'>contact form</a> for a detailed quote.";
    } else {
      response = "Thank you for reaching out! Our team is available Mon-Sat, 9 AM - 6 PM. You can also email us at info@ezero.in for any questions.";
    }
    addChatMessage(response, 'bot');
  }, 1000);
}
window.sendQuickReply = sendQuickReply;

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;

  const message = input.value.trim();
  input.value = '';
  addChatMessage(message, 'user');

  setTimeout(() => {
    addChatMessage("Thanks for your message! Our support team will get back to you shortly. For immediate assistance, call +91 98765 43210.", 'bot');
  }, 1500);
}
window.sendChatMessage = sendChatMessage;

function handleChatKeypress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}
window.handleChatKeypress = handleChatKeypress;

function addChatMessage(content, sender) {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer) return;

  // Remove quick replies
  const quickReplies = messagesContainer.querySelector('.chat-quick-replies');
  if (quickReplies) quickReplies.remove();

  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  messageDiv.innerHTML = `
    <div class="message-content">
      <p>${content}</p>
      <span class="message-time">Just now</span>
    </div>
  `;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
