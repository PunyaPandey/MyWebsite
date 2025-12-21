document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. DARK MODE & UI LOGIC (Kept consistent) ---
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDark = body.classList.contains('dark-mode');
      icon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // --- 2. SCROLL ANIMATIONS ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Animate skill bars if visible
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
      const isOpen = navList.style.display === 'flex';
      navList.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        // Mobile menu styles applied dynamically
        Object.assign(navList.style, {
          flexDirection: 'column',
          position: 'absolute',
          top: '70px',
          right: '20px',
          background: 'var(--bg)',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          zIndex: '999'
        });
      }
    });
  }

  // =======================================================
  // 5. GEMINI FEATURE: INTEGRATED KNOWLEDGE GRAPH
  // =======================================================
  
  // The "Brain" - Your provided dataset
  const geminiData = {
    profile: {
      name: "Punya Parashar",
      role: "Integration Developer",
      specialization: "Azure Integration Services",
      skills: [
        "Azure Logic Apps", "Azure Functions", "Azure API Management", 
        "Azure Service Bus", "Azure Integration Account", 
        "EDI (X12, EDIFACT) processing", "XSLT transformations", 
        "API design and flow orchestration", "Event-driven architecture"
      ]
    },
    knowledge: {
      azure_integration: {
        core_services: {
          logic_apps: "Used for workflow automation, orchestrations, B2B flows, API workflows.",
          service_bus: "Messaging backbone for decoupling systems. Supports queues and topics.",
          api_management: "Gateway layer for managing APIs, policies, throttling, auth.",
          integration_account: "Container for B2B artifacts like partners, agreements, maps, and schemas.",
          functions: "Serverless compute for lightweight transformations and custom business logic."
        },
        integration_account_components: {
          partners: "Define trading partners with identifiers.",
          agreements: "Link two partners and specify protocol settings.",
          schemas: "X12/EDIFACT structures.",
          maps: "XSLT used for transforming payloads between schemas."
        },
        edi_flow_example: {
          intro: "Here is a typical end-to-end EDI flow I implement:",
          steps: [
            "Receive EDI file via SFTP/API/AS2.",
            "Decode file using Integration Account.",
            "Validate against schema.",
            "Transform via XSLT map.",
            "Publish into Service Bus or send to downstream API.",
            "Generate 997/CONTRL acknowledgements.",
            "Log tracking data for monitoring."
          ]
        }
      },
      professional_assets: {
        resume_prompt: "I can help you convert a resume into a structured prompt to enhance portfolio websites with dynamic sections.",
        presentation_generation: "I can generate PPT content on Azure Integration topics, including icons and MS Learn references.",
        real_world_use_case: "I can describe end-to-end EDI scenarios using Integration Account, Logic Apps, XSLT mapping, and Service Bus.",
        diagrams: "I can craft Midjourney or AI prompts to generate clean architecture diagrams for your documentation."
      },
      faq_examples: {
        ppt_hyperlink: "Select the text box, right-click, choose Insert → Link, paste the URL.",
        ssh_keys: "Save the private key as a secret in Azure Key Vault. Ensure line breaks are preserved using a base64-encoded string.",
        bp_range: "Normal BP for a 25-year-old is around 110–120 systolic and 65–75 diastolic."
      }
    }
  };

  // Chat UI Elements
  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const sendBtn = document.getElementById('chat-send-btn');
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const closeBtn = document.getElementById('chat-close-btn');

  // Toggle Chat Logic
  window.toggleChat = () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatInput.focus();
      // If empty, send greeting only once
      if (chatMessages.children.length === 0) {
        addMessage(`Hello! I'm <strong>${geminiData.profile.name}'s</strong> AI assistant. Ask me about <strong>Azure Logic Apps</strong>, <strong>EDI flows</strong>, or my <strong>technical skills</strong>.`, 'bot');
      }
    }
  };
  
  if (toggleBtn) toggleBtn.addEventListener('click', window.toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', window.toggleChat);

  // Send Message Logic
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';
    
    // Simulate thinking
    const typingId = showTyping();
    
    setTimeout(() => {
      removeTyping(typingId);
      const response = generateSmartResponse(text);
      addMessage(response, 'bot');
    }, 800);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  // UI Helpers
  function addMessage(html, sender) {
    const div = document.createElement('div');
    div.classList.add('message', `${sender}-message`);
    div.innerHTML = html; 
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

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

  // --- THE GEMINI BRAIN (Neural Matcher) ---
  function generateSmartResponse(input) {
    const lower = input.toLowerCase();
    const az = geminiData.knowledge.azure_integration;

    // 1. Profile & Skills
    if (lower.includes('who are you') || lower.includes('name')) return `I am the AI assistant for <strong>${geminiData.profile.name}</strong>, a ${geminiData.profile.role} specializing in ${geminiData.profile.specialization}.`;
    
    if (lower.includes('skill') || lower.includes('stack') || lower.includes('technologies')) {
      return `My technical toolkit includes:<br><ul>${geminiData.profile.skills.map(s => `<li>${s}</li>`).join('')}</ul>`;
    }

    // 2. Azure Core Services (Specific Definitions)
    if (lower.includes('logic app')) return `<strong>Azure Logic Apps:</strong> ${az.core_services.logic_apps}`;
    if (lower.includes('service bus')) return `<strong>Azure Service Bus:</strong> ${az.core_services.service_bus}`;
    if (lower.includes('api management') || lower.includes('apim')) return `<strong>Azure API Management:</strong> ${az.core_services.api_management}`;
    if (lower.includes('function')) return `<strong>Azure Functions:</strong> ${az.core_services.functions}`;
    
    // 3. Deep Dive: Integration Accounts & EDI
    if (lower.includes('integration account')) {
      const comps = az.integration_account_components;
      return `<strong>Integration Accounts</strong> are containers for B2B artifacts. They manage:<br>
      - <strong>Partners:</strong> ${comps.partners}<br>
      - <strong>Agreements:</strong> ${comps.agreements}<br>
      - <strong>Schemas:</strong> ${comps.schemas}<br>
      - <strong>Maps:</strong> ${comps.maps}`;
    }

    if ((lower.includes('edi') && lower.includes('flow')) || lower.includes('steps') || lower.includes('process')) {
      const flow = az.edi_flow_example;
      return `${flow.intro}<br><ol>${flow.steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
    }

    // 4. Professional Assets (Prompts & Use Cases)
    if (lower.includes('ppt') || lower.includes('presentation')) return geminiData.knowledge.professional_assets.presentation_generation;
    if (lower.includes('diagram') || lower.includes('architecture')) return geminiData.knowledge.professional_assets.diagrams;
    if (lower.includes('resume') && lower.includes('prompt')) return geminiData.knowledge.professional_assets.resume_prompt;

    // 5. Specific FAQ (Exact Matching)
    if (lower.includes('hyperlink') && lower.includes('ppt')) return geminiData.knowledge.faq_examples.ppt_hyperlink;
    if (lower.includes('ssh') || (lower.includes('key vault') && lower.includes('key'))) return geminiData.knowledge.faq_examples.ssh_keys;
    if (lower.includes('bp') || lower.includes('blood pressure')) return geminiData.knowledge.faq_examples.bp_range;

    // 6. Generic Fallback
    return `I can explain <strong>Azure Integration Services</strong>, describe an <strong>End-to-End EDI Flow</strong>, or list my <strong>Skills</strong>. What would you like to know?`;
  }
});
