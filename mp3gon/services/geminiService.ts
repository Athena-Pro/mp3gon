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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sourceName, targetName, transformation, morphA, morphB }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to communicate with the AI name generator.');
  }

  const data = await response.json();
  if (Array.isArray(data.names)) {
    return data.names;
  }
  throw new Error('AI returned an unexpected data format.');
}
