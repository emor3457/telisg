import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ObservationItem } from '../store/observationStore';
import { useSettingsStore } from '../store/settingsStore';
import { colors } from '../theme/colors';

export async function generateObservationPDF(observation: ObservationItem) {
  const { 
    companyName, companyLogo, 
    userName, userTitle, 
    expertName 
  } = useSettingsStore.getState();

  const riskColor = observation.riskLevel === 'CRITICAL' ? '#991B1B' 
                  : observation.riskLevel === 'HIGH' ? colors.danger 
                  : observation.riskLevel === 'MEDIUM' ? colors.warning : colors.success;
  
  const riskLabel = observation.riskLevel === 'CRITICAL' ? 'KRİTİK' 
                  : observation.riskLevel === 'HIGH' ? 'YÜKSEK' 
                  : observation.riskLevel === 'MEDIUM' ? 'ORTA' : 'DÜŞÜK';

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          @page { margin: 20mm; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 0; color: ${colors.text}; background-color: white; }
          .header { border-bottom: 3px solid ${colors.accentOrange}; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
          .logo-container { height: 50px; display: flex; align-items: center; }
          .logo-img { height: 100%; object-fit: contain; }
          .logo-text { font-size: 24px; font-weight: 800; color: ${colors.text}; letter-spacing: -1px; }
          .report-type { font-size: 14px; font-weight: 700; color: ${colors.accentOrange}; text-transform: uppercase; }
          
          .main-title { font-size: 28px; font-weight: 800; margin-bottom: 5px; color: ${colors.text}; }
          .meta-info { font-size: 13px; color: ${colors.muted}; margin-bottom: 30px; }
          
          .section { margin-bottom: 35px; }
          .section-title { font-size: 16px; font-weight: 800; margin-bottom: 12px; color: ${colors.text}; text-transform: uppercase; border-bottom: 1px solid ${colors.surface}; padding-bottom: 5px; }
          .content { font-size: 15px; line-height: 1.6; color: #333; }
          
          .risk-badge { display: inline-block; padding: 6px 16px; border-radius: 6px; color: white; font-weight: bold; background-color: ${riskColor}; font-size: 13px; }
          
          .image-container { margin-bottom: 35px; border-radius: 12px; overflow: hidden; border: 1px solid ${colors.surface}; background-color: #f9f9f9; text-align: center; }
          .observation-image { width: 100%; max-height: 500px; object-fit: contain; display: block; margin: 0 auto; }
          
          .controls-list { padding-left: 20px; margin: 0; }
          .controls-list li { margin-bottom: 8px; }

          .signature-section { margin-top: 60px; display: flex; justify-content: space-between; gap: 40px; }
          .signature-box { flex: 1; border-top: 1px solid ${colors.text}; padding-top: 10px; text-align: center; }
          .signature-label { font-size: 12px; font-weight: 700; color: ${colors.muted}; text-transform: uppercase; margin-bottom: 40px; }
          .signature-name { font-size: 14px; font-weight: 700; color: ${colors.text}; }
          .signature-title { font-size: 12px; color: ${colors.muted}; margin-top: 2px; }

          .footer { margin-top: 60px; font-size: 11px; color: ${colors.muted}; text-align: center; border-top: 1px solid ${colors.surface}; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            ${companyLogo 
              ? `<img src="${companyLogo}" class="logo-img" />` 
              : `<div class="logo-text">${companyName}<span style="color:${colors.accentOrange}">PRO</span></div>`
            }
          </div>
          <div class="report-type">Saha Gözlem Raporu</div>
        </div>

        <div class="main-title">${observation.displayId || 'İSG-GÖZLEM'}</div>
        <div class="meta-info">Oluşturulma Tarihi: ${new Date(observation.date).toLocaleString('tr-TR')}</div>

        <div class="image-container">
          ${observation.imageUri 
            ? `<img src="${observation.imageUri}" class="observation-image" />` 
            : '<div style="padding:40px; text-align:center; color:#999;">Fotoğraf Eklenmedi</div>'
          }
        </div>

        <div class="section">
          <div class="section-title">Tespit Edilen Tehlike / Durum</div>
          <div class="content">${observation.hazard}</div>
        </div>

        <div class="section">
          <div class="section-title">Risk Değerlendirmesi</div>
          <div class="content">
            <span class="risk-badge">${riskLabel} RİSK</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Düzeltici ve Önleyici Faaliyet Önerileri</div>
          <div class="content">
            <ul class="controls-list">
              ${observation.controls.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-label">Hazırlayan</div>
            <div style="height: 60px;"></div>
            <div class="signature-name">${userName || 'Ad Soyad Belirtilmedi'}</div>
            <div class="signature-title">${userTitle}</div>
          </div>
          <div class="signature-box">
            <div class="signature-label">Onaylayan</div>
            <div style="height: 60px;"></div>
            <div class="signature-name">${expertName}</div>
            <div class="signature-title">İSG Uzmanı</div>
          </div>
        </div>

        <div class="footer">
          Bu rapor ISO 45001:2018 standartlarına uygun olarak <strong>${companyName}</strong> adına TELISGPRO üzerinden oluşturulmuştur.<br/>
          <strong>TELISGPRO EHS Management System</strong>
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


