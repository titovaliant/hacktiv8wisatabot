// Chatbot Frontend Script
// Manages conversation state and API communication

const API_ENDPOINT = '/api/chat';
const THINKING_MESSAGE = 'Tito lagi mikir...';
const ERROR_MESSAGE = 'Maaf, tidak ada respon yang diterima.';
const SERVER_ERROR_MESSAGE = 'Gagal mendapatkan respons dari server.';

// Conversation history to maintain context across messages
let conversationHistory = [];

// DOM Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

/**
 * Initializes the chatbot by attaching event listeners
 */
function initChatbot() {
  if (!chatForm || !userInput || !chatBox) {
    console.error('Required DOM elements not found');
    return;
  }

  chatForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Handles form submission
 * @param {Event} event - The form submit event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const userMessage = userInput.value.trim();

  if (!userMessage) {
    return;
  }

  userInput.value = '';

  addMessageToUI('user', userMessage);
  conversationHistory.push({
    role: 'user',
    text: userMessage,
  });

  const thinkingMessageId = addMessageToUI('model', THINKING_MESSAGE, true);

  try {
    const response = await fetchChatResponse();

    if (!response || !response.result) {
      const message = response?.error || ERROR_MESSAGE;
      updateMessageInUI(thinkingMessageId, message);
      return;
    }

    const aiMessage = response.result;
    conversationHistory.push({
      role: 'model',
      text: aiMessage,
    });
    updateMessageInUI(thinkingMessageId, aiMessage);
  } catch (error) {
    console.error('Chat request failed:', error);
    const errorText = getFriendlyErrorMessage(error);
    updateMessageInUI(thinkingMessageId, errorText);
  }
}

/**
 * Sends the current conversation to the backend API
 * @returns {Promise<Object>} The response from the server
 * @throws {Error} If the request fails
 */
async function fetchChatResponse() {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversation: conversationHistory,
    }),
  });

  const rawText = await response.text();
  let payload;

  try {
    payload = JSON.parse(rawText);
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorMessage = payload?.error || payload?.message || rawText || `HTTP Error ${response.status}`;
    throw new Error(errorMessage);
  }

  return payload;
}

/**
 * Converts errors into user-friendly message text.
 * @param {unknown} error - The thrown value
 * @returns {string}
 */
function getFriendlyErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message || SERVER_ERROR_MESSAGE;
  }

  if (error && typeof error === 'object') {
    try {
      return JSON.stringify(error);
    } catch {
      return SERVER_ERROR_MESSAGE;
    }
  }

  return SERVER_ERROR_MESSAGE;
}

/**
 * Adds a message to the chat UI
 * @param {string} role - 'user' or 'model'
 * @param {string} message - The message text
 * @param {boolean} [isTemporary=false] - Whether this is a temporary message
 * @returns {string} The unique ID of the message element
 */
function addMessageToUI(role, message, isTemporary = false) {
  const wrapper = document.createElement('div');
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const uiRole = role === 'model' ? 'tito' : 'you';
  const label = document.createElement('div');
  const bubble = document.createElement('div');

  wrapper.id = messageId;
  wrapper.className = `message-wrapper ${uiRole}`;

  label.className = 'message-name';
  label.textContent = uiRole === 'you' ? 'You' : 'Tito';

  bubble.className = `message-bubble ${uiRole}`;
  if (isTemporary) bubble.classList.add('temporary');
  bubble.textContent = message;

  wrapper.appendChild(label);
  wrapper.appendChild(bubble);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  return messageId;
}

/**
 * Updates an existing message in the chat UI
 * @param {string} messageId - The ID of the message element to update
 * @param {string} newMessage - The new message text
 */
function updateMessageInUI(messageId, newMessage) {
  const wrapper = document.getElementById(messageId);

  if (!wrapper) {
    console.error(`Message element with ID ${messageId} not found`);
    return;
  }

  const bubble = wrapper.querySelector('.message-bubble');
  if (!bubble) {
    console.error(`Bubble not found for message ${messageId}`);
    return;
  }

  bubble.textContent = newMessage;
  bubble.classList.remove('temporary');
  chatBox.scrollTop = chatBox.scrollHeight;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
