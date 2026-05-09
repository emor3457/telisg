import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeObservation(imageBase64: string, mimeType: string = 'image/jpeg') {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Lütfen .env dosyasında EXPO_PUBLIC_GEMINI_API_KEY tanımlayın.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Bu görseli iş sağlığı ve güvenliği (İSG / EHS) tehlikeleri açısından analiz et.
Lütfen tamamen TÜRKÇE olarak aşağıdaki yapıda bir JSON yanıtı ver:
{
  "hazard": "Tespit edilen ana tehlikenin kısa bir açıklaması (veya güvenliyse 'Tehlike tespit edilmedi')",
  "riskLevel": "LOW", "MEDIUM", "HIGH" veya "CRITICAL" (Burası İngilizce kalmalı),
  "controls": ["Kontrol önerisi 1", "Kontrol önerisi 2"]
}
SADECE geçerli bir JSON döndür. Markdown kod blokları veya başka bir metin ekleme.`;

    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    const jsonStr = responseText.replace(/```json\n?|```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return {
      hazard: data.hazard || 'Bilinmiyor',
      riskLevel: data.riskLevel || 'MEDIUM',
      controls: data.controls || [],
    };
  } catch (error) {
    console.error('Yapay zeka analiz hatası:', error);
    throw error;
  }
}
