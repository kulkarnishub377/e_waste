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

async function sendQuickReply(message) {
  addChatMessage(message, 'user');
  await fetchBotResponse(message);
}
window.sendQuickReply = sendQuickReply;

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;

  const message = input.value.trim();
  input.value = '';
  addChatMessage(message, 'user');
  
  await fetchBotResponse(message);
}
window.sendChatMessage = sendChatMessage;

async function fetchBotResponse(message) {
    // Show loading
    const messagesContainer = document.getElementById('chat-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message bot loading-bot';
    loadingDiv.innerHTML = '<div class="message-content"><p><i class="fas fa-spinner fa-spin"></i> Analyzing...</p></div>';
    if(messagesContainer) {
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    try {
        const response = await fetch('/api/chat/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        
        if (loadingDiv && loadingDiv.parentNode) {
            loadingDiv.remove();
        }
        addChatMessage(data.reply || data.error, 'bot');
    } catch(e) {
        console.error("Bot API Error:", e);
        if (loadingDiv && loadingDiv.parentNode) {
            loadingDiv.remove();
        }
    }
}

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
