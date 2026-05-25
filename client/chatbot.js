// chatbot.js - Study Corner AI Assistant
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Chatbot UI
    const chatContainer = document.createElement('div');
    chatContainer.id = 'admission-ai-bot';
    chatContainer.innerHTML = `
        <style>
            #ai-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'Outfit', sans-serif;
            }
            #ai-chat-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #2563eb, #4f46e5);
                box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            #ai-chat-button:hover { transform: scale(1.1); }
            #ai-chat-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 450px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                transform-origin: bottom right;
                animation: chatPop 0.3s ease-out forwards;
                border: 1px solid #e5e7eb;
            }
            @keyframes chatPop { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
            #ai-chat-header {
                background: linear-gradient(135deg, #1e3a8a, #3b82f6);
                color: white;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: bold;
            }
            #ai-chat-close { cursor: pointer; opacity: 0.8; }
            #ai-chat-close:hover { opacity: 1; }
            #ai-chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .chat-msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; line-height: 1.4; animation: fadeIn 0.3s ease-in; }
            .bot-msg { background: white; border: 1px solid #e5e7eb; color: #1f2937; align-self: flex-start; border-bottom-left-radius: 2px; }
            .user-msg { background: #3b82f6; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
            #ai-chat-input-container {
                display: flex;
                padding: 15px;
                background: white;
                border-top: 1px solid #e5e7eb;
            }
            #ai-chat-input {
                flex: 1;
                padding: 10px 15px;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                outline: none;
                font-family: inherit;
            }
            #ai-chat-send {
                background: #3b82f6;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-left: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            @media (max-width: 400px) {
                #ai-chat-panel { width: 300px; right: -10px; }
            }
        </style>
        <div id="ai-chat-widget">
            <div id="ai-chat-panel">
                <div id="ai-chat-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c-.11.46-.58.83-1 1.25V7h2a4 4 0 0 1 4 4v6a1 1 0 0 1-1 1h-8c-2 0-4-2-4-4v-4h-2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2V9.5c0-.66.36-1.16 1-1.5A2 2 0 0 1 12 2Z"></path><path d="M8 12h8"></path><path d="M9 16h6"></path></svg>
                        <span>Study Corner Expert</span>
                    </div>
                    <div id="ai-chat-close">✖</div>
                </div>
                <div id="ai-chat-messages">
                    <div class="chat-msg bot-msg">👋 Hello! Welcome to Study Corner Educational Services. I'm your AI admission assistant. What course are you looking for?</div>
                </div>
                <div id="ai-chat-input-container">
                    <input type="text" id="ai-chat-input" placeholder="Type your doubt here..." autocomplete="off">
                    <button id="ai-chat-send">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
            <div id="ai-chat-button">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // 2. Logic
    const panel = document.getElementById('ai-chat-panel');
    const btn = document.getElementById('ai-chat-button');
    const closeBtn = document.getElementById('ai-chat-close');
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');
    const messagesDiv = document.getElementById('ai-chat-messages');

    let isOpen = false;

    btn.addEventListener('click', () => {
        isOpen = !isOpen;
        panel.style.display = isOpen ? 'flex' : 'none';
        if(isOpen) input.focus();
    });

    closeBtn.addEventListener('click', () => {
        isOpen = false;
        panel.style.display = 'none';
    });

    function addMessage(text, isUser = false) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${isUser ? 'user-msg' : 'bot-msg'}`;
        msg.textContent = text;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function generateResponse(query) {
        const q = query.toLowerCase();
        
        // Exact matching logic for specific colleges
        if (q.includes('srm')) return "SRM Institute of Science and Technology offers excellent engineering, medical, and arts programs. Do you want to apply for SRM?";
        if (q.includes('hindustan')) return "Hindustan Group of Institutions provides premium courses with great placement records. Should I guide you through their admission?";
        if (q.includes('dhanalakshmi') || q.includes('dsu') || q.includes('srinivasan')) return "Dhanalakshmi Srinivasan University (DSU) is a top choice for Medicine, Agriculture, Engineering, and Pharmacy with a massive world-class infrastructure.";
        if (q.includes('rathinam')) return "Rathinam Group of Institutions in Coimbatore offers amazing Arts, Science, and IT programs.";
        if (q.includes('karpagam')) return "Karpagam Academy of Higher Education in Coimbatore is highly reputed for engineering, architecture, and arts programs.";
        if (q.includes('paavai')) return "Paavai Engineering College in Namakkal has excellent placement records and high-tech labs.";
        if (q.includes('kit') || q.includes('kalaignarkarunanidhi')) return "KIT (Kalaignarkarunanidhi Institute of Technology) is renowned for cutting-edge engineering and tech programs.";

        // Exact match for courses
        if (q.includes('agri') || q.includes('bsc agri') || q.includes('agriculture')) {
            return "We provide guaranteed admissions for B.Sc Agriculture in top colleges with large farm lands for practical training. Would you like to know the fee structure?";
        }
        if (q.includes('pharmacy') || q.includes('b.pharm') || q.includes('d.pharm') || q.includes('pharma')) {
            return "Looking for Pharmacy? We have partnerships with premier pharmacy colleges offering both D.Pharm and B.Pharm with lab facilities.";
        }
        if (q.includes('nursing') || q.includes('b.sc nursing') || q.includes('gnm')) {
            return "Nursing is high in demand! We can help you secure a seat in top Nursing colleges with 100% hospital affiliations and clinical practice.";
        }
        if (q.includes('allied') || q.includes('health science')) {
            return "Allied Health Sciences (like B.Sc Radiology, Cardio, Anesthesia) offer great career scopes in hospitals. Looking for top colleges?";
        }
        if (q.includes('law') || q.includes('llb') || q.includes('b.a llb')) {
            return "Pursue a prestige career in Law! We guide students for 3-year LLB and 5-year Integrated Law programs in top law schools.";
        }
        if (q.includes('polytechnic') || q.includes('diploma')) {
            return "We assist with Diploma/Polytechnic courses directly after 10th standard for early career starts.";
        }
        if (q.includes('arts') || q.includes('science') || q.includes('b.sc') || q.includes('b.com') || q.includes('bba') || q.includes('bca')) {
            return "We partner with top Arts and Science colleges offering B.Com, B.Sc, BCA, and BBA with high placement percentages. Ready to apply?";
        }

        // Smart Lead Capture Patterns
        if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('structure')) {
            return "Fees vary depending on the chosen college and course. For an exact, transparent fee breakdown and scholarship details, call Mr. Arun at +91 8072927565.";
        }
        if (q.includes('medicine') || q.includes('mbbs') || q.includes('doctor') || q.includes('bds')) {
            return "We specialize in Medical Guaranteed Admissions (MBBS/BDS) through transparent counseling guidance! Secure your medical seat today.";
        }
        if (q.includes('engineering') || q.includes('b.tech') || q.includes('btech') || q.includes('b.e')) {
            return "Looking for Top Engineering colleges? We've partnered with prestigious universities like SRM, Hindustan, DSU, and Paavai. Can I help you with applications?";
        }
        if (q.includes('contact') || q.includes('number') || q.includes('call') || q.includes('phone') || q.includes('whatsapp')) {
            return "You can reach our Founder, Arun Rajendran directly via Call or WhatsApp at +91 8072927565 or +91 7826902010.";
        }
        if (q.includes('apply') || q.includes('admission') || q.includes('join') || q.includes('register')) {
            return "Excellent! You can fill out our paperless admission form right now by clicking 'Apply Now' below or checking the menu.";
        }
        if (q.includes('hello') || q.includes('hi ') || q === 'hi' || q.includes('hey')) {
            return "Hello there! How can Study Corner Educational Services assist you today? Looking for a specific course or college?";
        }
        if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('office')) {
            return "Study Corner Educational Services is headquartered in Peravurani. We seamlessly assist students across Tamil Nadu and South India online!";
        }

        // Advanced intent matching using word checks
        const words = q.split(/\s+/);
        if (words.some(w => ['best', 'top', 'good', 'famous'].includes(w)) && words.some(w => ['college', 'university', 'colleges'].includes(w))) {
            return "We exclusively partner with top-ranked and best-in-class universities in Tamil Nadu to ensure your career is secure. What course are you aiming for?";
        }

        // Default Fallback
        return "I can provide immediate details on courses (Engineering, Medical, Agri, Nursing, etc.), colleges, or fees! For complete guidance, call +91 8072927565 or fill our application.";
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        
        addMessage(text, true);
        input.value = '';

        // Immediate reply (100ms delay for natural JS execution feel, but effectively instant)
        setTimeout(() => {
            const response = generateResponse(text);
            addMessage(response, false);
            
            // Add action button dynamically for strong intents
            if (response.includes("apply") || response.includes("application") || response.includes("Apply Now") || response.includes("admission form")) {
                const actionBtn = document.createElement('a');
                actionBtn.href = "admission-form.html";
                actionBtn.className = "chat-msg bot-msg";
                actionBtn.style.cssText = "background: #10b981; color: white; text-align: center; font-weight: bold; text-decoration: none; display: block; margin-top: 5px; border: none; cursor: pointer;";
                actionBtn.textContent = "Go to Admission Form ➔";
                messagesDiv.appendChild(actionBtn);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }
        }, 100);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
