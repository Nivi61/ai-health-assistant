import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, Pill, Shield, Lightbulb, AlertCircle, Loader } from 'lucide-react';
import Groq from 'groq-sdk';

export default function AIHealthAssistant() {
  const [activeTab, setActiveTab] = useState('question');
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  const getSystemPrompt = () => {
    const basePrompt = `You are an AI Health Information Assistant. Your role is to provide evidence-based health awareness, symptom explanations, preventive care suggestions, and answers to health-related questions.

CRITICAL DISCLAIMER: Always emphasize that your information is educational and NOT a substitute for professional medical advice. Users should consult healthcare professionals for diagnosis, treatment, or medical decisions.

Guidelines:
- Provide clear, accurate health information in simple language
- Include preventive measures and lifestyle recommendations when relevant
- Reference general medical knowledge, not personal medical advice
- If a condition sounds serious or emergencies are mentioned, strongly recommend seeing a doctor
- Be empathetic and supportive in tone
- Always include the disclaimer when discussing specific conditions`;

    const tabSpecificPrompts = {
      question: `\n\nTopic: Answer General Health Questions\nFocus on providing educational, evidence-based answers to health-related questions. Be thorough but accessible.`,
      symptom: `\n\nTopic: Explain Symptoms\nWhen symptoms are mentioned, explain what they typically indicate, common causes, and when to seek medical attention. Always emphasize seeing a healthcare provider for diagnosis.`,
      preventive: `\n\nTopic: Suggest Preventive Care\nFocus on lifestyle changes, habits, and preventive measures that can improve health and reduce disease risk. Include nutrition, exercise, sleep, stress management, and regular check-ups.`,
      awareness: `\n\nTopic: Health Awareness & Guidance\nProvide tips for maintaining wellness, understanding health conditions, and making informed health decisions. Include information about health screenings and vaccinations appropriate for different ages.`
    };

    return basePrompt + (tabSpecificPrompts[activeTab] || '');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!input.trim() || loading) return;

  const userMessage = input;
  setInput('');
  setError('');
  setResponses(prev => [...prev, { role: 'user', content: userMessage }]);
  setLoading(true);

  try {
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not found. Please check your .env.local file');
    }

    const groq = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const message = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        ...responses.map(r => ({ role: r.role, content: r.content })),
        { role: 'user', content: userMessage }
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const assistantMessage = message.choices[0].message.content;
    setResponses(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
  } catch (err) {
    console.error('Error:', err);
    setError(`Error: ${err.message}. Please check your API key or try again.`);
    setResponses(prev => prev.slice(0, -1));
  } finally {
    setLoading(false);
  }
};


  const clearChat = () => {
    setResponses([]);
    setError('');
  };

  const getTabIcon = (tab) => {
    const icons = {
      question: <Heart className="w-5 h-5" />,
      symptom: <AlertCircle className="w-5 h-5" />,
      preventive: <Shield className="w-5 h-5" />,
      awareness: <Lightbulb className="w-5 h-5" />
    };
    return icons[tab];
  };

  const getTabLabel = (tab) => {
    const labels = {
      question: 'Health Questions',
      symptom: 'Symptom Info',
      preventive: 'Preventive Care',
      awareness: 'Health Tips'
    };
    return labels[tab];
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #00A699 100%)',
        color: 'white',
        padding: '24px 20px',
        boxShadow: '0 2px 12px rgba(0,102,204,0.15)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Heart style={{ width: '32px', height: '32px', fill: 'white' }} />
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
              AI Health Information Assistant
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.95 }}>
            Your intelligent guide to health awareness, symptom explanations, and preventive care
          </p>
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div style={{
        background: '#FFF3CD',
        borderLeft: '4px solid #FF6B6B',
        padding: '16px 20px',
        borderRadius: '0 8px 8px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertCircle style={{ width: '20px', height: '20px', color: '#FF6B6B', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#FF6B6B' }}>Medical Disclaimer:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#333' }}>
              This AI assistant provides general health information for educational purposes only and is <strong>NOT a substitute for professional medical advice, diagnosis, or treatment</strong>. Always consult with qualified healthcare professionals for medical concerns. In case of emergency, call emergency services immediately.
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={disclaimerAccepted}
                onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              I understand and accept this disclaimer
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '600px'
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #E0E0E0',
            background: '#FAFBFC'
          }}>
            {['question', 'symptom', 'preventive', 'awareness'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  clearChat();
                }}
                style={{
                  flex: 1,
                  padding: '16px 12px',
                  border: 'none',
                  background: activeTab === tab ? 'white' : 'transparent',
                  borderBottom: activeTab === tab ? '3px solid #0066CC' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? 600 : 500,
                  color: activeTab === tab ? '#0066CC' : '#666',
                  transition: 'all 0.3s ease'
                }}
              >
                {getTabIcon(tab)}
                <span>{getTabLabel(tab)}</span>
              </button>
            ))}
          </div>

          {!disclaimerAccepted && (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              textAlign: 'center',
              color: '#666'
            }}>
              <div>
                <AlertCircle style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#0066CC', opacity: 0.7 }} />
                <p style={{ fontSize: '16px', margin: 0 }}>Please accept the medical disclaimer to continue using the assistant.</p>
              </div>
            </div>
          )}

          {disclaimerAccepted && (
            <>
              {/* Messages Display */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {responses.length === 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#999',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                      <p style={{ margin: 0, fontSize: '16px' }}>Ask a health question or request information to get started</p>
                    </div>
                  </div>
                )}

                {responses.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{
                      maxWidth: '75%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: msg.role === 'user' ? '#0066CC' : '#F0F4F8',
                      color: msg.role === 'user' ? 'white' : '#333',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#0066CC' }}>
                    <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '14px' }}>AI Assistant is thinking...</span>
                  </div>
                )}

                {error && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#FFE5E5',
                    color: '#D32F2F',
                    fontSize: '14px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{
                borderTop: '1px solid #E0E0E0',
                padding: '16px 20px',
                background: '#FAFBFC'
              }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your health question..."
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #D0D0D0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      opacity: loading ? 0.6 : 1
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0066CC';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D0D0D0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                      padding: '12px 20px',
                      background: loading || !input.trim() ? '#CCC' : '#0066CC',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      transition: 'background 0.2s'
                    }}
                  >
                    <Send style={{ width: '18px', height: '18px' }} />
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Features Overview */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 20px',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {[
            { icon: Heart, title: 'Health Questions', desc: 'Get answers to general health questions' },
            { icon: AlertCircle, title: 'Symptom Info', desc: 'Understand what symptoms may indicate' },
            { icon: Shield, title: 'Preventive Care', desc: 'Learn about lifestyle and prevention' },
            { icon: Lightbulb, title: 'Health Tips', desc: 'Discover wellness guidance and awareness' }
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <feature.icon style={{
                width: '32px',
                height: '32px',
                color: '#0066CC',
                flexShrink: 0
              }} />
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#333' }}>
                  {feature.title}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '24px 20px',
        color: '#999',
        fontSize: '13px',
        marginTop: '40px',
        borderTop: '1px solid #E0E0E0'
      }}>
        <p style={{ margin: '0 0 8px 0' }}>
          This assistant uses advanced AI to provide health information for educational purposes only.
        </p>
        <p style={{ margin: 0 }}>
          Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        input:disabled {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}