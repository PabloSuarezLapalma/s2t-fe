<template>
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <span>Gemini 2.0 Flash Experimental</span>
        </div>
        <nav>
          <ul class="sidebar-nav">
            <li class="sidebar-item active">
              <i class="fas fa-plus"></i>
              <span>New chat</span>
            </li>
            <li class="sidebar-item">
              <i class="fas fa-clock-rotate-left"></i>
              <span>History</span>
            </li>
          </ul>
        </nav>
      </aside>
  
      <div class="chat-container">
        <main class="chat-messages">
          <div class="message-list">
            <TransitionGroup name="message">
              <div v-for="(message, index) in messages" 
                   :key="index" 
                   :class="['message', message.type]">
                <div class="message-content">
                  <div class="message-avatar" :class="message.type">
                    <template v-if="message.type === 'bot'">
                      <img src="/public/gemini.png" alt="Gemini Icon" class="gemini-chat-icon" style="border-radius: 50%;" />
                    </template>
                    <template v-else>
                      <i class="fas fa-user"></i>
                    </template>
                  </div>
                  <div class="message-bubble" v-html="parseMarkdown(message.text)">
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </main>
  
        <footer class="chat-input">
          <div class="input-container">
            <input 
              v-model="newMessage" 
              type="text" 
              placeholder="Enter a prompt here"
              @keyup.enter="sendMessage"
            >
            <button @click="sendMessage" class="send-button" :disabled="!newMessage.trim()">
              <i class="fas fa-arrow-up"></i>
            </button>
          </div>
          <div class="input-footer">
            <span class="input-hint">Gemini may display inaccurate info, including about people, places, or facts</span>
          </div>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { marked } from 'marked'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/github.css' // O el tema que prefieras

  // Configurar marked para resaltar bloques de código
  marked.setOptions({
    highlight: (code, lang) => {
      return lang
        ? hljs.highlight(code, { language: lang }).value
        : hljs.highlightAuto(code).value
    }
  })

  const messages = ref([
      { text: 'Hi, I\'m Gemini. How can I help you today?', type: 'bot' }
  ])
  const newMessage = ref('')

  const parseMarkdown = (text) => {
  // Primero convierte el texto en HTML con markdown
  let html = marked.parse(text);

  // Reemplazar saltos de línea dobles '\n\n' que indican un nuevo párrafo con <p></p>
  html = html.replace(/\n\n/g, '</p><p>');

  // Reemplazar saltos de línea simples '\n' dentro de un párrafo con <br />
  html = html.replace(/\n/g, '<br />');

  // Si el HTML comienza o termina con <p>, asegúrate de que se cierre correctamente
  if (!html.startsWith('<p>')) {
    html = `<p>${html}`;
  }
  if (!html.endsWith('</p>')) {
    html = `${html}</p>`;
  }

  return html;
};



  const sendMessage = async () => {
      if (newMessage.value.trim()) {
          const promptText = newMessage.value
          messages.value.push({ text: promptText, type: 'user' })
          newMessage.value = ''

          const botMessageIndex = messages.value.length
          messages.value.push({ text: '', type: 'bot' })

          const response = await fetch('http://localhost:7000/prompt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: promptText })
          })
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          let accumulatedText = ''
          let lastCharWasNewline = false

          while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    // Asegúrate de agregar el texto final
                    if (buffer) {
                    accumulatedText += buffer
                    messages.value[botMessageIndex].text = accumulatedText
                    }
                    break
                }

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    const cleanLine = line.replace(/^data:\s*/, '').trim()
                    if (!cleanLine) {
                    if (!lastCharWasNewline) {
                        accumulatedText += '\n\n'
                        messages.value[botMessageIndex].text = accumulatedText
                        lastCharWasNewline = true
                    }
                    continue
                    }

                    buffer += cleanLine

                    // Check for sentence endings and natural breaks
                    if (/[.!?]\s*$/.test(cleanLine)) {
                    if (buffer.trim()) {
                        accumulatedText += buffer + ' '
                        messages.value[botMessageIndex].text = accumulatedText
                        buffer = ''
                        lastCharWasNewline = false
                    }
                    }

                    // Handle explicit paragraph breaks
                    if (cleanLine.includes('\n')) {
                    accumulatedText += buffer + '\n\n'
                    messages.value[botMessageIndex].text = accumulatedText
                    buffer = ''
                    lastCharWasNewline = true
                    }
                }
                }
      }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
  
  .layout {
      display: flex;
      height: 100vh;
      width: 100vw;
      font-family: 'Google Sans', sans-serif;
      background: #1e1e1e; /* cambiado de #0a0a0a */
      color: #e0e0e0;
  }
  
  .sidebar {
      width: 220px; /* Reduced width from 280px */
      background: #333333; /* cambiado de #141414 */
      border-right: 1px solid #4a4a4a; /* cambiado de #2a2a2a */
      display: flex;
      flex-direction: column;
      padding: 1rem;
      color: #e0e0e0;
  }
  
  .sidebar-header {
      padding: 1rem;
      margin-bottom: 1rem;
  }
  
  .sidebar-header h2 {
      font-size: 1.25rem;
      font-weight: 500;
      color: #e0e0e0;
  }
  
  .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
  }
  
  .sidebar-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 100px;
      cursor: pointer;
      color: #5f6368;
      transition: background-color 0.2s;
  }
  
  .sidebar-item:hover {
      background: #f1f3f4;
  }
  
  .sidebar-item.active {
      background: #e8f0fe;
      color: #1a73e8;
  }
  
  .sidebar-item i {
      font-size: 1.125rem;
  }
  
  .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #1e1e1e; /* actualizado para un tono más claro */
      margin-left: 0px; /* Adjusted to match the sidebar width */
  }
  
  .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      background: #282828; /* cambiado de #0a0a0a */
  }
  
  .message-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
  }
  
  .message {
      display: flex;
      gap: 1rem;
  }
  
  .message-content {
      display: flex;
      gap: 1rem;
      width: 100%;
  }
  
  .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #f1f3f4;
      color: #5f6368;
  }
  
  .message-avatar.bot {
      background: #e8f0fe;
      color: #1a73e8;
  }
  
  .message-bubble {
      flex: 1;
      padding: 1rem 0;
      color: #e0e0e0;
      line-height: 1.5;
      font-size: 1rem;
      word-break: normal; /* Prevent breaking words in the middle */
      overflow-wrap: break-word; /* Ensure long words are wrapped */
      white-space: pre-line; /* Use pre-line to collapse excessive newlines while preserving line breaks */
  }
  
  .chat-input {
      border-top: 1px solid #dadce0;
      padding: 1rem 2rem 2rem;
  }
  
  .input-container {
      max-width: 768px;
      margin: 0 auto;
      background: #2b2b2b; /* cambiado de #1e1e1e */
      border: 1px solid #2a2a2a;
      border-radius: 100px;
      display: flex;
      align-items: center;
      padding: 0.5rem;
      transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .input-container:focus-within {
      border-color: #1a73e8;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  input {
      flex: 1;
      border: none;
      padding: 0.75rem 1.25rem;
      font-size: 1rem;
      color: #e0e0e0;
      background: transparent;
  }
  
  input:focus {
      outline: none;
  }
  
  input::placeholder {
      color: #5f6368;
  }
  
  .send-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a73e8;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
  }
  
  .send-button:hover {
      background: #1557b0;
  }
  
  .send-button:disabled {
      background: #dadce0;
      cursor: not-allowed;
  }
  
  .input-footer {
      max-width: 768px;
      margin: 0.75rem auto 0;
      text-align: center;
  }
  
  .input-hint {
      font-size: 0.8125rem;
      color: #5f6368;
  }
  
  /* Animations */
  .message-enter-active,
  .message-leave-active {
      transition: all 0.3s ease;
  }
  
  .message-enter-from {
      opacity: 0;
      transform: translateY(20px);
  }
  
  .message-leave-to {
      opacity: 0;
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
      width: 8px;
  }
  
  ::-webkit-scrollbar-track {
      background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
      background: #dadce0;
      border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
      background: #bdc1c6;
  }
  
  /* Nuevos estilos para bloques de código */
  .message-bubble pre {
      background: #f6f8fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1em;
      overflow: auto;
      color: #333;
  }
  .message-bubble code {
      background: #f6f8fa;
      border-radius: 4px;
      padding: 0.2em 0.4em;
      font-family: monospace;
  }
  </style>