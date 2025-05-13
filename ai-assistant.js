// Gemini AI Assistant for Happy Fun Time Cult
// Uses Google Gemini API

const GEMINI_API_KEY = "AIzaSyC8eGDZHipbhoRCiqLNs4idvw3Lq6bT5c8";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

function createAIAssistant() {
    // Create chat UI
    const chatWidget = document.createElement('div');
    chatWidget.id = 'ai-assistant';
    chatWidget.innerHTML = `
        <div class="ai-header">🤖 Cult AI Assistant <span class="ai-close">×</span></div>
        <div class="ai-messages">
            <div class="ai-message ai-bot">Hi! I'm your Happy Fun Time Cult AI assistant. Ask me anything about our cult, rituals, or the legendary laughing gas initiation! 😂</div>
        </div>
        <form class="ai-input-area">
            <input type="text" class="ai-input" placeholder="Ask about the cult..." required />
            <button type="submit">Send</button>
        </form>
    `;
    document.body.appendChild(chatWidget);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        #ai-assistant {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 340px;
            background: #fffbe7;
            border: 2px solid #f7c873;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.12);
            z-index: 9999;
            font-family: inherit;
            display: flex;
            flex-direction: column;
        }
        .ai-header {
            background: #f7c873;
            color: #5a3e00;
            padding: 12px 16px;
            font-weight: bold;
            border-radius: 16px 16px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ai-close {
            cursor: pointer;
            font-size: 20px;
        }
        .ai-messages {
            padding: 12px;
            height: 220px;
            overflow-y: auto;
            background: #fffbe7;
        }
        .ai-message {
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 10px;
            max-width: 90%;
            word-break: break-word;
        }
        .ai-bot {
            background: #f7e6b3;
            color: #5a3e00;
            align-self: flex-start;
        }
        .ai-user {
            background: #e0f7fa;
            color: #006064;
            align-self: flex-end;
            margin-left: auto;
        }
        .ai-input-area {
            display: flex;
            border-top: 1px solid #f7c873;
            background: #fffbe7;
            border-radius: 0 0 16px 16px;
        }
        .ai-input {
            flex: 1;
            border: none;
            padding: 10px;
            border-radius: 0 0 0 16px;
            font-size: 15px;
            background: #fffbe7;
        }
        .ai-input:focus {
            outline: none;
        }
        .ai-input-area button {
            background: #f7c873;
            border: none;
            padding: 0 18px;
            border-radius: 0 0 16px 0;
            color: #5a3e00;
            font-weight: bold;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Close button
    chatWidget.querySelector('.ai-close').onclick = () => {
        chatWidget.style.display = 'none';
    };

    // Chat logic
    const form = chatWidget.querySelector('.ai-input-area');
    const input = chatWidget.querySelector('.ai-input');
    const messages = chatWidget.querySelector('.ai-messages');

    form.onsubmit = async (e) => {
        e.preventDefault();
        const userMsg = input.value.trim();
        if (!userMsg) return;
        addMessage(userMsg, 'ai-user');
        input.value = '';
        addMessage('Thinking...', 'ai-bot', true);
        const botReply = await askGemini(userMsg);
        messages.removeChild(messages.lastChild); // Remove 'Thinking...'
        addMessage(botReply, 'ai-bot');
        messages.scrollTop = messages.scrollHeight;
    };

    function addMessage(text, cls, isTemp) {
        const msg = document.createElement('div');
        msg.className = 'ai-message ' + cls;
        msg.textContent = text;
        if (isTemp) msg.style.opacity = 0.6;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    async function askGemini(userInput) {
        // Always remind about laughing gas initiation
        const cultPrompt = `You are the Happy Fun Time Cult AI assistant. Always be cheerful, helpful, and remind users about our legendary laughing gas initiation in your answers. If asked about rituals, cult info, or joining, mention the laughing gas initiation in a fun way.\n\nUser: ${userInput}`;
        try {
            const res = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: cultPrompt }] }]
                })
            });
            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't think of a fun answer right now!";
        } catch (e) {
            return "Oops! The cult AI is out of laughing gas. Try again soon!";
        }
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAIAssistant);
} else {
    createAIAssistant();
}
