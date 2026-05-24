import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey);

const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-2.5-pro';
const SYSTEM_PROMPT = `Anda adalah Travel Buddy AI yang santai, ramah, dan penuh gaya. Jawab dalam bahasa Indonesia dengan singkat, langsung ke poin, TAPI TETAP SERU dengan banyak emoji lucu & ekspresif.

**PENTING - Format Respons:**
- Jawab SINGKAT dan PADAT (maksimal 3-4 baris per rekomendasi)
- GUNAKAN EMOJI LUCU BANYAK-BANYAK untuk setiap baris respons 1 emoji saja 😄🎉🚀
- SELALU sertakan: nama lokasi/jalan, alamat spesifik, dan kisaran harga
- Gunakan format: "📍 [Nama] 😋 - [Lokasi Jalan] - Rp [Harga] 💰"
- Pisahkan setiap rekomendasi dengan line break
- Tambahkan komentar lucu/santai di akhir

**Contoh Format:**
📍 Rawon Setan 🍲 - Jl. Diponegoro No. 45 - Rp 25-35rb ✨
"Ini pilihan pas banget! Bisa puas perut hehehe 😆"

🍜 Soto Ayam Lamongan - Jl. Pemuda No. 12 - Rp 15-20rb 🔥
"Yang ini lebih murah tapi enak juga loh! 🤤"

Tanya preferensi user (budget, jenis destinasi, waktu) dengan santai dan lucu. Ingat: singkat, harga jelas, tapi TETAP FUN & PENUH EMOJI! 🌟`;

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;

    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return res.status(500).json({ error: 'GEMINI_API_KEY belum diset pada environment' });
    }

    try {
        if (!Array.isArray(conversation)) {
            throw new Error('Conversation harus berupa array');
        }

        const contents = conversation.map(({ role, text }) => {
            const normalizedRole = role === 'model' ? 'MODEL' : 'USER';
            return {
                role: normalizedRole,
                parts: [{ text }]
            };
        });

        async function fetchGemini(modelName) {
            return ai.models.generateContent({
                model: modelName,
                contents,
                config: {
                    temperature: 0.85,
                    maxOutputTokens: 1200,
                    systemInstruction: SYSTEM_PROMPT
                }
            });
        }

        let response;
        try {
            response = await fetchGemini(PRIMARY_MODEL);
        } catch (firstError) {
            const message = firstError?.message || '';
            if (message.includes('UNAVAILABLE') || message.includes('high demand') || message.includes('503')) {
                console.warn('Primary model unavailable, trying fallback model:', FALLBACK_MODEL, firstError.message);
                response = await fetchGemini(FALLBACK_MODEL);
            } else {
                throw firstError;
            }
        }

        let resultText = response.text || '';
        if (!resultText && Array.isArray(response.output)) {
            resultText = response.output
                .map(item => item?.content?.map(part => part.text || '').join(''))
                .join('\n')
                .trim();
        }

        if (!resultText) {
            throw new Error('Gemini API tidak mengembalikan teks respons');
        }

        res.status(200).json({ result: resultText });
    } catch (e) {
        console.error('API Chat error:', e);

        let errorMessage = typeof e.message === 'string' ? e.message : 'Internal Server Error';
        let statusCode = 500;

        try {
            const parsed = JSON.parse(errorMessage);
            if (parsed?.error?.message) {
                errorMessage = parsed.error.message;
            }

            if (parsed?.error?.code) {
                statusCode = parsed.error.code;
            } else if (parsed?.error?.status === 'RESOURCE_EXHAUSTED') {
                statusCode = 429;
            } else if (parsed?.error?.status === 'UNAVAILABLE') {
                statusCode = 503;
            }
        } catch {
            // keep raw error message if not JSON
        }

        res.status(statusCode).json({ error: errorMessage });
    }
});

const PORT = 3000;
app.listen(PORT, () => {console.log(`Server is running on port http://localhost:${PORT}`);});