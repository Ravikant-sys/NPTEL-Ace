const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

/**
 * Fetch an AI explanation for a quiz question.
 * @param {string} question - The question text
 * @param {string[]} options - The answer options
 * @param {number[]} correctIndices - Indices of correct answers
 * @param {string} [solution] - Existing solution text (for context)
 * @returns {Promise<string>} - AI-generated explanation
 */
export async function fetchAiHint({ question, options, correctIndices, solution }) {
  const correctAnswers = correctIndices.map(i => `${String.fromCharCode(65 + i)}. ${options[i]}`).join(', ');

  const prompt = `You are an expert NPTEL tutor. A student is practicing MCQs and needs a concise, clear explanation.

Question: ${question}

Options:
${options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n')}

Correct Answer(s): ${correctAnswers}
${solution ? `\nExisting Solution: ${solution}` : ''}

Provide a SHORT (3–5 sentences), student-friendly explanation of WHY the correct answer is right and why the other options are wrong. Use simple language. No need to restate the question.`;

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://nptel-cloud-mcq.onrender.com',
      'X-Title': 'NPTEL Ace',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? 'No explanation available.';
}
