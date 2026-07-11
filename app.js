// REAL New York Chatbot Dashboard JavaScript Application Logic

// Initial Mock Listings Database
const INITIAL_LISTINGS = [
    {
        id: "midori",
        title: "The Midori",
        neighborhood: "Long Island City",
        price: 3850,
        beds: "1 BR",
        baths: "1",
        features: ["Gym", "Roof Deck", "Doorman", "Balcony", "Laundry in Building"],
        image: "midori",
        desc: "A stunning modern glass tower in the heart of LIC with breathtaking Manhattan skyline views, a state-of-the-art fitness center, and a sky lounge."
    },
    {
        id: "bedford",
        title: "Bedford Square",
        neighborhood: "Flatbush",
        price: 3200,
        beds: "2 BR",
        baths: "1.5",
        features: ["In-Unit W/D", "Roof Deck", "Pets Allowed", "Bike Storage"],
        image: "bedford",
        desc: "Sleek dark-brick new development featuring floor-to-ceiling windows, condo-grade kitchen finishes, and a massive shared rooftop terrace."
    },
    {
        id: "gemma",
        title: "Gemma Gramercy",
        neighborhood: "Gramercy Park",
        price: 4200,
        beds: "Studio",
        baths: "1",
        features: ["24/7 Doorman", "Gym", "In-Unit W/D", "Bike Room", "Package Room"],
        image: "gemma",
        desc: "Boutique white-glove luxury building in historic Gramercy. This high-end residence features oak wood floors, integrated kitchen cabinetry, and premium service."
    },
    {
        id: "hana",
        title: "The Hana LIC",
        neighborhood: "Long Island City",
        price: 5250,
        beds: "2 BR",
        baths: "2",
        features: ["Private Terrace", "Gym", "Doorman", "Skyline Lounge", "In-Unit W/D"],
        image: "hana",
        desc: "Exquisite corner apartment featuring 10-foot ceilings, top-tier European appliances, a massive wrap-around private terrace, and triple-pane noise reduction windows."
    },
    {
        id: "orchard",
        title: "140 Orchard Residences",
        neighborhood: "Lower East Side",
        price: 2950,
        beds: "Studio",
        baths: "1",
        features: ["Renovated", "Exposed Brick", "Dishwasher", "Virtual Doorman"],
        image: "orchard",
        desc: "Classic Lower East Side character meets modern industrial design. Features exposed brick accents, high-end stainless steel appliances, and premium stone bathrooms."
    },
    {
        id: "williamsburg-oasis",
        title: "Williamsburg Oasis Duplex",
        neighborhood: "Williamsburg",
        price: 7800,
        beds: "3 BR",
        baths: "2.5",
        features: ["Private Yard", "Doorman", "Gym", "Private Parking", "Balcony"],
        image: "williamsburg-oasis",
        desc: "Luxurious duplex penthouse just steps from the waterfront park. Includes a private landscaped backyard, professional chef's kitchen, and multi-zone climate control."
    }
];

// Image presets mapping to beautiful Unsplash placeholder URLs for high visual aesthetics
const IMAGE_PRESETS = {
    midori: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
    bedford: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
    gemma: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    hana: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80",
    orchard: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80",
    "williamsburg-oasis": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
};

// Bot Persona Configurations
const BOT_PERSONAS = {
    emma: {
        name: "Emma",
        avatar: "E",
        avatarClass: "emma-av",
        role: "Rentals Specialist",
        color: "#ff5e36",
        greeting: "Hi there! I'm Emma, your REAL New York residential rentals guide. 🗽 Are you looking to move into Manhattan, Brooklyn, or Queens? Tell me a bit about what neighborhood or budget you have in mind, and I can pull the best options from our catalog!",
        suggestions: [
            "Show 1 BRs in LIC under $4000",
            "Search Lower East Side rentals",
            "What's the 40x rent rule?",
            "What documents do I need to apply?"
        ]
    },
    alex: {
        name: "Alex",
        avatar: "A",
        avatarClass: "alex-av",
        role: "Commercial Leasing Advisor",
        color: "#00b0ff",
        greeting: "Good day. I am Alex from the REAL New York Commercial division. We specialize in storefront retail, office floorplans, and warehouses across NYC's premier business districts. What square footage or location does your business require?",
        suggestions: [
            "Search spaces in Soho",
            "Office spaces under 2,000 sq ft",
            "What are the typical lease terms?",
            "Book a commercial consult"
        ]
    },
    sophia: {
        name: "Sophia",
        avatar: "S",
        avatarClass: "sophia-av",
        role: "New Developments VIP Concierge",
        color: "#d500f9",
        greeting: "Welcome. I am Sophia, representing our luxury New Developments sales and high-end leasing portfolio. I offer white-glove virtual tours and bespoke property matches. Are you searching for purchase listings, penthouses, or a private VIP showing?",
        suggestions: [
            "Show luxury condos for sale",
            "Midori premium penthouses",
            "How do guarantor approvals work?",
            "Schedule a private VIP tour"
        ]
    }
};

