 codex/create-api-route-for-gemini
import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { TransformationType } from '../types';

// Helper to read and parse JSON body from requests
async function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Gemini name generation will be unavailable.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

 main
const nameGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    names: {
      type: Type.ARRAY,
      description: 'A list of 5 creative, evocative, and interesting names for the sound.',
      items: { type: Type.STRING }
    }
  },
  required: ['names']
};

 codex/create-api-route-for-gemini
async function generateNames(
  sourceName: string,
  targetName: string,
  transformation: TransformationType,
  morphA?: TransformationType,
  morphB?: TransformationType
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });

  let transformationDescription = `The transformation technique used was: "${transformation}".`;
  if (transformation === TransformationType.TRANSFORMATION_MORPH) {
app.post('/api/gemini', async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  }

  const { sourceName, targetName, transformation, morphA, morphB } = req.body as {
    sourceName: string;
    targetName: string;
    transformation: string;
    morphA?: string;
    morphB?: string;
  };

  let transformationDescription = `The transformation technique used was: "${transformation}".`;
  if (transformation === 'Transformation Morphing') {
 main
    transformationDescription += ` This was a morph between two techniques: "${morphA}" (A) and "${morphB}" (B).`;
  }

  const prompt = `
    I have created a new sound using a digital audio technique. I need some creative names for it.

    The process involved two sounds:
    1.  Source Sound (whose characteristics were taken): "${sourceName}"
    2.  Target Sound (the sound that was modified): "${targetName}"

    ${transformationDescription}

    Here are descriptions of the techniques:
 codex/create-api-route-for-gemini
    - "${TransformationType.AMPLITUDE}": The rhythm and volume shape of the source was applied to the target.
    - "${TransformationType.SPECTRAL}": The tonal color and frequency character of the source was imprinted onto the target.
    - "${TransformationType.RHYTHMIC}": The percussive hits of the source were used to trigger the target sound.
    - "${TransformationType.CONVOLUTION}": The resonance and acoustic space of the source was applied to the target.
    - "${TransformationType.TIME_WARP}": The rhythmic timing of the source was applied to the target, stretching and shrinking it to match the source's groove.
    - "${TransformationType.SURFACE_TRANSLATE}": The texture of the target sound was re-sequenced according to the waveform shape of the source.
    - "${TransformationType.FOURIER_MASKING}": The raw frequency-by-frequency power of the source was applied to the target's sound structure, creating a direct spectral merge.
    - "${TransformationType.HARMONIC_IMPRINT}": The distinct musical notes and overtones from the source were found and used to create resonant echoes in the target.
    - "${TransformationType.INTERFERENCE_ECHOES}": Rhythmic events in the source audio were used to trigger cascading, feedback-driven echoes of the target audio, creating a complex, interactive delay effect.
    - "${TransformationType.FORMANT_SHIFTING}": The key resonant frequencies that define the 'vowel' character of the source sound were identified and used to create a set of resonant filters that re-shaped the target sound, giving it the vocal quality of the source.
    - "${TransformationType.DYNAMIC_RING_MOD}": The amplitude of the source sound was used to dynamically control the frequency of a sine wave oscillator, which was then multiplied with the target sound to create shifting, metallic, and bell-like textures.
    - "${TransformationType.TRANSFORMATION_MORPH}": A smooth blend was created between the results of two different transformation techniques (A and B).
    - "Amplitude Mapping": The rhythm and volume shape of the source was applied to the target.
    - "Spectral Shaping": The tonal color and frequency character of the source was imprinted onto the target.
    - "Rhythmic Gating": The percussive hits of the source were used to trigger the target sound.
    - "Convolution Morphing": The resonance and acoustic space of the source was applied to the target.
    - "Time Scale Warping": The rhythmic timing of the source was applied to the target, stretching and shrinking it to match the source's groove.
    - "Surface Translation": The texture of the target sound was re-sequenced according to the waveform shape of the source.
    - "Fourier Masking": The raw frequency-by-frequency power of the source was applied to the target's sound structure, creating a direct spectral merge.
    - "Harmonic Imprinting": The distinct musical notes and overtones from the source were found and used to create resonant echoes in the target.
    - "Interference Echoes": Rhythmic events in the source audio were used to trigger cascading, feedback-driven echoes of the target audio, creating a complex, interactive delay effect.
    - "Formant Shifting": The key resonant frequencies that define the 'vowel' character of the source sound were identified and used to create a set of resonant filters that re-shaped the target sound, giving it the vocal quality of the source.
    - "Dynamic Ring Modulation": The amplitude of the source sound was used to dynamically control the frequency of a sine wave oscillator, which was then multiplied with the target sound to create shifting, metallic, and bell-like textures.
    - "Transformation Morphing": A smooth blend was created between the results of two different transformation techniques (A and B).
 main

    Based on this information, generate a list of 5 creative, evocative, and interesting names for the resulting sound. The names should be short (2-4 words). Avoid generic or technical terms. Think artistically.
  `;

 codex/create-api-route-for-gemini
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: nameGenerationSchema,
      temperature: 0.8,
    },
  });

  const jsonText = response.text.trim();
  const result = JSON.parse(jsonText);
  if (!result || !Array.isArray(result.names)) {
    throw new Error('AI returned an unexpected data format.');
  }
  return result.names;
}

export function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/gemini', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const { sourceName, targetName, transformation, morphA, morphB } = await parseJsonBody(req);
          if (
            typeof sourceName !== 'string' ||
            typeof targetName !== 'string' ||
            typeof transformation !== 'string' ||
            (transformation === TransformationType.TRANSFORMATION_MORPH && (typeof morphA !== 'string' || typeof morphB !== 'string'))
          ) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid input' }));
            return;
          }

          const names = await generateNames(sourceName, targetName, transformation as TransformationType, morphA, morphB);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ names }));
        } catch (err) {
          console.error('Gemini API route error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to generate names' }));
        }
      });
    }
  };
}

export default geminiApiPlugin;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: nameGenerationSchema,
        temperature: 0.8
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && Array.isArray(result.names)) {
      return res.json({ names: result.names });
    } else {
      console.error('Unexpected JSON structure from Gemini:', result);
      return res.status(500).json({ error: 'AI returned an unexpected data format.' });
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
      return res.status(401).json({ error: 'The configured Gemini API key is not valid.' });
    }
    return res.status(500).json({ error: 'Failed to communicate with the AI name generator.' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

export default app;
 main
