<template>
  <div class="chatbot-container">
    <!-- Botón flotante para abrir el chat -->
    <button
      v-if="!isOpen"
      :aria-label="t('ai.openChat')"
      class="chat-toggle-button"
      @click="toggleChat"
    >
      <span class="chat-icon">🤖</span>
    </button>

    <!-- Ventana del chat -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <div class="chat-title">
          <span class="bot-avatar">🤖</span>
          <div>
            <h3>{{ t("ai.assistantName") }}</h3>
            <p class="chat-status">{{ t("ai.online") }}</p>
          </div>
        </div>
        <button class="close-button" @click="toggleChat">✕</button>
      </div>

      <div ref="messagesContainer" class="chat-messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.type"
        >
          <div class="message-content">
            <p>{{ message.text }}</p>
            <span class="message-time">{{
              formatTime(message.timestamp)
            }}</span>
          </div>
        </div>

        <div v-if="loading" class="message bot">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-container">
          <input
            v-model="currentMessage"
            :placeholder="t('ai.typePlaceholder')"
            :disabled="loading"
            class="message-input"
            @keyup.enter="sendMessage"
          />
          <button
            :disabled="!currentMessage.trim() || loading"
            class="send-button"
            @click="sendMessage"
          >
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from "vue";
import { useAI } from "~/composables/useAI";
import { useI18n } from "~/composables/useI18n";

const { t } = useI18n();
const { sendChatMessage, loading } = useAI();

const isOpen = ref(false);
const currentMessage = ref("");
const messagesContainer = ref(null);

const messages = reactive([
  {
    type: "bot",
    text: t("ai.welcomeMessage"),
    timestamp: new Date(),
  },
]);

function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom();
    });
  }
}

async function sendMessage() {
  if (!currentMessage.value.trim() || loading.value) return;

  const userMessage = currentMessage.value.trim();

  // Agregar mensaje del usuario
  messages.push({
    type: "user",
    text: userMessage,
    timestamp: new Date(),
  });

  currentMessage.value = "";

  await nextTick();
  scrollToBottom();

  try {
    const response = await sendChatMessage(userMessage);

    // Agregar respuesta del bot
    messages.push({
      type: "bot",
      text: response.response,
      timestamp: new Date(),
    });
  } catch (error) {
    messages.push({
      type: "bot",
      text: t("ai.errorMessage"),
      timestamp: new Date(),
    });
  }

  await nextTick();
  scrollToBottom();
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(() => {
  // Auto-abrir el chat después de 3 segundos (opcional)
  // setTimeout(() => {
  //   if (!isOpen.value) {
  //     isOpen.value = true
  //   }
  // }, 3000)
});
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.chat-toggle-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-hover)
  );
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toggle-button:hover {
  transform: scale(1.1);
}

.chat-icon {
  font-size: 1.5rem;
}

.chat-window {
  width: 350px;
  height: 500px;
  background-color: var(--color-surface);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.chat-header {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-hover)
  );
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bot-avatar {
  font-size: 1.5rem;
}

.chat-title h3 {
  margin: 0;
  font-size: 1rem;
}

.chat-status {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.9;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color var(--transition-fast);
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  position: relative;
}

.message.user .message-content {
  background-color: var(--color-primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-content {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border-bottom-left-radius: 4px;
}

.message-content p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.7;
  display: block;
  margin-top: 0.25rem;
}

.typing-indicator {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-text-secondary);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.input-container {
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  outline: none;
  font-size: 0.9rem;
}

.message-input:focus {
  border-color: var(--color-primary);
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast);
}

.send-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chatbot-container {
    bottom: 1rem;
    right: 1rem;
  }

  .chat-window {
    width: 300px;
    height: 400px;
  }
}
</style>