// App State Management
let currentPersona = "emma";
let listings = [];
let leads = [];
let conversationHistory = [];
let customGreetings = {
    emma: "",
    alex: "",
    sophia: ""
};

// Gemini API Key state - Default to the key provided by the user
let geminiApiKey = localStorage.getItem("real_ny_gemini_key") || "";

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    loadDatabase();
    loadLeads();
    initSettings();
    initTheme();
    switchPersona(currentPersona);
    setupEventListeners();
});

// Load listings from localStorage or load default values
function loadDatabase() {
    const saved = localStorage.getItem("real_ny_listings");
    if (saved) {
        listings = JSON.parse(saved);
    } else {
        listings = [...INITIAL_LISTINGS];
        saveDatabase();
    }
    renderDbListings();
}

function saveDatabase() {
    localStorage.setItem("real_ny_listings", JSON.stringify(listings));
}

// Load leads from localStorage or load default values
function loadLeads() {
    const saved = localStorage.getItem("real_ny_leads");
    if (saved) {
        leads = JSON.parse(saved);
    } else {
        leads = [
            {
                timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString(),
                name: "Jordan K.",
                contact: "jordan.k@gmail.com | 555-0199",
                prefs: "Budget: $4k | LIC | 1 BR",
                status: "Tour Scheduled",
                badgeClass: "tour-booked"
            },
            {
                timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString(),
                name: "Marcus Chen",
                contact: "marcus.c@outlook.com",
                prefs: "Budget: $3k | Flatbush",
                status: "Info Only",
                badgeClass: "info-only"
            }
        ];
        saveLeads();
    }
    renderLeads();
}

function saveLeads() {
    localStorage.setItem("real_ny_leads", JSON.stringify(leads));
}

// Initialize Customizer presets
function initSettings() {
    // Custom greeting textareas
    const greetingArea = document.getElementById("customGreeting");
    greetingArea.value = customGreetings[currentPersona] || BOT_PERSONAS[currentPersona].greeting;

    // Load Gemini API Key input field value
    const apiKeyInput = document.getElementById("geminiApiKey");
    if (apiKeyInput) {
        apiKeyInput.value = geminiApiKey;
    }
    updateApiStatus();
}

// Update the visually displayed API status sub-label
function updateApiStatus() {
    const statusMsg = document.getElementById("apiStatusMessage");
    if (!statusMsg) return;

    if (geminiApiKey) {
        statusMsg.innerText = "Mode: Active - Gemini AI (online)";
        statusMsg.style.color = "#00c853";
        statusMsg.style.fontWeight = "600";
    } else {
        statusMsg.innerText = "Mode: Local Rules Engine (offline)";
        statusMsg.style.color = "var(--text-muted)";
        statusMsg.style.fontWeight = "normal";
    }
}

// Initialize Theme (Dark mode by default, check localStorage)
function initTheme() {
    const savedTheme = localStorage.getItem("real_ny_theme") || "dark-mode";
    document.body.className = savedTheme;
}

// Render administrative listings catalog
function renderDbListings() {
    const container = document.getElementById("dbListingsContainer");
    container.innerHTML = "";
    
    listings.forEach(item => {
        const card = document.createElement("div");
        card.className = "db-listing-card";
        
        const imgUrl = IMAGE_PRESETS[item.image] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80";
        
        card.innerHTML = `
            <div class="db-list-img" style="background-image: url('${imgUrl}')">
                <span class="db-list-price">$${item.price.toLocaleString()}/mo</span>
            </div>
            <div class="db-list-details">
                <span class="db-list-title">${item.title}</span>
                <span class="db-list-loc">${item.neighborhood}</span>
                <div class="db-list-specs">
                    <span>${item.beds}</span>
                    <span>•</span>
                    <span>${item.baths} Bath</span>
                </div>
            </div>
            <button class="db-list-delete" onclick="deleteListing('${item.id}')" title="Delete Listing">&times;</button>
        `;
        container.appendChild(card);
    });
}

// Delete listing from catalog
window.deleteListing = function(id) {
    if (confirm("Are you sure you want to delete this listing from the simulator's catalog?")) {
        listings = listings.filter(item => item.id !== id);
        saveDatabase();
        renderDbListings();
        addBotMessage(`System Alert: Catalog updated. Listing ID "${id}" has been removed.`);
    }
};

