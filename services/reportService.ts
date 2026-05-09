import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ObservationItem } from '../store/observationStore';

export async function generateObservationPDF(observation: ObservationItem) {
  const riskColor = observation.riskLevel === 'CRITICAL' ? '#991B1B' 
                  : observation.riskLevel === 'HIGH' ? '#DC2626' 
                  : observation.riskLevel === 'MEDIUM' ? '#F59E0B' : '#16A34A';
  
  const riskLabel = observation.riskLevel === 'CRITICAL' ? 'KRİTİK' 
                  : observation.riskLevel === 'HIGH' ? 'YÜKSEK' 
                  : observation.riskLevel === 'MEDIUM' ? 'ORTA' : 'DÜŞÜK';

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111827; }
          .header { border-bottom: 2px solid #0F766E; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 24px; font-weight: bold; color: #0F766E; }
          .date { font-size: 14px; color: #6B7280; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #374151; border-left: 4px solid #0F766E; padding-left: 10px; }
          .content { font-size: 16px; line-height: 1.6; }
          .risk-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; background-color: ${riskColor}; }
          .image-container { text-align: center; margin-bottom: 30px; }
          .observation-image { max-width: 100%; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .footer { margin-top: 50px; border-top: 1px solid #E5E7EB; pt: 20px; font-size: 12px; color: #9CA3AF; text-align: center; }
          ul { padding-left: 20px; }
          li { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${observation.displayId || 'İSG SAHA GÖZLEM RAPORU'}</div>
          <div class="date">${new Date(observation.date).toLocaleString('tr-TR')}</div>
        </div>

        <div class="image-container">
          ${observation.imageUri ? `<img src="${observation.imageUri}" class="observation-image" />` : '<p>Fotoğraf bulunamadı</p>'}
        </div>

        <div class="section">
          <div class="section-title">Tespit Edilen Tehlike</div>
          <div class="content">${observation.hazard}</div>
        </div>

        <div class="section">
          <div class="section-title">Risk Değerlendirmesi</div>
          <div class="content">
            <span class="risk-badge">${riskLabel}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Düzeltici ve Önleyici Faaliyetler (DÖF)</div>
          <div class="content">
            <ul>
              ${observation.controls.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="footer">
          Bu rapor EHS Management System tarafından ISO 45001 standartlarına uyumlu olarak oluşturulmuştur.<br/>
          ID: ${observation.id}
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    throw error;
  }
}
