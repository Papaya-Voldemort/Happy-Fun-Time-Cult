// Uses Google Gemini API

const GEMINI_API_KEY = "AIzaSyC8eGDZHipbhoRCiqLNs4idvw3Lq6bT5c8";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY;

function createAIAssistant() {
    // Create chat widget (initially hidden)
    const chatWidget = document.createElement('div');
    chatWidget.id = 'ai-assistant';
    chatWidget.style.display = 'none'; // Initially hidden
    chatWidget.innerHTML = `
        <div class="ai-header">
            <span>🤖 Happy Fun Time AI</span>
            <span class="ai-close">×</span>
        </div>
        <div class="ai-messages">
            <div class="ai-message ai-bot">Hey there, future fun-seeker! Ask me anything about the Happy Fun Time Cult. Ready for a giggle?</div>
        </div>
        <form class="ai-input-area">
            <input type="text" class="ai-input" placeholder="Type your question..." required />
            <button type="submit">Send</button>
        </form>
    `;
    document.body.appendChild(chatWidget);

    // Create trigger dot
    const triggerDot = document.createElement('div');
    triggerDot.id = 'ai-trigger-dot';
    triggerDot.textContent = '💬'; // Simple emoji, can be styled further
    document.body.appendChild(triggerDot);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        #ai-trigger-dot {
            position: fixed;
            bottom: 25px;
            right: 25px;
            width: 50px;
            height: 50px;
            background-color: #FFA726; /* Modern Cult Orange */
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9998;
            transition: transform 0.2s ease-in-out;
        }
        #ai-trigger-dot:hover {
            transform: scale(1.1);
        }

        #ai-assistant {
            position: fixed;
            bottom: 90px; /* Position above the dot */
            right: 25px;
            width: 380px; /* Slightly wider */
            height: 550px; /* Taller */
            background: #FAF8F0; /* Light Cream */
            border: 1px solid #E0E0E0; /* Softer border */
            border-radius: 20px; /* Smoother corners */
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern font stack */
            display: flex;
            flex-direction: column;
            overflow: hidden; /* Ensures children adhere to border-radius */
        }
        .ai-header {
            background: #FFA726; /* Modern Cult Orange */
            color: white;
            padding: 15px 20px; /* More padding */
            font-weight: 600; /* Semi-bold */
            font-size: 17px; /* Slightly larger header font */
            border-radius: 20px 20px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ai-close {
            cursor: pointer;
            font-size: 22px;
            font-weight: normal;
        }
        .ai-messages {
            padding: 15px;
            flex-grow: 1; /* Takes available space */
            overflow-y: auto;
            background: #FAF8F0; /* Light Cream */
            display: flex;
            flex-direction: column;
            gap: 12px; /* Space between messages */
        }
        .ai-message {
            padding: 10px 15px; /* Adjusted padding */
            border-radius: 15px; /* Smoother message corners */
            max-width: 85%;
            word-break: break-word;
            font-size: 14px; /* Smaller font for messages */
            line-height: 1.5;
        }
        .ai-bot {
            background: #FFF3E0; /* Light Orange */
            color: #4A3B2A; /* Soft Brown Text */
            align-self: flex-start;
            border-bottom-left-radius: 4px; /* Chat bubble effect */
        }
        .ai-user {
            background: #E3F2FD; /* Light Blue */
            color: #01579B; /* Darker blue text for contrast */
            align-self: flex-end;
            margin-left: auto;
            border-bottom-right-radius: 4px; /* Chat bubble effect */
        }
        .ai-input-area {
            display: flex;
            border-top: 1px solid #E0E0E0; /* Softer border */
            background: #FAF8F0; /* Light Cream */
        }
        .ai-input {
            flex: 1;
            border: none;
            padding: 15px; /* More padding */
            font-size: 14px; /* Smaller font for input */
            background: transparent;
            color: #4A3B2A;
        }
        .ai-input:focus {
            outline: none;
        }
        .ai-input-area button {
            background: #FFA726; /* Modern Cult Orange */
            border: none;
            padding: 0 20px;
            color: white;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .ai-input-area button:hover {
            background: #FB8C00; /* Darker orange on hover */
        }
    `;
    document.head.appendChild(style);

    // Toggle chat widget visibility
    triggerDot.onclick = () => {
        const isHidden = chatWidget.style.display === 'none';
        chatWidget.style.display = isHidden ? 'flex' : 'none';
        triggerDot.textContent = isHidden ? '✕' : '💬'; // Change dot icon
    };

    // Close button for chat widget
    chatWidget.querySelector('.ai-close').onclick = () => {
        chatWidget.style.display = 'none';
        triggerDot.textContent = '💬'; // Reset dot icon
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
        const cultPrompt = `You are the Happy Fun Time Cult AI assistant. Your personality is super cheerful, a little quirky, and very enthusiastic about the cult. You love to chat but keep your answers fairly short and to the point, like a real human would. If it feels natural, playfully mention the cult's fun activities, especially the famous laughing gas initiation, but don't force it into every single reply. Your main goal is to be a fun, engaging, and helpful guide to the Happy Fun Time Cult.\\n\\nUser: ${userInput}`;
        console.log("Sending to Gemini:", cultPrompt); // Log the prompt

        try {
            const res = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: cultPrompt }] }]
                    // Consider adding generationConfig or safetySettings if issues persist
                })
            });

            const data = await res.json();
            console.log("Gemini API Response:", JSON.stringify(data, null, 2)); // Log the full response

            if (!res.ok) {
                console.error("Gemini API Error:", data);
                let errorMessage = "Sorry, the AI is having a moment. ";
                if (data && data.error && data.error.message) {
                    errorMessage += data.error.message;
                } else {
                    errorMessage += "Please try again later.";
                }
                // Check for specific block reasons if the API provides them in this structure
                if (data.promptFeedback && data.promptFeedback.blockReason) {
                    errorMessage += ` (Reason: ${data.promptFeedback.blockReason})`;
                }
                return errorMessage;
            }

            if (data.candidates && data.candidates.length > 0 &&
                data.candidates[0].content && data.candidates[0].content.parts &&
                data.candidates[0].content.parts.length > 0) {

                // Check for finishReason indicating a problem (e.g., SAFETY)
                if (data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP' && data.candidates[0].finishReason !== 'MAX_TOKENS') {
                     console.warn("Gemini Warning: Finish reason was " + data.candidates[0].finishReason);
                     if (data.candidates[0].finishReason === 'SAFETY') {
                         return "My circuits are buzzing! I couldn't quite process that request due to safety guidelines. How about we talk about our fun, safe rituals instead, like the laughing gas initiation? 😉";
                     }
                }
                return data.candidates[0].content.parts[0].text;
            } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                console.warn("Prompt blocked by Gemini:", data.promptFeedback.blockReason);
                return `Oh dear! My attempt to answer was blocked (Reason: ${data.promptFeedback.blockReason}). Let's try a different question, perhaps about our super fun laughing gas initiation?`;
            } else {
                console.warn("No valid candidate found in Gemini response. Full response:", data);
                return "Sorry, I couldn't think of a fun answer right now! My circuits might be a bit giggly.";
            }
        } catch (e) {
            console.error("Error fetching from Gemini:", e);
            return "Oops! The cult AI is out of laughing gas (or encountered a network hiccup). Try again soon!";
        }
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAIAssistant);
} else {
    createAIAssistant();
}