// Render leads table
function renderLeads() {
    const tableBody = document.getElementById("leadsTableBody");
    const badge = document.getElementById("leadsBadge");
    const totalLeadsNum = document.getElementById("totalLeadsNum");
    const tourRequestsNum = document.getElementById("tourRequestsNum");
    const popularNeighborhood = document.getElementById("popularNeighborhood");
    
    badge.innerText = leads.length;
    totalLeadsNum.innerText = leads.length;
    
    // Count tours
    const tourCount = leads.filter(l => l.status === "Tour Scheduled").length;
    tourRequestsNum.innerText = tourCount;
    
    // Analyze popular neighborhood
    if (leads.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table-row">No leads captured yet. Interact with the chat bot tour scheduler or lead forms to populate.</td>
            </tr>
        `;
        popularNeighborhood.innerText = "N/A";
        return;
    }
    
    const countMap = {};
    leads.forEach(l => {
        // Simple extraction of neighborhood from preference string
        const parts = l.prefs.split("|");
        if (parts.length > 1) {
            const nh = parts[1].trim();
            if (nh && nh !== "None" && nh !== "Any") {
                countMap[nh] = (countMap[nh] || 0) + 1;
            }
        }
    });
    
    let maxNh = "N/A";
    let maxVal = 0;
    for (const nh in countMap) {
        if (countMap[nh] > maxVal) {
            maxVal = countMap[nh];
            maxNh = nh;
        }
    }
    popularNeighborhood.innerText = maxNh;
    
    // Clear table and render
    tableBody.innerHTML = "";
    leads.forEach(lead => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><span class="lead-cell-sub">${lead.timestamp}</span></td>
            <td>
                <span class="lead-cell-name">${lead.name}</span>
                <span class="lead-cell-sub">${lead.contact}</span>
            </td>
            <td><span class="lead-cell-sub">${lead.prefs}</span></td>
            <td><span class="status-badge ${lead.badgeClass}">${lead.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Save a new lead from forms
function captureNewLead(name, email, phone, prefs, isTour = false) {
    const timestamp = new Date().toLocaleString();
    const newLead = {
        timestamp,
        name,
        contact: `${email}${phone ? ' | ' + phone : ''}`,
        prefs,
        status: isTour ? "Tour Scheduled" : "Info Only",
        badgeClass: isTour ? "tour-booked" : "info-only"
    };
    leads.unshift(newLead);
    saveLeads();
    renderLeads();
}

// Switch between bot personas
function switchPersona(personaId) {
    currentPersona = personaId;
    const persona = BOT_PERSONAS[personaId];
    
    // Update active visual tags in list
    document.querySelectorAll(".persona-card").forEach(card => {
        if (card.dataset.persona === personaId) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
    
    // Update live chat headers
    const nameLabel = document.getElementById("activeAgentName");
    const roleLabel = document.getElementById("activeAgentRole");
    const bubble = document.getElementById("activeAgentAvatar");
    
    nameLabel.innerText = persona.name;
    roleLabel.innerText = persona.role;
    bubble.innerText = persona.avatar;
    bubble.className = `agent-avatar-bubble ${persona.avatarClass}`;
    
    // Dynamically adjust theme accent color variable based on persona settings
    document.documentElement.style.setProperty('--primary-color', persona.color);
    
    // Translate hex color to rgb for shadow effects
    const rgb = hexToRgb(persona.color);
    document.documentElement.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    // Update welcome message customizer
    const customArea = document.getElementById("customGreeting");
    customArea.value = customGreetings[personaId] || persona.greeting;
    
    // Setup color swatch accent selections to show correct selector
    document.querySelectorAll(".color-swatch").forEach(swatch => {
        if (swatch.dataset.color === persona.color) {
            swatch.classList.add("selected");
        } else {
            swatch.classList.remove("selected");
        }
    });
    
    // Load Custom Preset Suggestions Chips
    renderSuggestions(persona.suggestions);
    
    // Reset and initialize bot greeting message
    resetBotConversation();
}

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 94, b: 54 };
}

// Render dynamic quick recommendation chips
function renderSuggestions(suggestions) {
    const container = document.getElementById("suggestionContainer");
    container.innerHTML = "";
    
    suggestions.forEach(text => {
        const chip = document.createElement("div");
        chip.className = "suggestion-chip";
        chip.innerText = text;
        chip.addEventListener("click", () => {
            handleUserMessage(text);
        });
        container.appendChild(chip);
    });
    
    // Sync customizable prompts editor layout
    const promptsList = document.getElementById("promptsList");
    promptsList.innerHTML = "";
    suggestions.forEach((text, index) => {
        const div = document.createElement("div");
        div.className = "prompt-item-edit";
        div.innerHTML = `
            <input type="text" value="${text}" data-index="${index}" class="prompt-input-field">
        `;
        promptsList.appendChild(div);
    });
    
    // Bind change listener on custom prompts
    document.querySelectorAll(".prompt-input-field").forEach(input => {
        input.addEventListener("change", (e) => {
            const idx = parseInt(e.target.dataset.index);
            BOT_PERSONAS[currentPersona].suggestions[idx] = e.target.value;
            renderSuggestions(BOT_PERSONAS[currentPersona].suggestions);
        });
    });
}

// Reset bot dialogue history
function resetBotConversation() {
    const chatBody = document.getElementById("chatBody");
    chatBody.innerHTML = "";
    
    // Clear conversation history for Gemini API context
    conversationHistory = [];
    
    const activeGreeting = customGreetings[currentPersona] || BOT_PERSONAS[currentPersona].greeting;
    
    // Add custom welcome greeting
    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        addBotMessage(activeGreeting);
        // Track initial bot greeting in history
        conversationHistory.push({ role: "model", text: activeGreeting });
    }, 800);
}

// Append bot message bubble
function addBotMessage(text) {
    const chatBody = document.getElementById("chatBody");
    const msgRow = document.createElement("div");
    msgRow.className = "msg-row agent-row";
    msgRow.innerHTML = `
        <div class="msg-bubble">${formatText(text)}</div>
    `;
    chatBody.appendChild(msgRow);
    scrollToBottom();
}

// Append user message bubble
function addUserMessage(text) {
    const chatBody = document.getElementById("chatBody");
    const msgRow = document.createElement("div");
    msgRow.className = "msg-row user-row";
    msgRow.innerHTML = `
        <div class="msg-bubble">${text}</div>
    `;
    chatBody.appendChild(msgRow);
    scrollToBottom();
}

// Format message line breaks & basic bolding
function formatText(text) {
    return text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function showTypingIndicator() {
    const chatBody = document.getElementById("chatBody");
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.id = "typingIndicator";
    indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatBody.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    const chatBody = document.getElementById("chatBody");
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Event Listeners Binding
function setupEventListeners() {
    // Theme toggle
    const themeBtn = document.getElementById("themeToggleBtn");
    themeBtn.addEventListener("click", () => {
        const body = document.body;
        if (body.classList.contains("dark-mode")) {
            body.classList.replace("dark-mode", "light-mode");
            localStorage.setItem("real_ny_theme", "light-mode");
        } else {
            body.classList.replace("light-mode", "dark-mode");
            localStorage.setItem("real_ny_theme", "dark-mode");
        }
    });
    
    // Tab switching
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const tabId = btn.dataset.tab;
            document.querySelectorAll(".tab-content").forEach(tc => {
                tc.classList.remove("active");
            });
            document.getElementById(`tab-${tabId}`).classList.add("active");
        });
    });
    
    // Switch Persona Cards
    document.querySelectorAll(".persona-card").forEach(card => {
        card.addEventListener("click", () => {
            switchPersona(card.dataset.persona);
        });
    });
    
    // Custom greeting text change
    const greetingArea = document.getElementById("customGreeting");
    greetingArea.addEventListener("input", (e) => {
        customGreetings[currentPersona] = e.target.value;
    });
    
    // Color customizer swatches
    document.querySelectorAll(".color-swatch").forEach(swatch => {
        swatch.addEventListener("click", () => {
            const color = swatch.dataset.color;
            document.documentElement.style.setProperty('--primary-color', color);
            const rgb = hexToRgb(color);
            document.documentElement.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
            
            document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
            swatch.classList.add("selected");
            BOT_PERSONAS[currentPersona].color = color;
        });
    });

    // Save Gemini API Key Configuration
    const saveKeyBtn = document.getElementById("saveApiKeyBtn");
    if (saveKeyBtn) {
        saveKeyBtn.addEventListener("click", () => {
            const val = document.getElementById("geminiApiKey").value.trim();
            geminiApiKey = val;
            localStorage.setItem("real_ny_gemini_key", val);
            updateApiStatus();
            alert("Gemini API key updated successfully! The bot dialogue context is reset to sync parameters.");
            resetBotConversation();
        });
    }
    
    // Reset chat button
    document.getElementById("resetBotBtn").addEventListener("click", () => {
        resetBotConversation();
    });
    
    // Clear leads button
    document.getElementById("clearLeadsBtn").addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all captured client leads?")) {
            leads = [];
            saveLeads();
            renderLeads();
        }
    });
    
    // Listing Modal toggles
    const addListingBtn = document.getElementById("addListingBtn");
    const modal = document.getElementById("addListingModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    
    addListingBtn.addEventListener("click", () => {
        modal.classList.add("active");
    });
    
    const hideModal = () => {
        modal.classList.remove("active");
        document.getElementById("addListingForm").reset();
    };
    
    closeModalBtn.addEventListener("click", hideModal);
    cancelModalBtn.addEventListener("click", hideModal);
    
    // Create new listing form submission
    document.getElementById("addListingForm").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = document.getElementById("listTitle").value;
        const neighborhood = document.getElementById("listNeighborhood").value;
        const price = parseInt(document.getElementById("listPrice").value);
        const beds = document.getElementById("listBeds").value;
        const baths = document.getElementById("listBaths").value;
        const featuresInput = document.getElementById("listFeatures").value;
        const imagePreset = document.getElementById("listImage").value;
        const desc = document.getElementById("listDesc").value || `Stunning brand new listing in ${neighborhood} with premium appliances.`;
        
        const features = featuresInput ? featuresInput.split(",").map(f => f.trim()) : ["Elevator", "Hardwood Floors"];
        const id = "custom-" + Date.now();
        
        const newListing = {
            id,
            title,
            neighborhood,
            price,
            beds,
            baths,
            features,
            image: imagePreset,
            desc
        };
        
        listings.unshift(newListing);
        saveDatabase();
        renderDbListings();
        hideModal();
        
        addBotMessage(`System Alert: Added **${title}** to the database catalog! The bot can now query it instantly.`);
    });
    
    // Text message sending
    const inputField = document.getElementById("chatInputField");
    const sendBtn = document.getElementById("sendMessageBtn");
    
    const sendInputMessage = () => {
        const text = inputField.value.trim();
        if (text) {
            handleUserMessage(text);
            inputField.value = "";
        }
    };
    
    sendBtn.addEventListener("click", sendInputMessage);
    inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendInputMessage();
        }
    });
}

// Conversational Message Handling Logic
async function handleUserMessage(text) {
    addUserMessage(text);
    showTypingIndicator();
    
    // Append user input to history
    conversationHistory.push({ role: "user", text: text });
    
    // If Gemini API is active, call live AI endpoint
    if (geminiApiKey) {
        try {
            const reply = await callGeminiAPI();
            hideTypingIndicator();
            processBotResponse(reply);
            return;
        } catch (error) {
            console.error("Gemini API Error:", error);
            // Catch error, warn user, and fall back to local rules engine
            addBotMessage("*(System Notice: Could not connect to Gemini API. Falling back to Local Rules engine)*");
        }
    }
    
    // Local keyword-based engine fallback
    setTimeout(() => {
        hideTypingIndicator();
        const reply = generateBotReply(text);
        processBotResponse(reply);
    }, 1000);
}

// Perform AJAX request to Google Generative Language endpoints
async function callGeminiAPI() {
    const persona = BOT_PERSONAS[currentPersona];
    const systemPrompt = `You are the virtual real estate assistant representing the brokerage firm "REAL New York".
Active Persona: ${persona.name}
Role / Specialty: ${persona.role}
Greeting Style: ${customGreetings[currentPersona] || persona.greeting}

Mock Listings Catalog (active in our database):
${JSON.stringify(listings, null, 2)}

Standard NYC Renting Guidelines:
1. Income Requirement: Renters must prove annual gross income of 40x the monthly rent (e.g. rent of $3,000 requires $120,000/year).
2. Guarantors: If income is below 40x, personal guarantors must earn 80x the rent. Corporate guarantor services like Insurent, The Guarantors, or Rhino are accepted.
3. Documents Needed: Photo ID, Employment verification letter, 3 recent paystubs, 2 recent bank statements, most recent W2 / tax return.
4. Broker Fees: Typically ranges from 1 month's rent to 12-15% of annual rent, unless advertised as "No-Fee".

Dialogue Rules:
1. Speak in a helpful, expert, friendly tone matching your persona.
2. If the user searches for or inquires about properties, suggest the best matching properties from the catalog.
3. CRITICAL: If you are recommending or mentioning specific listings from the catalog, you must append the tag [CAROUSEL: id1, id2, ...] at the very end of your response (replace id1, id2 with the exact listing IDs, e.g., [CAROUSEL: midori, gemma]). This triggers a visual card carousel in the UI. Only list matching active listings from the catalog.
4. If the user asks to schedule a tour, viewing, or book an appointment, or shows strong intent to see a listing, append the tag [SCHEDULER] at the very end of your response to render the calendar tour booking widget inline.
5. If the user wants to sign up, registers interest, or wants an agent to contact them, append the tag [LEAD_FORM] at the very end of your response to display a client profile registration card.
6. Keep your answers reasonably concise, professional, and well-structured with formatting. Avoid generic replies.`;

    // Map conversation history to Gemini structure (cap at last 10 messages to avoid token bloating)
    const recentHistory = conversationHistory.slice(-10);
    
    // Ensure the conversation structure alternates strictly starting with a 'user' message,
    // which is required by the Gemini multi-turn API specifications.
    const contents = [];
    let expectedRole = "user";
    for (const msg of recentHistory) {
        const role = msg.role === "user" ? "user" : "model";
        if (role === expectedRole) {
            contents.push({
                role: role,
                parts: [{ text: msg.text }]
            });
            expectedRole = expectedRole === "user" ? "model" : "user";
        }
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: contents,
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7
            }
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Invalid response format received from Gemini API");
    }
}

// Process AI or local matching engine results, rendering widgets if specific tags are parsed
function processBotResponse(reply) {
    if (typeof reply === "string") {
        let text = reply;
        let showScheduler = false;
        let showLeadForm = false;
        let carouselListings = [];
        
        // Parse [SCHEDULER]
        if (text.includes("[SCHEDULER]")) {
            showScheduler = true;
            text = text.replace("[SCHEDULER]", "").trim();
        }
        
        // Parse [LEAD_FORM]
        if (text.includes("[LEAD_FORM]")) {
            showLeadForm = true;
            text = text.replace("[LEAD_FORM]", "").trim();
        }
        
        // Parse [CAROUSEL: id1, id2, ...]
        const carouselMatch = text.match(/\[CAROUSEL:\s*([^\]]+)\]/i);
        if (carouselMatch) {
            const ids = carouselMatch[1].split(",").map(id => id.trim().toLowerCase());
            // Filter by ID matching or Title string similarity
            carouselListings = listings.filter(item => 
                ids.includes(item.id.toLowerCase()) || 
                ids.some(part => item.title.toLowerCase().includes(part))
            );
            text = text.replace(carouselMatch[0], "").trim();
        }
        
        // Push actual displayed message text to chat history
        conversationHistory.push({ role: "model", text: text });
        
        // Append text message bubble to chat body
        addBotMessage(text);
        
        // Inject widgets as separate sequential nodes
        if (carouselListings.length > 0) {
            renderListingsCarousel(carouselListings);
        }
        if (showScheduler) {
            renderChatWidget(generateTourSchedulerHtml());
        }
        if (showLeadForm) {
            renderChatWidget(generateLeadFormHtml());
        }
    } else if (reply.type === "listings") {
        conversationHistory.push({ role: "model", text: reply.text });
        addBotMessage(reply.text);
        renderListingsCarousel(reply.data);
    } else if (reply.type === "widget") {
        conversationHistory.push({ role: "model", text: reply.text });
        addBotMessage(reply.text);
        renderChatWidget(reply.widgetHtml);
    }
}

// Simple text processing rules engine (Fallback)
function generateBotReply(userText) {
    const rawText = userText.toLowerCase();
    
    // 1. TOUR / SCHEDULER REQUESTS
    if (rawText.includes("schedule") || rawText.includes("tour") || rawText.includes("book") || rawText.includes("viewing") || rawText.includes("showing")) {
        return {
            type: "widget",
            text: "I would be happy to help you schedule a property tour. Please fill out your details in this calendar scheduler widget below, and I'll queue it for confirmation:",
            widgetHtml: generateTourSchedulerHtml()
        };
    }
    
    // 2. NYC REQUIREMENT FAQS
    // 40x Income Rule
    if (rawText.includes("40x") || rawText.includes("forty times") || rawText.includes("income requirement") || rawText.includes("how much do i need to earn")) {
        return `In New York City, landlords typically require renters to show an annual gross income of at least **40 times the monthly rent**.\n\nFor example:\n• If the rent is **$3,000/mo**, you must earn at least **$120,000/year**.\n• If the rent is **$4,000/mo**, you must earn at least **$160,000/year**.\n\n*If you do not meet this rule, you can use a qualified guarantor (80x rule) or a guarantor service like Insurent or The Guarantors.*`;
    }
    
    // Guarantors
    if (rawText.includes("guarantor") || rawText.includes("co-signer") || rawText.includes("80x") || rawText.includes("eighty times")) {
        return `If you don't meet the 40x income rule or credit standards, NYC landlords usually accept **Guarantors**:\n\n1. **Personal Guarantor**: Must be a US resident (often NY/NJ/CT preferred) earning at least **80 times the monthly rent** with excellent credit (700+).\n2. **Third-Party Guarantor Services**: Companies like **Insurent**, **The Guarantors**, or **Rhino** act as your guarantor for a fee (typically 70-85% of one month's rent for US citizens).`;
    }
    
    // Document Requirements
    if (rawText.includes("document") || rawText.includes("docs") || rawText.includes("paperwork") || rawText.includes("apply") || rawText.includes("application")) {
        return `To secure an apartment in NYC, listings move incredibly fast! You should prepare your application package in advance. Here are the **required documents**:\n\n1. 🆔 **Government-Issued Photo ID**\n2. 📄 **Letter of Employment** (stating job title, salary, length of employment)\n3. 💰 **3 Recent Consecutive Paystubs**\n4. 🏦 **2 Recent Bank Statements** (checking/savings)\n5. 📅 **Most Recent Tax Returns (first 2 pages of Form 1040) & W2 forms**\n\n*Having these scanned as a single PDF ready to send will give you a huge advantage!*`;
    }
    
    // Broker Fee
    if (rawText.includes("fee") || rawText.includes("commission") || rawText.includes("broker fee")) {
        return `In NYC, broker fees are common. Here is how they break down:\n\n• **Standard Fee**: Usually between **1 month's rent** or **12% to 15% of the annual rent**.\n• **No-Fee Listings**: The landlord pays the broker fee, meaning you pay $0 commission. We have several no-fee properties in our active catalog!\n\nWould you like me to filter for **no-fee** listings?`;
    }

    // 3. PROPERTY SEARCH BY FILTERS
    // Parse budget
    let budget = null;
    const priceMatches = rawText.match(/\$?(\d{1,2},?\d{3})/g);
    if (priceMatches && priceMatches.length > 0) {
        budget = parseInt(priceMatches[0].replace(/[\$,]/g, ""));
    }
    
    // Parse beds
    let beds = null;
    if (rawText.includes("studio")) beds = "studio";
    else if (rawText.includes("1 bed") || rawText.includes("1 br") || rawText.includes("one bedroom") || rawText.includes("1 bedroom")) beds = "1 br";
    else if (rawText.includes("2 bed") || rawText.includes("2 br") || rawText.includes("two bedroom") || rawText.includes("2 bedroom")) beds = "2 br";
    else if (rawText.includes("3 bed") || rawText.includes("3 br") || rawText.includes("three bedroom") || rawText.includes("3 bedroom")) beds = "3 br";
    
    // Parse neighborhood
    let neighborhood = null;
    if (rawText.includes("lic") || rawText.includes("long island city")) neighborhood = "Long Island City";
    else if (rawText.includes("williamsburg")) neighborhood = "Williamsburg";
    else if (rawText.includes("lower east side") || rawText.includes("les")) neighborhood = "Lower East Side";
    else if (rawText.includes("gramercy")) neighborhood = "Gramercy Park";
    else if (rawText.includes("flatbush")) neighborhood = "Flatbush";
    else if (rawText.includes("astoria")) neighborhood = "Astoria";
    else if (rawText.includes("east village")) neighborhood = "East Village";
    else if (rawText.includes("soho")) neighborhood = "Soho";
    
    // Run search in database
    let matches = listings;
    
    if (neighborhood) {
        matches = matches.filter(item => item.neighborhood === neighborhood);
    }
    if (beds) {
        matches = matches.filter(item => item.beds.toLowerCase() === beds);
    }
    if (budget) {
        matches = matches.filter(item => item.price <= budget);
    }
    
    if (matches.length > 0) {
        const filtersUsed = [];
        if (beds) filtersUsed.push(`**${beds.toUpperCase()}**`);
        if (neighborhood) filtersUsed.push(`in **${neighborhood}**`);
        if (budget) filtersUsed.push(`under **$${budget}**`);
        
        const filterStr = filtersUsed.length > 0 ? filtersUsed.join(" ") : "current listings";
        
        return {
            type: "listings",
            text: `I found **${matches.length}** property matches matching ${filterStr} in our catalog. Swipe or scroll through the listing cards below to see details:`,
            data: matches
        };
    } else if (neighborhood || beds || budget) {
        // Search returned 0, show alternative options
        return `I couldn't find any exact matches for those criteria in our current mock database. However, we have other fantastic properties in nearby areas. Would you like me to show you everything in our catalog? Or, you can add a new mock listing in the **NYC Listing DB** admin tab to test my search functionality in real-time!`;
    }
    
    // 4. PERSONA TAILORED FALLBACKS
    if (currentPersona === "emma") {
        return `Thanks for your message! As a residential specialist, I can help you find studio to 3-bedroom rentals in neighborhoods like **Long Island City, Lower East Side, Gramercy, Williamsburg, and Flatbush**.\n\nYou can also click any of the suggestion chips below, ask about NYC leasing requirements (40x income, documents, guarantors), or type "schedule a tour" to book a viewing.`;
    } else if (currentPersona === "alex") {
        return `We have spaces suited for retail, office desks, or creative production studios. Typical commercial leases require corporate backing and 3-10 year terms.\n\nLet me know your target commercial district (e.g. Soho, Flatiron) or budget parameters, or click "Book a commercial consult" to schedule time with me.`;
    } else {
        return `Our new construction luxury portfolio represents the highest tier of architecture in NYC. Features include full-service doormen, private elevators, rooftop wellness clubs, and integrated smart technologies.\n\nPlease describe your preferred layout, or let me know if you would like to schedule a private concierge showing.`;
    }
}

