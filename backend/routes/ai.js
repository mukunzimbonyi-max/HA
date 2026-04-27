const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

router.post('/ask', async (req, res) => {
  const { question, language } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  console.log(`Groq AI Request received: "${question}" in ${language}`);

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!apiKey) {
    console.error('GROQ_API_KEY is missing in .env');
    return res.status(500).json({ error: 'AI Service Configuration Error' });
  }

  try {
    const systemPrompt = `You are a helpful, private, and stigma-free health assistant for "My Health My Friend", a platform for Rwandan youth.
    Your focus is on Sexual and Reproductive Health (SRH) and mental health. 
    The user is asking in ${language}. Please respond in ${language}. 
    Provide accurate, non-judgmental information about pregnancy prevention, HIV/STI prevention, safe choices, and mental well-being.
    Always include a disclaimer that you are an AI and the user should consult a professional for serious medical issues.
    Keep the tone friendly, supportive, and youthful.
    CRITICAL: Keep your answers BRIEF and CONCISE. Avoid long paragraphs. Use bullet points if necessary.`;

    console.log(`Sending to Groq with model: llama-3.3-70b-versatile`);
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    console.log('Groq Response Status:', response.status);
    
    if (!response.ok) {
      console.error('Groq API Error Response:', data);
      throw new Error(data.error?.message || `Groq API error: ${response.status}`);
    }

    if (!data.choices || data.choices.length === 0) {
      console.error('Groq Response missing choices:', data);
      throw new Error('AI returned an empty response.');
    }

    const answer = data.choices[0].message.content;
    
    console.log(`Groq AI Response generated successfully.`);

    res.json({ 
      answer,
      voiceSupported: true 
    });
  } catch (err) {
    console.error('Groq AI Error Details:', err.message);
    res.status(500).json({ error: 'AI Service Error', details: err.message });
  }
});

module.exports = router;
