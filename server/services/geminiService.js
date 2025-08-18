// Handle fetch API compatibility
let fetch;
if (typeof globalThis.fetch === 'undefined') {
  // Fallback for older Node.js versions - install node-fetch@2 if needed
  try {
    fetch = require('node-fetch');
  } catch (error) {
    throw new Error(
      'Fetch API not available. Please use Node.js 18+ or install node-fetch@2: npm install node-fetch@2'
    );
  }
} else {
  fetch = globalThis.fetch;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL ='https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGeminiAPI(prompt) {
  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();

  // Safely extract text from Gemini response
  if (
    !data.candidates ||
    !data.candidates[0] ||
    !data.candidates[0].content ||
    !data.candidates[0].content.parts ||
    !data.candidates[0].content.parts[0].text
  ) {
    throw new Error('Invalid response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text.trim();
}

const generateProfessionalBio = async (name, title, skills, experience, education) => {
  try {
    const prompt = `Generate a professional, clean, and engaging bio for a portfolio website. 

Context:
- Name: ${name}
- Professional Title: ${title}
- Skills: ${skills.join(', ')}
- Experience: ${experience.length > 0 ? experience.join('; ') : 'No specific experience mentioned'}
- Education: ${education.length > 0 ? education.join('; ') : 'No specific education mentioned'}

Requirements:
- Keep it between 50-100words
- Write in third person
- Focus on professional achievements and expertise
- Make it engaging and memorable
- Use active voice and strong action verbs
- Avoid generic phrases and buzzwords
- Include specific skills and technologies when relevant
- Make it suitable for a professional portfolio website
- Tone should be confident but not boastful

Generate only the bio text, no additional formatting or explanations.`;

    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error generating bio with Gemini:', error);
    throw new Error('Failed to generate bio. Please try again.');
  }
};

const enhanceBioWithAI = async (currentBio) => {
  try {
    const prompt = `Improve and enhance the following professional bio to make it more engaging, professional, and impactful. Keep the same length (around 100-150 words) but make it more compelling.

Current bio:
"${currentBio}"

Requirements:
- Maintain the same core information
- Keep the tone same as the current bio
- Improve writing style and flow
- Use stronger action verbs
- Make it more engaging and memorable
- Keep it professional and clean
- Focus on achievements and expertise

Generate only the improved bio text, no additional formatting or explanations.`;

    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error enhancing bio with Gemini:', error);
    throw new Error('Failed to enhance bio. Please try again.');
  }
};

module.exports = {
  generateProfessionalBio,
  enhanceBioWithAI
};