// Generate inline HTML for calendar tour scheduler
function generateTourSchedulerHtml() {
    const listOptions = listings.map(l => `<option value="${l.title}">${l.title} (${l.neighborhood})</option>`).join("");
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1); // Default to tomorrow
    const minDateStr = defaultDate.toISOString().split("T")[0];
    
    const id = "sched-" + Date.now();
    
    return `
        <div class="booking-card">
            <span class="booking-card-title">🗓️ Schedule a Viewing</span>
            <form class="booking-form" id="${id}-form">
                <select id="${id}-listing" required>
                    <option value="" disabled selected>Select Property *</option>
                    ${listOptions}
                </select>
                <div style="display: flex; gap: 8px;">
                    <input type="date" id="${id}-date" min="${minDateStr}" required style="flex: 1.2;">
                    <select id="${id}-time" required style="flex: 1;">
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:30 PM">2:30 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:30 PM">5:30 PM</option>
                    </select>
                </div>
                <input type="text" id="${id}-name" placeholder="Your Full Name *" required>
                <input type="email" id="${id}-email" placeholder="Your Email Address *" required>
                <input type="tel" id="${id}-phone" placeholder="Phone Number *" required>
                
                <button type="submit" class="primary-btn size-sm">Confirm Booking Request</button>
            </form>
        </div>
    `;
}

