# AI Health Information Assistant

A sophisticated GenAI-powered dynamic web application that provides reliable health awareness, symptom explanations, preventive care suggestions, and answers to health-related questions through real-time AI-generated responses.

## 🎯 Project Overview

**AI Health Information Assistant** is an interactive React-based web application that leverages Groq's advanced AI models to deliver evidence-based health information. The application is designed with healthcare-specific UI patterns and includes prominent medical disclaimers emphasizing that it is NOT a substitute for professional medical advice.

**Live Demo:** https://ai-health-assistant-2-259s.onrender.com

## ✨ Key Features

✅ **Four Specialized Health Modes**
- **Health Questions** - Get answers to general health inquiries
- **Symptom Information** - Understand what symptoms typically indicate
- **Preventive Care** - Learn lifestyle and prevention strategies
- **Health Awareness** - Discover wellness tips and health guidance

✅ **Real-Time GenAI Integration**
- Powered by Groq's llama-3.1-8b-instant model
- Context-aware dynamic prompting based on selected topic
- Full conversation history management
- Sub-second response times

✅ **Professional Healthcare Design**
- Medical-grade color palette (blues, teals, greens)
- Responsive design for mobile, tablet, and desktop
- Smooth animations and professional UX
- Healthcare-compliant interface patterns

✅ **Safety-First Implementation**
- Prominent, non-dismissible medical disclaimer
- Multi-layer safety: disclaimer, system prompts, UI messaging
- AI explicitly instructed not to diagnose
- Emergency care warnings when appropriate

✅ **User-Friendly Interface**
- Clean, intuitive tab-based navigation
- Real-time chat interaction
- Loading indicators and error handling
- Accessible color contrast and typography

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | UI framework and state management |
| **Icons** | Lucide React | Professional healthcare iconography |
| **Styling** | CSS-in-JS | Responsive and accessible design |
| **GenAI** | Groq API | Real-time AI response generation |
| **HTTP Client** | Fetch API | API communication |
| **Build Tool** | Create React App | Development and production builds |

### Component Structure

AIHealthAssistant (Main Component)


├── Header Section (Title & Branding)

├── Disclaimer Banner (Medical Warning)

├── Tab Navigation (4 specialized modes)

├── Message Thread (Conversation History)

├── Input Form (User Query)

├── Features Grid (Overview Cards)

└── Footer (Disclaimer Reiteration)


### API Key Protection
- API key stored in `.env.local` (not committed to Git)
- `.gitignore` prevents accidental exposure
- Never logged or exposed to client

### API Call Flow

User Input
↓
Validation & State Update
↓
Build Context-Specific System Prompt
↓
Call Groq API (llama-3.1-8b-instant)
↓
Parse Response
↓
Update Message History
↓
Display in Chat UI

## ⚠️ Important Note

This application is for **educational purposes only**. It is **NOT a substitute for professional medical advice, diagnosis, or treatment**. Always consult with qualified healthcare professionals for medical concerns. In case of medical emergency, call emergency services immediately.



