import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

const API_KEY = "AIzaSyAIuZclU5I7tHhY8WEWM8mGfAi8fRPgiKo";

const App = () => {
  const [generatedText, setGeneratedText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [blockStyle, setBlockStyle] = useState({
    padding: '30px', // Adjusted padding to make the white block bigger
    borderRadius: '8px',
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.5s ease-in-out',
    marginBottom: '20px',
  });
  const [message, setMessage] = useState('');

  const genAI = new GoogleGenerativeAI(API_KEY);

  useEffect(() => {
    if (generatedText) {
      setShowBackground(true);
      setLoading(false);
      setBlockStyle(prevStyle => ({
        ...prevStyle,
        padding: '40px',
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }));
    }
  }, [generatedText, blockStyle]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Prompt to change the personality of the AI
    const prompt = `You are a customer support assistant from EON Reality named EON. Reply these customer emails ${message}.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setGeneratedText(text);
      setError('');
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedText('');
      setError('Error generating content. Please try again.');
    }

    setMessage('');
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div style={{ backgroundColor: showBackground ? '#F2F2F7' : '#1e2a78', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.5s ease-in-out' }}>
      <div style={blockStyle}>
        <h1 style={{ color: '#000', textAlign: 'center', fontFamily: 'Helvetica Neue', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>EON Customer Support Chat</h1>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type your questions here..."
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D1D6', boxSizing: 'border-box', maxWidth: '300px' }}
          />
          <button onClick={sendMessage} style={{ marginLeft: '10px', backgroundColor: '#007AFF', color: '#FFF', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Send</button>
        </div>
        {loading && <div style={{ textAlign: 'center', marginTop: '20px', color: '#000', fontFamily: 'Helvetica Neue', fontSize: '16px' }}>Loading...</div>}
        {generatedText && (
          <div style={{ marginTop: '20px', color: '#000', fontFamily: 'Helvetica Neue', fontSize: '16px', textAlign: 'center', width: '100%', overflowY: 'auto' }}>{generatedText}</div>
        )}
        {error && <div style={{ color: 'red', marginTop: '10px', fontFamily: 'Helvetica Neue', fontSize: '16px', textAlign: 'center' }}>{error}</div>}
      </div>
    </div>
  );
};

export default App;
