import { useState, useEffect } from 'react';

export function useResumeWorkspace() {
  const [resumeData, setResumeData] = useState({
    title: 'Professional Resume',
    name: '',
    email: '',
    phone: '',
    summary: 'Enter a prompt in the left panel to generate your resume.',
    experience: [],
    education: [],
    projects: []
  });

  const [aiStatus, setAiStatus] = useState('initial'); // 'initial', 'loading', 'incomplete', 'complete', 'error'
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  
  // Keep track of the full conversation context for the AI
  const [conversationContext, setConversationContext] = useState("");

  const [themeConfig, setThemeConfig] = useState({
    font: 'var(--resume-font-sans)',
    color: '#1e293b',
    margin: 2, // rem
    lineHeight: 1.5,
    textSize: 14 // px
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--resume-font', themeConfig.font);
    root.style.setProperty('--resume-color', themeConfig.color);
    root.style.setProperty('--resume-margin', `${themeConfig.margin}rem`);
    root.style.setProperty('--resume-line-height', themeConfig.lineHeight);
    root.style.setProperty('--resume-text-size', `${themeConfig.textSize}px`);
  }, [themeConfig]);

  const updateResumeData = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const updateTheme = (field, value) => {
    setThemeConfig(prev => ({ ...prev, [field]: value }));
  };

  const setPreset = (presetName) => {
    if (presetName === 'modern') {
      setThemeConfig({
        font: 'var(--resume-font-sans)',
        color: '#0f172a',
        margin: 2.5,
        lineHeight: 1.6,
        textSize: 14
      });
    } else if (presetName === 'classic') {
      setThemeConfig({
        font: 'var(--resume-font-serif)',
        color: '#1e3a8a',
        margin: 2,
        lineHeight: 1.5,
        textSize: 15
      });
    } else if (presetName === 'compact') {
      setThemeConfig({
        font: 'var(--resume-font-sans)',
        color: '#334155',
        margin: 1.5,
        lineHeight: 1.3,
        textSize: 13
      });
    }
  };

  const askAi = async (userInput) => {
    setAiStatus('loading');
    
    // Append the new user input to the running context
    const fullPrompt = conversationContext 
        ? `${conversationContext}\n\nUser: ${userInput}`
        : `User: ${userInput}`;
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });
      
      const data = await response.json();
      
      if (data.status === 'incomplete') {
        setAiStatus('incomplete');
        setFollowUpQuestions(data.followUpQuestions || []);
        // Save what the AI asked so it's part of the context for the next call
        setConversationContext(`${fullPrompt}\n\nAI: Asked questions: ${data.followUpQuestions.join(', ')}`);
      } else if (data.status === 'complete') {
        setAiStatus('complete');
        // Parse the returned AI data into the resume format
        if (data.data) {
          setResumeData(prev => ({
             ...prev,
             ...data.data,
             experience: data.data.experiences || [],
             education: data.data.educations || [],
             projects: data.data.projects || []
          }));
        }
        setConversationContext(`${fullPrompt}\n\nAI: Generated Resume`);
      } else {
         setAiStatus('error');
         setFollowUpQuestions(data.followUpQuestions || ['An error occurred.']);
      }
    } catch (error) {
      console.error("AI API Error:", error);
      setAiStatus('error');
      setFollowUpQuestions(['Failed to reach the AI server. Please make sure the Spring Boot backend is running and the API key is set.']);
    }
  };

  return {
    resumeData,
    updateResumeData,
    aiStatus,
    followUpQuestions,
    themeConfig,
    updateTheme,
    setPreset,
    askAi
  };
}
