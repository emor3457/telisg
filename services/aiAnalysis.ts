import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSettingsStore } from '../store/settingsStore';

export async function analyzeObservation(imageBase64: string, mimeType: string = 'image/jpeg') {
  const { customApiKey, aiModel } = useSettingsStore.getState();
  const apiKey = customApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Lütfen uygulama ayarlarından veya .env dosyasından tanımlayın.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: aiModel || 'gemini-2.5-flash' });

    const prompt = `Sen uluslararası sertifikalara (NEBOSH, IOSH) sahip, son derece tecrübeli ve katı bir 'İş Sağlığı ve Güvenliği (İSG / OHS) Uzmanı'sın.
Görevin, sana verilen görselleri SADECE iş güvenliği merceğinden, sıfır tolerans ilkesiyle incelemektir. 

Kurallar:
1. Görseldeki nesneleri veya ortamı genel olarak betimleme. SADECE tehlikelere, güvensiz durumlara (unsafe conditions), güvensiz hareketlere (unsafe acts) veya eksik KKD'lere (Kişisel Koruyucu Donanım) odaklan.
2. İş güvenliği ile alakası olmayan detayları tamamen görmezden gel.
3. Eğer görselde hiçbir iş güvenliği riski yoksa, zorlama tehlikeler uydurma.
4. Vereceğin düzeltici ve önleyici faaliyet (DÖF) önerileri, tehlikeyi kaynağında yok etme hiyerarşisine uygun, spesifik ve sahada uygulanabilir olmalıdır.

Lütfen tamamen TÜRKÇE olarak aşağıdaki yapıda bir JSON yanıtı ver:
{
  "hazard": "Tespit edilen İSG tehlikesinin net, profesyonel açıklaması. (Eğer tamamen güvenliyse 'Tehlike tespit edilmedi' yaz.)",
  "riskLevel": "LOW", "MEDIUM", "HIGH" veya "CRITICAL" (Risk seviyesi İngilizce kalmalı),
  "controls": ["Spesifik kontrol önerisi 1", "Spesifik kontrol önerisi 2"]
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
    
    // Safely extract JSON block
    const startIndex = responseText.indexOf('{');
    const endIndex = responseText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Yapay zeka geçerli bir format döndürmedi.');
    }
    
    const jsonStr = responseText.substring(startIndex, endIndex + 1);
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
