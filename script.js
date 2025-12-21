document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. DARK MODE & UI LOGIC ---
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    icon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // --- 2. SCROLL ANIMATIONS ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.classList.contains('skill-category')) {
          entry.target.querySelectorAll('.fill').forEach(bar => {
            bar.style.width = bar.parentElement.previousElementSibling.lastElementChild.textContent;
          });
        }
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- 3. METRICS COUNTER ---
  const counters = document.querySelectorAll('.count');
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 2000; 
        const increment = target / (duration / 16); 
        let current = 0;
        const updateCount = () => {
          current += increment;
          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
        observer.unobserve(counter);
      }
    });
  });
  counters.forEach(counter => countObserver.observe(counter));

  // --- 4. MOBILE NAV ---
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.site-nav ul');
  if(navToggle) {
    navToggle.addEventListener('click', () => {
      navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
      navList.style.flexDirection = 'column';
      navList.style.position = 'absolute';
      navList.style.top = '70px';
      navList.style.right = '20px';
      navList.style.background = 'var(--bg)';
      navList.style.padding = '20px';
      navList.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      navList.style.borderRadius = '12px';
    });
  }

  // ==========================================
  // 5. GEMINI AI CHAT LOGIC (Client-Side)
  // ==========================================
  
  // Knowledge Base: Sourced from your resume
  const knowledgeBase = {
    intro: "I'm Punya, an Integration Developer at TCS. I specialize in connecting enterprise systems using Azure Logic Apps, Functions, and EDI standards.",
    experience: "I have over 3 years of experience at TCS (Sep 2022 - Present). I lead the EDI integration team, managing 450+ active workflows and reducing failures by 30%.",
    skills: "My core stack includes Azure Integration Services (Logic Apps, Service Bus, API Management), Azure Functions (Serverless), and C#. I'm also an expert in EDI standards (X12, EDIFACT) and B2B protocols (AS2, SFTP).",
    projects: "I've built real-time syncs between Salesforce and SAP, event-driven pipelines from Snowflake to Salesforce using Event Grid, and a reusable EDI framework that cut onboarding time by 40%.",
    contact: "You can reach me at punyasps1020@gmail.com or find me on LinkedIn.",
    certification: "I am Microsoft Certified: Azure Developer Associate (AZ-204) and Azure Fundamentals (AZ-900).",
    default: "I can tell you about Punya's **Experience**, **Skills**, **Projects**, or **Certifications**. What would you like to know?"
  };

  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const sendBtn = document.getElementById('chat-send-btn');
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const closeBtn = document.getElementById('chat-close-btn');

  // Toggle Chat
  window.toggleChat = () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) chatInput.focus();
  };
  toggleBtn.addEventListener('click', window.toggleChat);
  closeBtn.addEventListener('click', window.toggleChat);

  // Send Message Logic
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    addMessage(text, 'user');
    chatInput.value = '';

    // 2. Show Typing Indicator
    const typingId = showTyping();

    // 3. Simulate AI Delay & Response
    setTimeout(() => {
      removeTyping(typingId);
      const response = generateAIResponse(text);
      addMessage(response, 'bot');
    }, 1000); // 1s delay for realism
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  // UI Helper: Add Message
  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', `${sender}-message`);
    // Allow basic HTML for bolding
    div.innerHTML = text; 
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // UI Helper: Typing Indicator
  function showTyping() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.classList.add('typing-indicator');
    div.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // AI Logic: Simple Intent Matching
  function generateAIResponse(input) {
    const lower = input.toLowerCase();
    
    if (lower.includes('hello') || lower.includes('hi')) return "Hi there! How can I help you understand Punya's profile?";
    if (lower.includes('who are you') || lower.includes('about')) return knowledgeBase.intro;
    if (lower.includes('experience') || lower.includes('work') || lower.includes('job') || lower.includes('tcs')) return knowledgeBase.experience;
    if (lower.includes('skill') || lower.includes('tech') || lower.includes('azure') || lower.includes('stack')) return knowledgeBase.skills;
    if (lower.includes('project') || lower.includes('built') || lower.includes('portfolio')) return knowledgeBase.projects;
    if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) return knowledgeBase.contact;
    if (lower.includes('cert') || lower.includes('exam')) return knowledgeBase.certification;
    
    return knowledgeBase.default;
  }
});
