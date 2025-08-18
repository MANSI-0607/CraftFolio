const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const generateProfessionalBio = async (
  name: string,
  title: string,
  skills: string[],
  experience: string[],
  education: string[]
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate-bio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        title,
        skills,
        experience,
        education
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate bio');
    }

    const data = await response.json();
    return data.bio;
  } catch (error) {
    console.error('Error generating bio:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate bio');
  }
};

export const enhanceBioWithAI = async (currentBio: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/enhance-bio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentBio
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to enhance bio');
    }

    const data = await response.json();
    return data.enhancedBio;
  } catch (error) {
    console.error('Error enhancing bio:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to enhance bio');
  }
};