// Generate inline HTML for lead capture form
function generateLeadFormHtml() {
    const id = "lead-" + Date.now();
    return `
        <div class="lead-form-card">
            <h4>📋 Register Client Profile</h4>
            <form class="chat-lead-form" id="${id}-form">
                <input type="text" id="${id}-name" placeholder="Full Name *" required>
                <input type="email" id="${id}-email" placeholder="Email Address *" required>
                <input type="tel" id="${id}-phone" placeholder="Phone Number">
                <input type="text" id="${id}-budget" placeholder="Target Budget (e.g. $4,000)">
                <input type="text" id="${id}-neighborhood" placeholder="Preferred Neighborhood">
                <button type="submit" class="primary-btn size-sm">Submit Profile</button>
            </form>
        </div>
    `;
}

// Render carousel of listings inside chat
function renderListingsCarousel(items) {
    const chatBody = document.getElementById("chatBody");
    const carousel = document.createElement("div");
    carousel.className = "listings-carousel";
    
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "chat-listing-card";
        
        const imgUrl = IMAGE_PRESETS[item.image] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80";
        
        card.innerHTML = `
            <div class="chat-list-img" style="background-image: url('${imgUrl}')">
                <span class="chat-list-price-tag">$${item.price.toLocaleString()}/mo</span>
            </div>
            <div class="chat-list-content">
                <span class="chat-list-title">${item.title}</span>
                <span class="chat-list-neighborhood">📍 ${item.neighborhood}</span>
                <div class="chat-list-specs">
                    <span>🛏️ ${item.beds}</span>
                    <span>🛁 ${item.baths} Bath</span>
                </div>
                <p class="chat-list-desc">${item.desc}</p>
                <button class="primary-btn size-sm chat-list-btn" onclick="triggerScheduleTour('${item.title}')">Schedule Tour</button>
            </div>
        `;
        carousel.appendChild(card);
    });
    
    chatBody.appendChild(carousel);
    scrollToBottom();
}

