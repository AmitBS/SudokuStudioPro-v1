import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransientError(err) {
  if (!err) return false;
  const status = err.status || err.code || err.statusCode;
  if (status === 503 || status === 429 || status === 500 || status === 'UNAVAILABLE') {
    return true;
  }
  const msg = typeof err.message === 'string' ? err.message : JSON.stringify(err);
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('high demand') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('overloaded') ||
    msg.includes('Spikes in demand')
  );
}

// API Endpoint: Scan Sudoku Grid from Image using Gemini OCR
app.post('/api/scan-sudoku', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== 'string') {
      res.status(400).json({ success: false, error: 'No image provided' });
      return;
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    }

    const promptText = `
You are an expert precision Sudoku digit recognition engine.
Carefully examine the uploaded image of a 9x9 Sudoku puzzle.
1. Detect the outer 9x9 boundary of the main puzzle grid.
2. Read every cell from top-to-bottom (row index 0 to 8) and left-to-right (column index 0 to 8).
3. If a cell contains a printed or written digit (1 to 9), output that digit.
4. If a cell is blank or contains tiny pencil candidates/notes, output 0.
5. Return a valid JSON object with the property "grid" containing an array of 9 arrays, each with 9 numbers from 0 to 9.
`;

    let lastError = null;
    let responseText = null;
    let successfulModel = null;

    modelLoop: for (let mIdx = 0; mIdx < CANDIDATE_MODELS.length; mIdx++) {
      const modelName = CANDIDATE_MODELS[mIdx];
      const maxAttemptsPerModel = 2;

      for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: promptText,
                },
              ],
            },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  grid: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.INTEGER,
                      },
                    },
                  },
                },
                required: ['grid'],
              },
            },
          });

          if (response && response.text) {
            responseText = response.text;
            successfulModel = modelName;
            break modelLoop;
          }
        } catch (err) {
          lastError = err;
          if (isTransientError(err)) {
            if (attempt < maxAttemptsPerModel) {
              await sleep(800);
              continue;
            } else if (mIdx < CANDIDATE_MODELS.length - 1) {
              await sleep(400);
            }
          } else {
            break;
          }
        }
      }
    }

    if (!responseText) {
      const friendlyMessage = isTransientError(lastError)
        ? 'The AI vision service is momentarily busy handling peak traffic. Please tap "Retry AI Scan" or tap cells to enter numbers manually.'
        : 'Could not clearly recognize the 9x9 Sudoku grid from this image. Please check that the puzzle is well-lit and tap "Retry AI Scan", or tap any cell in the table to input numbers.';

      res.status(503).json({
        success: false,
        error: friendlyMessage,
        isTransient: isTransientError(lastError),
      });
      return;
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    }
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedText = cleanedText.slice(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleanedText);
    const rawGrid = parsed.grid || parsed.sudoku || parsed.board;

    const sanitizedGrid = Array.from({ length: 9 }, (_, r) => {
      const row = Array.isArray(rawGrid?.[r]) ? rawGrid[r] : [];
      return Array.from({ length: 9 }, (_, c) => {
        const val = Number(row[c]);
        return !isNaN(val) && val >= 1 && val <= 9 ? Math.floor(val) : 0;
      });
    });

    const clueCount = sanitizedGrid.flat().filter((v) => v > 0).length;

    res.json({
      success: true,
      grid: sanitizedGrid,
      clueCount,
      modelUsed: successfulModel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to scan image',
    });
  }
});

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('sw.js') || filePath.endsWith('manifest.json') || filePath.endsWith('manifest.webmanifest')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server listening on http://0.0.0.0:${PORT}`);
});
