import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support large payload for base64 PDF uploads (up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Shared Gemini client setup
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const studyKitSchema = {
  type: Type.OBJECT,
  properties: {
    paperTitle: {
      type: Type.STRING,
      description: 'The title of the academic research paper, or Unknown if not found',
    },
    keyConcepts: {
      type: Type.ARRAY,
      description: '3 to 5 important concepts from the paper, each explained in 2-3 concise sentences in plain language',
      items: {
        type: Type.OBJECT,
        properties: {
          concept: {
            type: Type.STRING,
            description: 'The specific academic concept or mechanism name',
          },
          summary: {
            type: Type.STRING,
            description: '2 to 3 concise sentences in plain, accessible language explaining what it is and how it works',
          },
          whyItMatters: {
            type: Type.STRING,
            description: 'One concise sentence stating why this concept is critical in the paper',
          },
        },
        required: ['concept', 'summary', 'whyItMatters'],
      },
    },
    practiceQuestions: {
      type: Type.OBJECT,
      description: 'Practice exam questions adapted strictly to the requested difficulty level',
      properties: {
        difficulty: {
          type: Type.STRING,
          description: 'The difficulty level applied: Easy, Medium, or Hard',
        },
        multipleChoice: {
          type: Type.OBJECT,
          description: 'One multiple-choice question with four options, correct index, and explanation',
          properties: {
            question: {
              type: Type.STRING,
              description: 'Multiple choice question stem testing conceptual understanding at the chosen difficulty',
            },
            options: {
              type: Type.ARRAY,
              description: 'Exactly four plausible options',
              items: { type: Type.STRING },
            },
            correctIndex: {
              type: Type.INTEGER,
              description: 'Zero-based index (0, 1, 2, or 3) of the correct option',
            },
            explanation: {
              type: Type.STRING,
              description: 'Short explanation of why the correct option is right and others are incorrect',
            },
          },
          required: ['question', 'options', 'correctIndex', 'explanation'],
        },
        shortAnswer: {
          type: Type.OBJECT,
          description: 'One short-answer question with a sample high-scoring answer',
          properties: {
            question: {
              type: Type.STRING,
              description: 'Short-answer analytical question appropriate for the difficulty level',
            },
            sampleHighScoringAnswer: {
              type: Type.STRING,
              description: 'Sample high-scoring student response demonstrating mastery',
            },
            keyRubricPoints: {
              type: Type.ARRAY,
              description: '2 to 3 key points a grader looks for in a complete answer',
              items: { type: Type.STRING },
            },
          },
          required: ['question', 'sampleHighScoringAnswer', 'keyRubricPoints'],
        },
        realWorldApplication: {
          type: Type.OBJECT,
          description: 'One real-world application question connecting the paper to practical scenarios',
          properties: {
            scenario: {
              type: Type.STRING,
              description: 'A realistic industry, clinical, or technological scenario',
            },
            question: {
              type: Type.STRING,
              description: 'Application prompt asking how the paper\'s methodology or findings apply',
            },
            sampleApproach: {
              type: Type.STRING,
              description: 'Concise solution or analysis applying the paper\'s core insight',
            },
          },
          required: ['scenario', 'question', 'sampleApproach'],
        },
      },
      required: ['difficulty', 'multipleChoice', 'shortAnswer', 'realWorldApplication'],
    },
    flashcards: {
      type: Type.ARRAY,
      description: '5 to 10 term/question and answer pairs displayed clearly with front and back fields',
      items: {
        type: Type.OBJECT,
        properties: {
          front: {
            type: Type.STRING,
            description: 'Front of card: Key term, formula, or core conceptual question',
          },
          back: {
            type: Type.STRING,
            description: 'Back of card: Clear, concise explanation or definition',
          },
          category: {
            type: Type.STRING,
            description: 'Short category like Terminology, Architecture, Core Formula, or Finding',
          },
        },
        required: ['front', 'back', 'category'],
      },
    },
    metadata: {
      type: Type.OBJECT,
      description: 'Paper metadata. Never invent facts absent from the paper; label missing metadata Unknown.',
      properties: {
        title: {
          type: Type.STRING,
          description: 'Paper title or Unknown',
        },
        authors: {
          type: Type.STRING,
          description: 'Comma-separated authors or Unknown',
        },
        publicationVenue: {
          type: Type.STRING,
          description: 'Journal, conference, or publisher, or Unknown',
        },
        publicationYear: {
          type: Type.STRING,
          description: 'Four-digit year or Unknown',
        },
        citationCount: {
          type: Type.STRING,
          description: 'Integer citation count if the paper explicitly states it, otherwise Unknown',
        },
        disclaimer: {
          type: Type.STRING,
          description: 'Verification statement reminding student to verify against source paper',
        },
      },
      required: ['title', 'authors', 'publicationVenue', 'publicationYear', 'citationCount', 'disclaimer'],
    },
  },
  required: ['paperTitle', 'keyConcepts', 'practiceQuestions', 'flashcards', 'metadata'],
};

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Primary Study Kit generation endpoint
app.post('/api/generate-kit', async (req, res) => {
  try {
    const { pdfBase64, text, difficulty = 'Medium', filename } = req.body;

    if (!pdfBase64 && (!text || text.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either a PDF document or paste research paper text.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured on the server. Please check your environment configuration or Settings > Secrets.',
      });
    }

    const validDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium';

    const systemInstruction = `You are PaperPilot, an expert academic research tutor assisting university and secondary students in understanding complex scholarly papers.

CRITICAL INSTRUCTIONS:
1. Grounding: Analyze ONLY the supplied academic paper provided in the input. Do NOT invent facts or extrapolate beyond what the authors wrote.
2. Metadata Integrity: If any metadata field (authors, publication venue, publication year, citation count) is NOT explicitly stated in the provided text, you MUST label it as "Unknown". For citation count, only provide an integer if the paper explicitly states its citations, otherwise say "Unknown".
3. Key Concepts: Provide 3 to 5 important concepts. Each concept MUST be explained in 2 to 3 concise sentences in plain, accessible language that a beginner can digest easily.
4. Practice Exam Questions: Adapt all questions to the selected difficulty level (${validDifficulty}):
   - 'Easy': Focus on foundational principles, intuitive analogies, and basic identification.
   - 'Medium': Focus on standard undergraduate depth, mechanism analysis, and cause-and-effect reasoning.
   - 'Hard': Focus on rigorous graduate-level depth, edge cases, trade-offs, and methodology scrutiny.
   - Provide exactly 1 multiple-choice question (4 options, correctIndex 0-3, short explanation).
   - Provide exactly 1 short-answer question (with a sample high-scoring answer and 2-3 rubric criteria).
   - Provide exactly 1 real-world application question (practical industry/societal scenario applying the paper).
5. Flashcards: Generate 5 to 10 high-value term/question and answer pairs with "front" and "back" fields.
6. Verification Notice: Emphasize in the disclaimer that AI-generated study material should always be verified against the source paper.
7. Tone & Brevity: Keep explanations crisp, educational, and token-efficient.`;

    const userPrompt = `Generate a complete PaperPilot Study Kit for the attached research paper at '${validDifficulty}' difficulty level. Ensure all schemas are populated strictly from the text.`;

    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    if (pdfBase64) {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64,
        },
      });
      parts.push({
        text: `Uploaded PDF Filename: ${filename || 'ResearchPaper.pdf'}\n\n${userPrompt}`,
      });
    } else {
      parts.push({
        text: `Supplied Research Paper Text:\n---\n${text}\n---\n\n${userPrompt}`,
      });
    }

    // Retry wrapper for transient API spikes (e.g. 503 high demand or 429 rate limit)
    let response;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: studyKitSchema,
          },
        });
        break;
      } catch (callErr: unknown) {
        const errObj = callErr as { status?: number | string; message?: string };
        const isTransient =
          errObj?.status === 503 ||
          errObj?.status === 429 ||
          (errObj?.message && (errObj.message.includes('503') || errObj.message.includes('429') || errObj.message.includes('UNAVAILABLE')));

        if (isTransient && attempts < maxAttempts) {
          console.log(`Transient ${errObj.status || 'error'}, retrying attempt ${attempts + 1}/${maxAttempts}...`);
          await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
        } else {
          throw callErr;
        }
      }
    }

    if (!response || !response.text) {
      throw new Error('Gemini returned an empty response.');
    }

    const responseText = response.text;

    const kitData = JSON.parse(responseText);

    return res.json({
      success: true,
      data: kitData,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error generating study kit with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while analyzing the paper.',
    });
  }
});

// Mount Vite middleware in dev or serve dist in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PaperPilot Server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