// Trigger inline scheduler from a card button
window.triggerScheduleTour = function(title) {
    handleUserMessage(`I want to schedule a tour for ${title}`);
};

// Render widget element inside chat bubble
function renderChatWidget(html) {
    const chatBody = document.getElementById("chatBody");
    const container = document.createElement("div");
    container.innerHTML = html;
    
    // Bind form submit dynamically
    const form = container.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const formId = form.id.split("-")[0];
        const isTourForm = form.id.includes("sched-") || document.getElementById(`${formId}-listing`) !== null;
        
        if (isTourForm) {
            // Tour Form submission
            const listing = document.getElementById(`${formId}-listing`).value;
            const date = document.getElementById(`${formId}-date`).value;
            const time = document.getElementById(`${formId}-time`).value;
            const name = document.getElementById(`${formId}-name`).value;
            const email = document.getElementById(`${formId}-email`).value;
            const phone = document.getElementById(`${formId}-phone`).value;
            
            // Save to leads database
            const prefs = `Tour: ${listing} | Date: ${date} ${time}`;
            captureNewLead(name, email, phone, prefs, true);
            
            // Replace form content with success animation
            const card = form.closest(".booking-card");
            card.innerHTML = `
                <div style="text-align: center; padding: 20px 10px; color: #00c853;">
                    <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <h4 style="font-size: 15px; margin-bottom: 6px;">Tour Request Submitted!</h4>
                    <p style="font-size: 12px; color: var(--text-secondary);">Thank you, <strong>${name}</strong>. We've blocked out <strong>${date} at ${time}</strong> for viewing <strong>${listing}</strong>. Our team will contact you shortly.</p>
                </div>
            `;
            
            // Bot responds following lead submission
            setTimeout(() => {
                addBotMessage(`Perfect! I've sent that booking request for **${listing}** on **${date} at ${time}** to our scheduling team. They will reach out to you via email or phone at **${phone}** shortly to confirm the access codes or arrange an agent meet-up. Let me know if you need help with anything else!`);
            }, 1200);
        } else {
            // Client Profile Form submission
            const name = document.getElementById(`${formId}-name`).value;
            const email = document.getElementById(`${formId}-email`).value;
            const phone = document.getElementById(`${formId}-phone`).value || "N/A";
            const budget = document.getElementById(`${formId}-budget`).value || "Any";
            const neighborhood = document.getElementById(`${formId}-neighborhood`).value || "Any";
            
            // Save to leads database
            const prefs = `Budget: ${budget} | Pref: ${neighborhood}`;
            captureNewLead(name, email, phone, prefs, false);
            
            // Replace form content with success animation
            const card = form.closest(".lead-form-card");
            card.innerHTML = `
                <div style="text-align: center; padding: 20px 10px; color: #00c853;">
                    <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <h4 style="font-size: 15px; margin-bottom: 6px;">Client Profile Registered!</h4>
                    <p style="font-size: 12px; color: var(--text-secondary);">Thank you, <strong>${name}</strong>. Your profile has been sent to our agents. We'll start sourcing matches for you.</p>
                </div>
            `;
            
            // Bot responds following lead submission
            setTimeout(() => {
                addBotMessage(`Awesome, I've registered your client profile under **${name}** for a budget of **${budget}** in **${neighborhood}**. One of our licensed agents will email you at **${email}** with some curated options shortly!`);
            }, 1200);
        }
    });
    
    // Fix: Appends firstElementChild to bypass leading newline/whitespace Text nodes
    chatBody.appendChild(container.firstElementChild);
    scrollToBottom();
}
