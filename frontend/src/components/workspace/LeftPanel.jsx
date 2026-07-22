import React, { useState } from 'react';
import { Bot, Sparkles, LayoutTemplate, Settings2, Loader2, AlertCircle } from 'lucide-react';

const LeftPanel = ({ resumeData, updateResumeData, aiStatus, followUpQuestions, themeConfig, updateTheme, setPreset, askAi }) => {
  const [initialPrompt, setInitialPrompt] = useState("");
  const [answers, setAnswers] = useState({});

  const handleInitialSubmit = () => {
    if (initialPrompt.trim()) {
      askAi(initialPrompt);
      setInitialPrompt("");
    }
  };

  const handleAnswersSubmit = () => {
    // Combine questions and answers into a single string for the AI context
    const combinedAnswers = followUpQuestions.map((q, index) => {
      return `Q: ${q}\nA: ${answers[index] || 'No answer provided.'}`;
    }).join('\n\n');
    
    askAi(combinedAnswers);
    setAnswers({}); // Clear the answers state so new questions start fresh
  };

  return (
    <div className="left-panel">
      <div className="panel-title">
        <Bot size={24} color="var(--primary-color)" />
        AI Resume Builder
      </div>

      <div className="panel-section">
        {aiStatus === 'initial' && (
           <>
              <div className="ai-chat-bubble">
                <p style={{ margin: 0, fontWeight: 500 }}>Hello! Tell me about yourself. What kind of resume are you looking to build?</p>
              </div>
              <div className="input-group">
                <textarea 
                  rows={4} 
                  placeholder="E.g., I'm a React developer with 3 years of experience at a startup..." 
                  value={initialPrompt}
                  onChange={(e) => setInitialPrompt(e.target.value)}
                />
              </div>
              <button className="button" onClick={handleInitialSubmit} disabled={!initialPrompt.trim()}>
                <Sparkles size={18} /> Generate Resume
              </button>
           </>
        )}

        {aiStatus === 'loading' && (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
              <p>The AI is thinking...</p>
           </div>
        )}

        {aiStatus === 'incomplete' && (
           <>
              <div className="ai-chat-bubble">
                <p style={{ margin: 0, fontWeight: 500 }}>I need a bit more information to perfect your resume. Could you answer these quick questions?</p>
              </div>
              {followUpQuestions.map((q, index) => (
                <div className="input-group" key={index}>
                  <label>{q}</label>
                  <textarea 
                    rows={2} 
                    placeholder="Your answer..." 
                    value={answers[index] || ''}
                    onChange={(e) => setAnswers(prev => ({...prev, [index]: e.target.value}))}
                  />
                </div>
              ))}
              <button className="button" onClick={handleAnswersSubmit}>
                <Sparkles size={18} /> Submit Answers
              </button>
           </>
        )}

        {aiStatus === 'error' && (
            <>
              <div className="ai-chat-bubble" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <p style={{ margin: 0, fontWeight: 500, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} /> Error
                </p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{followUpQuestions[0]}</p>
              </div>
              <button className="button" onClick={() => askAi("Please try again.")}>
                 Try Again
              </button>
            </>
        )}

        {aiStatus === 'complete' && (
            <div className="ai-chat-bubble">
                <p style={{ margin: 0, fontWeight: 500, color: '#10b981' }}>Resume generated successfully! Feel free to edit the contents manually below or change the style.</p>
            </div>
        )}
      </div>

      <div className="panel-section">
        <div className="panel-title" style={{ fontSize: '1rem', color: '#cbd5e1' }}>
          <LayoutTemplate size={20} /> Content Editor
        </div>
        
        <div className="input-group">
          <label>Full Name</label>
          <input 
            type="text" 
            value={resumeData.name || ''} 
            onChange={(e) => updateResumeData('name', e.target.value)} 
          />
        </div>
        
        <div className="input-group">
          <label>Professional Summary</label>
          <textarea 
            rows={4}
            value={resumeData.summary || ''} 
            onChange={(e) => updateResumeData('summary', e.target.value)} 
          />
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title" style={{ fontSize: '1rem', color: '#cbd5e1' }}>
          <Settings2 size={20} /> Styling & Layout
        </div>
        
        <div className="slider-group">
          <label>Margin</label>
          <input 
            type="range" 
            min="1" max="4" step="0.5" 
            value={themeConfig.margin}
            onChange={(e) => updateTheme('margin', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="slider-group">
          <label>Line Height</label>
          <input 
            type="range" 
            min="1.1" max="2" step="0.1" 
            value={themeConfig.lineHeight}
            onChange={(e) => updateTheme('lineHeight', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="slider-group">
          <label>Text Size</label>
          <input 
            type="range" 
            min="12" max="18" step="1" 
            value={themeConfig.textSize}
            onChange={(e) => updateTheme('textSize', parseInt(e.target.value))}
          />
        </div>

        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Theme Presets (One-Click Style Swapper)</label>
        <div className="theme-presets">
          <button className={`preset-btn ${themeConfig.font === 'var(--resume-font-sans)' && themeConfig.color === '#0f172a' ? 'active' : ''}`} onClick={() => setPreset('modern')}>Modern</button>
          <button className={`preset-btn ${themeConfig.font === 'var(--resume-font-serif)' && themeConfig.color === '#1e3a8a' ? 'active' : ''}`} onClick={() => setPreset('classic')}>Classic</button>
          <button className={`preset-btn ${themeConfig.font === 'var(--resume-font-sans)' && themeConfig.color === '#334155' && themeConfig.margin === 1.5 ? 'active' : ''}`} onClick={() => setPreset('compact')}>Compact</button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
