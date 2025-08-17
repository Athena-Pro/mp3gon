import { TransformationType } from '../types';

export async function generateSoundName(
  sourceName: string,
  targetName: string,
  transformation: TransformationType,
  morphA?: TransformationType,
  morphB?: TransformationType
): Promise<string[]> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceName, targetName, transformation, morphA, morphB }),
  });

  if (!response.ok) {
    let message = 'Failed to communicate with the AI name generator.';
    try {
      const errorData = await response.json();
      if (errorData && typeof errorData.error === 'string') {
        message = errorData.error;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.names)) {
    throw new Error('AI returned an unexpected data format.');
  }
  return data.names;
}
