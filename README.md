# REAL New York - AI Chatbot & Admin Dashboard

A premium, interactive AI Agent Console designed for the brokerage firm **REAL New York**. This application features a live AI Chatbot simulator powered by the Google Gemini API, alongside an Administrative Dashboard to customize the chatbot's behavior, track client leads, and manage a mock listings database.

## 🚀 Features

### 1. Live Chatbot Simulator
* **Interactive Chat UI**: Smooth, premium styling with dark/light mode toggle.
* **Three Broker Personas**: 
  * **Emma** (Residential Rentals Specialist)
  * **Alex** (Commercial Leasing Advisor)
  * **Sophia** (New Developments VIP Concierge)
* **API Integration**: Leverages the `gemini-3.5-flash` model for live, context-aware real estate advisory.
* **Smart UI Widgets**: Generates dynamic inline scheduling calendars (`[SCHEDULER]`), client profile forms (`[LEAD_FORM]`), and listing carousels (`[CAROUSEL]`) based on conversation flow.

### 2. Administrative Console
* **Bot Customizer**: Live-preview custom greeting messages, update preset prompt chips, customize brand accent colors, and manage the Gemini API key.
* **Leads Captured Database**: Real-time logging of client contact details, tour dates, and search preferences.
* **Mock Listing Catalog**: View, add, and remove properties in the catalog. The AI agent queries this database instantly when users ask for listings.

## 🛠️ Technology Stack
* **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
* **Styling**: Modern CSS variables, glassmorphism, responsive grid layouts
* **API**: Google Generative Language API (`v1beta` REST endpoint)
